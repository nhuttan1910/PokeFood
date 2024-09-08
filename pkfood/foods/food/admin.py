from django.contrib import admin
from django.template.response import TemplateResponse
from django.urls import path
from .models import *
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncMonth
from datetime import datetime
from django.shortcuts import render
import json

class AdminSite(admin.AdminSite):
    site_header = 'PokeFood AdminSite'

    def get_urls(self):
        return [
            path('app-stats/', self.app_stats)
        ] + super().get_urls()

    def app_stats(self, request):
        year = request.GET.get('year', datetime.now().year)

        # Doanh thu theo tháng
        revenue_by_month = OrderDetail.objects.select_related('order').annotate(
            month=TruncMonth('order__created_date')
        ).values('month').annotate(
            revenue=Sum(F('quantity') * F('food__price'))
        ).order_by('month')

        # Số lần đặt món ăn theo tháng
        food_order_count_by_month = OrderDetail.objects.select_related('food', 'order').annotate(
            month=TruncMonth('order__created_date')
        ).values('month', 'food__name').annotate(
            order_count=Sum('quantity')
        ).order_by('month', 'food__name')

        # Số lượng đơn hàng theo tháng
        order_count_by_month = Order.objects.annotate(
            month=TruncMonth('created_date')
        ).values('month').annotate(
            order_count=Count('id')
        ).order_by('month')

        # Chuyển đổi dữ liệu thành định dạng JSON cho template
        context = {
            'year': year,
            'revenue_labels': json.dumps([entry['month'].strftime('%Y-%m') for entry in revenue_by_month]),
            'revenue_data': json.dumps([entry['revenue'] for entry in revenue_by_month]),
            'food_order_labels': json.dumps([entry['food__name'] for entry in food_order_count_by_month]),
            'food_order_data': json.dumps([entry['order_count'] for entry in food_order_count_by_month]),
            'order_count_labels': json.dumps([entry['month'].strftime('%Y-%m') for entry in order_count_by_month]),
            'order_count_data': json.dumps([entry['order_count'] for entry in order_count_by_month]),
        }

        return render(request, 'admin/app-stats.html', context)

admin_site = AdminSite('pokeshop')
