from django.db import models
from django.db.models.fields import CharField, URLField
from django.db.models.fields.files import ImageField


class Proyecto(models.Model):
    title = CharField(max_length=100)
    descrition = CharField(max_length=250)
    image = ImageField(upload_to='portfolio/images/')
    url = URLField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)


    
