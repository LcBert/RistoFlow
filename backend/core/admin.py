from django.contrib import admin

from core.models import (
    Category,
    Dish,
    Order,
    OrderItem,
    RestaurantConfig,
    Table
)


@admin.register(RestaurantConfig)
class RestaurantConfigAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not RestaurantConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "is_available")
    list_filter = ("category", "is_available")
    search_fields = ("name", "description")
    list_editable = ("price", "is_available")


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ("number", "seats", "status")
    search_fields = ("number",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    ...


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    ...
