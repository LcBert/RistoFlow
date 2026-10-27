from rest_framework import serializers
from core.models import (
    Dish,
    Order,
    OrderItem,
    RestaurantConfig,
    Table,
)


class RestaurantConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantConfig
        fields = [
            'name',
        ]


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ["id", "name", "price", "is_available", "category"]


class OrderItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(source="dish.name", read_only=True)
    subtotal = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'dish', 'dish_name', 'quantity', 'unit_price', 'notes', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'table', 'status', 'status_display', 'covers', 'opened_at', 'total_price', 'items']


class TableSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Table
        fields = ['number', 'seats', 'status', 'status_display']
