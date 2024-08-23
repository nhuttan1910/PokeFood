from _ast import Store

from django.http import HttpResponse
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Food, Category, StoreDetail
from .serializers import FoodSerializer, CategorySerializer, StoreSerializer


def index(request):
    return HttpResponse("Poke Shop")


class FoodViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer

    @action(methods=['get'], url_path='find', detail=False)
    def get_food(self, request):
        kw = request.query_params.get('kw', None)
        if kw:
            find_food = Food.objects.filter(name__icontains=kw)
            serializer = FoodSerializer(find_food, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No search term provided."}, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class StoreViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = StoreDetail.objects.all()
    serializer_class = StoreSerializer