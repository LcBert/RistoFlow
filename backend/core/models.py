from decimal import Decimal
from typing import TYPE_CHECKING

from django.db import models

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager


class RestaurantConfig(models.Model):
    name = models.CharField(max_length=150, default="Mio Ristorante", verbose_name="Restaurant Name")
    logo = models.ImageField(upload_to="restaurant/", blank=True, null=True, verbose_name="Logo")

    class Meta:
        verbose_name = "Restaurant Configuration"
        verbose_name_plural = "Restaurant Configuration"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(
            pk=1,
            defaults={
                "name": "Mio Ristorante"
            }
        )
        return obj


class Category(models.Model):
    if TYPE_CHECKING:
        dishes: RelatedManager["Dish"]

    name = models.CharField(primary_key=True, max_length=100, unique=True, verbose_name="Category name")
    description = models.TextField(blank=True, verbose_name="Description")

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    @property
    def all_dishes(self):
        return self.dishes


class Dish(models.Model):
    name = models.CharField(max_length=150, verbose_name="Dish name")
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="dishes",
        verbose_name="Categoria",
    )
    description = models.TextField(blank=True, verbose_name="Description")
    price = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Price (€)")
    is_available = models.BooleanField(default=True, verbose_name="Available")

    class Meta:
        verbose_name = "Dish"
        verbose_name_plural = "Dishes"
        ordering = ["category", "name"]

    def __str__(self):
        return f"{self.name} ({self.price} €)"


class TableStatus(models.TextChoices):
    FREE = "FREE", "Free"
    OCCUPIED = "OCCUPIED", "Occupied"
    RESERVED = "RESERVED", "Reserved"


class Table(models.Model):
    number = models.IntegerField(primary_key=True, unique=True, verbose_name="Table number")
    seats = models.IntegerField(verbose_name="Seats")
    status = models.CharField(
        max_length=10,
        choices=TableStatus.choices,
        default=TableStatus.FREE
    )

    class Meta:
        verbose_name = "Table"
        verbose_name_plural = "Tables"
        ordering = ["number"]

    def __str__(self) -> str:
        return f"{self.number} ({self.seats}) - [{self.status}]"


class OrderStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    BILLED = "BILLED", "Billed"
    CLOSED = "CLOSED", "Closed"
    CANCELLED = "CANCELLED", "Cancelled"


class Order(models.Model):
    if TYPE_CHECKING:
        items: RelatedManager["OrderItem"]

    id = models.BigAutoField(primary_key=True, verbose_name="Id")
    table = models.ForeignKey(
        Table,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="Table"
    )
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.OPEN,
        verbose_name="Status"
    )
    covers = models.PositiveIntegerField(default=1, verbose_name="Covers")
    opened_at = models.DateTimeField(auto_now_add=True, verbose_name="Opened at")

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ["-opened_at"]

    def __str__(self) -> str:
        return f"Tavolo {self.table.number} ({self.status})"

    @property
    def total_price(self) -> Decimal:
        return sum((item.subtotal for item in self.items.all()), Decimal(0.0))


class OrderItemStatus(models.TextChoices):
    ORDERED = "ORDERED", "Ordered"
    IN_PREPARATION = "IN_PREPARATION", "In preparation"
    READY = "READY", "Ready"
    SERVED = "SERVED", "Served"
    VOIDED = "VOIDED", "Voided"


class OrderItem(models.Model):
    id = models.BigAutoField(primary_key=True, verbose_name="Id")
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="Order"
    )
    dish = models.ForeignKey(
        Dish,
        on_delete=models.PROTECT,
        related_name="order_items",
        verbose_name="Dish"
    )
    status = models.CharField(
        max_length=20,
        choices=OrderItemStatus.choices,
        default=OrderItemStatus.ORDERED,
        verbose_name="Status"
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name="Quantity")
    unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="Unit price at order (€)"
    )
    notes = models.CharField(max_length=255, blank=True, verbose_name="Notes / Variations")

    class Meta:
        verbose_name = "Order item"
        verbose_name_plural = "Order items"

    def __str__(self) -> str:
        return f"{self.quantity}x {self.dish.name}"

    def save(self, *args, **kwargs) -> None:
        if self.unit_price is None and self.dish:
            self.unit_price = self.dish.price
        super().save(*args, **kwargs)

    @property
    def subtotal(self) -> Decimal:
        if self.unit_price is not None:
            return self.unit_price * self.quantity
        return Decimal("0.00")
