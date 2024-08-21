from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer
from .models import *

class FoodSerializer(ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'name', 'price', 'description', 'image', 'category']
