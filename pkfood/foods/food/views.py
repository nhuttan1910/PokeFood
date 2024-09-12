from django.http import HttpResponse
from rest_framework import viewsets, status, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from .models import *
from django.utils import timezone
from django.utils.dateparse import parse_date
from .serializers import *
from rest_framework.parsers import MultiPartParser
from food import serializers, paginator
import hmac, uuid, hashlib, requests, json,logging
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone


def index(request):
    return HttpResponse("Poke Shop")


class FoodViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer

    @action(methods=['get'], url_path='search', detail=False)
    def get_food(self, request):
        kw = request.query_params.get('kw', None)

        if kw:
            food = Food.objects.filter(name__icontains=kw, active=True)
            if food.exists():
                serializer = FoodSerializer(food, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No food found with that name."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "No search term provided."}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='category', detail=False)
    def get_food_by_category(self, request):
        category = request.query_params.get('category', None)
        if category is not None:
            food = Food.objects.filter(category=category)
            return Response(FoodSerializer(food, many=True).data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Category parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class StoreViewSet(viewsets.ModelViewSet):
    queryset = StoreDetail.objects.all()
    serializer_class = StoreSerializer

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer


class AccountViewSet(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.CreateAPIView,
                  generics.RetrieveAPIView):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = AccountSerializer
    parser_classes = [MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(AccountSerializer(user).data)

    @action(methods=['post'], detail=False, url_path='create-account')
    def create_account(self, request):
        fn = request.data.get('firstname', 'new')
        ln = request.data.get('lastname', 'account')
        un = request.data.get('username')
        pw = request.data.get('password')
        e = request.data.get('email')
        a = request.data.get('address')
        avatar = request.data.get('avatar')
        phone = request.data.get('phone')

        user = Account.objects.create(
            first_name=fn,
            last_name=ln,
            username=un,
            email=e,
            address=a,
            phone=phone,
            avatar=avatar
        )

        user.set_password(pw)
        user.save()
        cart = Cart.objects.create(account=user)
        cart.save()
        return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)


class CartViewSet(viewsets.ViewSet,generics.ListAPIView,
                  generics.CreateAPIView,
                  generics.RetrieveAPIView):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()

    # def get_permissions(self):
    #     if self.action in ['get_current_user']:
    #         return [permissions.IsAuthenticated()]
    #
    #     return [permissions.AllowAny()]

    @action(methods=['patch'], url_path='add', detail=False)
    def add_to_cart(self, request):
        user_id = request.user.id

        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cart = Cart.objects.get(account=user_id)
        except Cart.DoesNotExist:
            return Response({"error": "No cart found."}, status=status.HTTP_404_NOT_FOUND)
        except Cart.MultipleObjectsReturned:
            return Response({"error": "Multiple carts found."}, status=status.HTTP_400_BAD_REQUEST)

        food_id = request.data.get('food_id')
        if not food_id:
            return Response({"error": "Food ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        quantity = request.data.get('quantity', 1)

        try:
            food = Food.objects.get(id=food_id)
        except Food.DoesNotExist:
            return Response({"error": "Food not found."}, status=status.HTTP_404_NOT_FOUND)

        # Tạo hoặc update cart details
        cart_detail, created = CartDetail.objects.get_or_create(cart=cart, food=food)
        if not created:
            cart_detail.quantity += quantity
        else:
            cart_detail.quantity = quantity

        cart_detail.save()

        return Response(CartDetailSerializer(cart_detail).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='update-item', detail=False)
    def update_cart_item(self, request):
        user_id = request.user.id
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        item_id = request.data.get('id')
        new_quantity = request.data.get('quantity')

        if not item_id or new_quantity is None:
            return Response({"error": "Item ID and quantity are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(account=user_id)
            cart_detail = CartDetail.objects.get(cart=cart, id=item_id)
            cart_detail.quantity = new_quantity
            cart_detail.save()
            return Response(CartDetailSerializer(cart_detail).data, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)
        except CartDetail.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='current-cart', detail=False)
    def get_cart(self, request):
        user_id = request.user.id
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(account=user_id)
        except Cart.DoesNotExist:
            return Response({"error": "No cart found for the user."}, status=status.HTTP_404_NOT_FOUND)

        cart_details = CartDetail.objects.filter(cart=cart)
        cart_serializer = CartSerializer(cart)
        cart_details_serializer = CartDetailSerializer(cart_details, many=True)

        return Response({
            "cart": cart_serializer.data,
            "cart_details": cart_details_serializer.data
        })

    @action(methods=['delete'], url_path='remove-item', detail=False)
    def remove_from_cart(self, request):
        user_id = request.user.id
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        item_id = request.data.get('id')
        if not item_id:
            return Response({"error": "Item ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(account=user_id)
        except Cart.DoesNotExist:
            return Response({"error": "No cart found for the user."}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart_detail = CartDetail.objects.get(cart=cart, id=item_id)
            cart_detail.delete()
            return Response({"message": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)
        except CartDetail.DoesNotExist:
            return Response({"error": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)


class CartDetailsViewSet(viewsets.ViewSet, generics.ListAPIView,
                  generics.CreateAPIView,
                  generics.RetrieveAPIView):
    queryset = CartDetail.objects.all()
    serializer_class = CartDetailSerializer


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView,
                  generics.CreateAPIView,
                  generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(methods=['post'], url_path='create-order', detail=False)
    def create_order(self, request):
        user_id = request.user.id

        try:
            user = Account.objects.get(id=user_id)
        except Account.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart = Cart.objects.get(account=user)
        except Cart.DoesNotExist:
            return Response({"error": "No cart found for the user."}, status=status.HTTP_404_NOT_FOUND)

        cart_details = CartDetail.objects.filter(cart=cart)
        if not cart_details.exists():
            return Response({"error": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        order_data = {
            "address": request.data.get('address'),
            "pay_date": timezone.now().date(),
        }
        serializer = self.get_serializer(data=order_data)
        if serializer.is_valid():
            order = serializer.save(account=user)

            order_details = []
            for cart_detail in cart_details:
                food = cart_detail.food
                quantity = cart_detail.quantity
                amount = food.price * quantity
                order_detail = OrderDetail(order=order, food=food, quantity=quantity, amount=amount)
                order_details.append(order_detail)

            OrderDetail.objects.bulk_create(order_details)
            cart_details.delete()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['patch'], url_path='is_confirm', detail=False)
    def confirm(self, request):
        order_id = request.data.get('order_id')
        order = Order.objects.get(id=order_id)
        order.is_confirmed = True
        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)



class OrderDetailViewSet(viewsets.ViewSet, generics.ListAPIView,
                       generics.CreateAPIView,
                       generics.RetrieveAPIView):
        queryset = OrderDetail.objects.all()
        serializer_class = OrderDetailSerializer


class PayViewSet(viewsets.ViewSet):

    def generate_signature(self, raw_data, secret_key):
        return hmac.new(secret_key.encode('utf-8'), raw_data.encode('utf-8'), hashlib.sha256).hexdigest()

    @action(methods=['POST'], detail=False, url_path='create-payment')
    def create_payment(self, request):
        # Lấy thông tin từ request
        order_id = request.data.get('id')
        if not order_id:
            return Response({"error": "Order ID is required."}, status=400)
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)

        order_details = OrderDetail.objects.filter(order=order)
        total_amount = sum(detail.amount for detail in order_details)

        request_id = str(uuid.uuid4())

        unique_order_id = f"{order_id}_{uuid.uuid4().hex[:8]}"

        raw_signature = f"accessKey={settings.MOMO_ACCESS_KEY}&amount={total_amount}&extraData=&ipnUrl={settings.NOTIFY_URL}&orderId={unique_order_id}&orderInfo=Thanh toan don hang&partnerCode={settings.MOMO_PARTNER_CODE}&redirectUrl={settings.RETURN_URL}&requestId={request_id}&requestType=captureWallet"
        signature = self.generate_signature(raw_signature, settings.MOMO_SECRET_KEY)

        payload = {
            "partnerCode": settings.MOMO_PARTNER_CODE,
            "accessKey": settings.MOMO_ACCESS_KEY,
            "requestId": request_id,
            "amount": total_amount,
            "orderId": unique_order_id,
            "orderInfo": "Thanh toan don hang",
            "redirectUrl": settings.RETURN_URL,
            "ipnUrl": settings.NOTIFY_URL,
            "extraData": "",
            "requestType": "captureWallet",
            "signature": signature
        }

        response = requests.post(settings.MOMO_ENDPOINT, json=payload)
        data = response.json()


        if data.get('resultCode') == 0:
            return Response({"payUrl": data['payUrl']})
        else:
            return Response({"error": data.get('message')}, status=400)

    @method_decorator(csrf_exempt, name='dispatch')
    @action(methods=['POST'], detail=False, url_path='payment-callback')
    def payment_callback(self, request):
        data = request.data

        raw_signature = f"amount={data['amount']}&orderId={data['orderId']}&orderInfo={data['orderInfo']}&orderType={data['orderType']}&partnerCode={data['partnerCode']}&requestId={data['requestId']}&responseTime={data['responseTime']}&resultCode={data['resultCode']}&transId={data['transId']}"
        signature = self.generate_signature(raw_signature, settings.MOMO_SECRET_KEY)

        if signature != data['signature']:
            return Response({"error": "Invalid signature."}, status=status.HTTP_400_BAD_REQUEST)

        if data['resultCode'] == 0:
            order_id = data['orderId']
            try:
                order = Order.objects.get(id=order_id)
                order.pay = True
                order.pay_date = timezone.now()
                order.save()
                return Response({"message": "Payment successful."}, status=status.HTTP_200_OK)
            except Order.DoesNotExist:
                return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": data.get('message')}, status=status.HTTP_400_BAD_REQUEST)




