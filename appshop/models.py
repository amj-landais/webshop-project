from django.db import models


# Create your models here.

class Item(models.Model):

    class Status(models.TextChoices):
        WAITING = 'WAITING'
        SALE = 'SALE'
        SOLD = 'SOLD'

    title = models.CharField(max_length=25)
    description = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    seller = models.CharField(max_length=15)
    buyer = models.CharField(max_length=15, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices)

    created_date = models.DateTimeField(auto_now_add=True)  # store the date automatically, no need to provide it during the creation
    date_modified = models.DateTimeField(auto_now=True)
