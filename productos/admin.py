from django.contrib import admin
from .models import Producto, Order, OrderItem


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('title','precio')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('title','price','quantity')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','created_at','total_clp','paid')
    inlines = [OrderItemInline]
