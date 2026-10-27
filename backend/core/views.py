from django.http import HttpRequest
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST
from rest_framework import viewsets

from core.serializers import (
    DishSerializer,
    OrderItemSerializer,
    OrderSerializer,
    TableSerializer
)
from .models import (
    Dish,
    Order,
    OrderItem,
    Table,
)


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all().order_by('number')
    serializer_class = TableSerializer


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.filter(is_available=True)
    serializer_class = DishSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('items__dish')
    serializer_class = OrderSerializer


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
