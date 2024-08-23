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