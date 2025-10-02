from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from decimal import Decimal
import json
from .models import Producto, Order, OrderItem
from django.contrib.auth.decorators import login_required


# 2.
from django.contrib.auth.decorators import login_required


def cart_checkout(request):
    if request.method == "POST":
        data = json.loads(request.body)
        monto = data.get("total", 0)
        return render(request, "webpay_prueba.html", {"monto": monto})

@login_required
def producto(request):
    # tu código actual
    return render(request, 'productos.html')


# Transbank imports
from transbank.webpay.webpay_plus.transaction import Transaction

@login_required
def webpay_prueba(request):
    carrito = request.session.get("carrito", {})  # Recupera el carrito desde la sesión
    total = Decimal(0)
    for producto_id, item in carrito.items():
        total += Decimal(item["precio"]) * item["cantidad"]  # Precio * Cantidad

    return render(request, "productos/webpay_prueba.html", {"monto": total})

def webpay_prueba(request):
    if request.method == "POST":
        data = json.loads(request.body)
        items = data.get("items", [])
        monto = sum(item["price"] * item["quantity"] for item in items)
        return render(request, "webpay_prueba.html", {"monto": monto})
    else:
        # Si alguien entra por GET, puedes mostrar un monto vacío
        return render(request, "webpay_prueba.html", {"monto": 0})

# 2.
#def webpay_prueba(request):
#    monto = request.GET.get('monto', 0)
#    return render(request, 'productos/webpay_prueba.html', {'monto': monto})

# @csrf_exempt
#def webpay_prueba(request):
#    if request.method == "POST":
#        monto = request.POST.get("monto")
#        return render(request, "productos/webpay_prueba.html", {"monto": monto})
#    return render(request, "productos/webpay_prueba.html", {"monto": 0})


def producto(request):
    productos = Producto.objects.all()
    return render(request, 'productos/productos.html', {'productos': productos})


@csrf_exempt
def cart_checkout(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Invalid method")

    try:
        payload = json.loads(request.body)
        items = payload.get('items', [])
        name = payload.get('name','')
        email = payload.get('email','')
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    total = Decimal('0.00')
    for it in items:
        total += Decimal(str(it.get('price', 0))) * int(it.get('quantity', 1))

    order = Order.objects.create(total_clp=total, name=name, email=email)

    for it in items:
        producto_id = it.get('id')
        OrderItem.objects.create(
            order=order,
            producto_id=producto_id if producto_id else None,
            title=it.get('title'),
            price=Decimal(str(it.get('price', 0))),
            quantity=int(it.get('quantity', 1))
        )

    tx = Transaction()
    buy_order = str(order.id)
    session_id = f"order-{order.id}"
    amount = float(total)
    return_url = request.build_absolute_uri('/cart/confirm/')

    create_response = tx.create(buy_order=buy_order, session_id=session_id,
                                amount=amount, return_url=return_url)

    token = create_response.token
    url = create_response.url
    order.transaction_token = token
    order.save()

    html = f"""
    <html>
    <body>
      <form id="webpay" action="{url}" method="POST">
        <input type="hidden" name="token_ws" value="{token}"/>
      </form>
      <script>document.getElementById('webpay').submit();</script>
    </body>
    </html>
    """
    return HttpResponse(html)


@csrf_exempt
def cart_confirm(request):
    token = request.POST.get('token_ws') or request.GET.get('token_ws')
    if not token:
        return HttpResponseBadRequest("No token")

    # Para prueba solo mostramos el token recibido
    return HttpResponse(f"Simulación de confirmación de pago. Token recibido: {token}")
