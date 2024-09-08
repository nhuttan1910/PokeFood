from django.contrib import admin
from django.template.response import TemplateResponse
from django.urls import path
from .models import *
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncMonth

class AdminSite(admin.AdminSite):
    site_header = 'PokeFood AdminSite'

    def get_urls(self):
        return [
            path('app-stats/', self.app_stats)
        ] + super().get_urls()

    def app_stats(self, request):
        # Thống kê doanh thu theo từng tháng
        revenue_by_month = OrderDetail.objects.annotate(
            month=TruncMonth('created_date')
        ).values('month').annotate(
            revenue=Sum(F('quantity') * F('food__price'))
        ).order_by('month')

        # Thống kê số lần đặt món ăn theo từng tháng
        food_order_count_by_month = OrderDetail.objects.annotate(
            month=TruncMonth('created_date')
        ).values('month', 'food__name').annotate(
            order_count=Sum('quantity')
        ).order_by('month', 'food__name')

        # Thống kê số lượng đơn hàng theo từng tháng
        order_count_by_month = Order.objects.annotate(
            month=TruncMonth('created_date')
        ).values('month').annotate(
            order_count=Count('id')
        ).order_by('month')

        food = Food.objects.annotate()

        return TemplateResponse(request, 'admin/app-stats.html', {
            'revenue_by_month': revenue_by_month,
            'food_order_count_by_month': food_order_count_by_month,
            'order_count_by_month': order_count_by_month,
            'food' : food
        })

admin_site = AdminSite('pokeshop')
