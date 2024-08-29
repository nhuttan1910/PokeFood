from django.http import HttpResponse
from rest_framework import viewsets, status, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from .models import *
from .serializers import *
from rest_framework.parsers import MultiPartParser
from food import serializers, paginator


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

class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class StoreViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = StoreDetail.objects.all()
    serializer_class = StoreSerializer


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

        # Tạo người dùng với các thông tin cơ bản
        user = Account.objects.create(
            first_name=fn,
            last_name=ln,
            username=un,
            email=e,
            address=a,
            phone=phone,
            avatar=avatar
        )

        # Thiết lập mật khẩu bằng phương thức set_password()
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
        user_id = request.user.id   #Xác định user trong session hiện tại để lấy cart

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


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView,
                  generics.CreateAPIView,
                  generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(methods=['patch'], url_path='is_confirm', detail=False)
    def confirm(self, request):
        order_id = request.data.get('order_id')
        order = Order.objects.get(id=order_id)
        order.is_confirmed = True
        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


    class OrderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView):
        queryset = Order.objects.all()
        serializer_class = OrderSerializer

        def create(self, request, *args, **kwargs):
            user = request.user

            try:
                cart = Cart.objects.get(account=user)
            except Cart.DoesNotExist:
                return Response({"error": "No cart found for the user."}, status=status.HTTP_404_NOT_FOUND)

            cart_details = CartDetail.objects.filter(cart=cart)
            if not cart_details.exists():
                return Response({"error": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

            order_data = {
                "address": request.data.get('address', cart.address),
                "pay_date": request.data.get('pay_date', None),
            }
            serializer = self.get_serializer(data=order_data)
            serializer.is_valid(raise_exception=True)
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


class OrderDetailViewSet(viewsets.ViewSet, generics.ListAPIView,
                       generics.CreateAPIView,
                       generics.RetrieveAPIView):
        queryset = OrderDetail.objects.all()
        serializer_class = OrderDetailSerializer



