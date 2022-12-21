from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render, reverse
from appshop.models import Item

def get_landing_page(request):
    nb_items = Item.objects.count()
    nb_users = User.objects.count()

    return render(request, "landing_page.html", {"nb_items": nb_items, "nb_users": nb_users})


def go_shop(request):
    return HttpResponseRedirect(reverse("shop"))
