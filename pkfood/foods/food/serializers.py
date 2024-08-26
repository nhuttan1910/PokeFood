from _ast import Store

from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer
from .models import *


class FoodSerializer(ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'name', 'price', 'description', 'image', 'category']


class CategorySerializer(ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'image']


class StoreSerializer(ModelSerializer):
    class Meta:
        model = StoreDetail
        fields = ['id', 'name', 'image']


class AccountSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'email', 'avatar', 'phone', 'address']

        extra_kwargs = {
            'password': {'write_only': 'true'}
        }

        def create(self, validated_data):
            data = validated_data.copy()

            user = Account(**data)
            user.set_password(data["password"])

            user.save()

            return user


class CartSerializer(ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id', 'account']


class CartDetailSerializer(ModelSerializer):
    class Meta:
        model = CartDetail
        fields = ['id', 'cart', 'food', 'quantity']


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'confirmed', 'state', 'pay', 'pay_date','address', 'account']


class OrderDetailSerializer(ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = ['id', 'quantity', 'amount', 'order', 'food']

