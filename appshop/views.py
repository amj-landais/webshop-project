from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, reverse
from django.views import View
from rest_framework.authtoken.models import Token
from appshop.models import Item


# Create your views here.

def get_landing_page(request):
    nb_items = len(Item.objects.all())
    nb_users = len(User.objects.all())
    return render(request, "landing_page.html", {"nb_items": nb_items, "nb_users": nb_users})


def add_user(request):
    user = User(username="my_username", password="my_password", email="my_email")
    user.save()
    return get_landing_page(request)


def add_item(request):
    return render(request, "add_item.html")


def go_shop(request):
    return HttpResponseRedirect(reverse("shop"));


class AddItem(View):
    def get(self, request):
        return render(request, "add_item.html")

    def post(self, request):  # should redirect to a different URL !!!
        title = request.POST.get('title')
        description = request.POST.get('description')
        price = request.POST.get('price')
        seller = request.POST.get('seller')
        buyer = request.POST.get('buyer')
        status = request.POST.get('status')
        print(title, description, price, seller, buyer, status)
        item = Item(title=title, description=description, price=float(price), seller=seller,
                    buyer=buyer, status=status)
        item.save()

        return HttpResponseRedirect(reverse("home"))



