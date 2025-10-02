from django.shortcuts import render
from .models import Proyecto

from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
import json
# 2.


def home(request):
    proyectos = Proyecto.objects.all() 
    return render(request, 'home.html', {'proyecto': proyectos})  

def webpay_prueba(request):
    return render(request, 'webpay_prueba.html')

# 2.
class CustomLoginView(LoginView):
    template_name = 'login.html'
    redirect_authenticated_user = True

def cart_checkout(request):
    if request.method == "POST":
        data = json.loads(request.body)
        monto = data.get("total", 0)
        return render(request, "webpay_prueba.html", {"monto": monto})