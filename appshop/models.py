from django.contrib.auth.models import User
from django.db import models

class Item(models.Model):
    class Status(models.TextChoices):
        WAITING = 'WAITING'
        SALE = 'SALE'
        SOLD = 'SOLD'

    title = models.CharField(max_length=25)
    description = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    seller = models.ForeignKey(User, to_field='username', default=None,
                               on_delete=models.DO_NOTHING, related_name="username_seller")
    buyer = models.ForeignKey(User, to_field='username', blank=True, null=True, default=None,
                              on_delete=models.DO_NOTHING, related_name="username_buyer")
    status = models.CharField(max_length=10, choices=Status.choices)

    created_date = models.DateTimeField(
        auto_now_add=True)  # store the date automatically, no need to provide it during the creation
    date_modified = models.DateTimeField(auto_now=True)
