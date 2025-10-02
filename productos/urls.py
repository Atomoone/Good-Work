from django.urls import path, include
from . import views

app_name = 'productos'
urlpatterns = [
    path('', views.producto, name='producto'),
]

urlpatterns = [
    path('', views.producto, name='producto'),  # Vista principal de productos
    path("webpay-prueba/", views.webpay_prueba, name="webpay_prueba"),
]
