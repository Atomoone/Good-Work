from django.db import models
from django.db.models.fields import CharField, URLField
from django.db.models.fields.files import ImageField
from django.conf import settings

class Producto(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='productos/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0) 

    def __str__(self):
        return self.title

class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    total_clp = models.DecimalField(max_digits=12, decimal_places=2)
    paid = models.BooleanField(default=False)
    transaction_token = models.CharField(max_length=255, blank=True, null=True)  # token from webpay
    # optional: customer info
    name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)

    def __str__(self):
        return f"Order {self.id} - {self.total_clp}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.price * self.quantity