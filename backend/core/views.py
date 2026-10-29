from django.db import transaction
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RestaurantConfig, TableStatus
from .serializers import RestaurantConfigSerializer

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


class RestaurantConfigView(APIView):
    def get(self, request):
        config = RestaurantConfig.load()
        serializer = RestaurantConfigSerializer(config, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        config = RestaurantConfig.load()
        serializer = RestaurantConfigSerializer(config, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all().order_by('number')
    serializer_class = TableSerializer


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.select_related('category').all().order_by('id')
    serializer_class = DishSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('items__dish')
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            order = serializer.save()
            order.table.status = TableStatus.OCCUPIED
            order.table.save()


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
