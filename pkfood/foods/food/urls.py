from django.urls import path, include
from . import views
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from .admin import admin_site
router = routers.DefaultRouter()
router.register('food', views.FoodViewSet)
router.register('category', views.CategoryViewSet)
router.register('store', views.StoreViewSet)
router.register('user', views.AccountViewSet, basename='user')
router.register('cart', views.CartViewSet, basename='cart')
router.register('order',views.OrderViewSet, basename='order')
router.register(r'order-details', views.OrderDetailViewSet, basename='order-detail')
router.register('cart-details', views.CartDetailViewSet, basename='cart-detail')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin_site.urls),
]