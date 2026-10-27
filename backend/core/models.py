from decimal import Decimal

from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Category name")
    description = models.TextField(blank=True, verbose_name="Description")

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Dish(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="dishes",
        verbose_name="Categoria",
    )

    name = models.CharField(max_length=150, verbose_name="Dish name")
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


class OrderItemStatus(models.TextChoices):
    ORDERED = "ORDERED", "Ordered"
    IN_PREPARATION = "IN_PREPARATION", "In preparation"
    READY = "READY", "Ready"
    SERVED = "SERVED", "Served"
    VOIDED = "VOIDED", "Voided"


class OrderItem(models.Model):
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
