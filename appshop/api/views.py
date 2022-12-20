from django.contrib.auth.models import User
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from appshop.api.serializers import DetailItemSerializer, ShortDetailItemSerializer, ModifyDetailItemSerializer
from appshop.models import Item
from appshop.views import get_landing_page


class ItemPaginator(PageNumberPagination):
    page_size = 10
    max_page_size = 10
    page_size_query_param = "page_size"


class ItemListUserAPI(GenericAPIView):

    def get(self, request, token):
        user = Token.objects.get(key=token).user
        items = Item.objects.filter(seller=user.username) | Item.objects.filter(buyer=user.username)
        items = items.distinct().order_by("-created_date")

        serializer = DetailItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, token):
        user = Token.objects.get(key=token).user

        serializer = ShortDetailItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        item = Item(title=data["title"], description=data["description"], price=data["price"],
                    seller=user.username, buyer='', status='WAITING')
        item.save()
        return Response({"message": "item created"})


class ItemListSaleUserAPI(GenericAPIView):
    pagination_class = ItemPaginator
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get(self, request, token):
        user = Token.objects.get(key=token).user
        items = Item.objects.filter(Q(status='SALE'), ~Q(seller=user.username))
        items = items.order_by("-created_date")

        page = self.paginate_queryset(items)

        if page:
            serializer = DetailItemSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            return self.get_paginated_response([])


class ItemListSaleUserSearchAPI(GenericAPIView):
    pagination_class = ItemPaginator
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get(self, request, token, search):
        user = Token.objects.get(key=token).user
        items = Item.objects.filter(Q(status='SALE'), ~Q(seller=user.username))
        items = items.filter(title__contains=search)
        items = items.order_by("-created_date")

        page = self.paginate_queryset(items)

        if page:
            serializer = DetailItemSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            return self.get_paginated_response([])


class ItemListAPI(GenericAPIView):
    pagination_class = ItemPaginator
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        items = Item.objects.filter(status='SALE')
        items = items.order_by("-created_date")

        page = self.paginate_queryset(items)

        if page:
            serializer = DetailItemSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            return self.get_paginated_response([])


class ItemListSearchAPI(GenericAPIView):
    pagination_class = ItemPaginator
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get(self, request, search):
        items = Item.objects.filter(status='SALE')
        items = items.filter(title__contains=search)
        items = items.order_by("-created_date")

        page = self.paginate_queryset(items)

        if page:
            serializer = DetailItemSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            return self.get_paginated_response([])


class ItemDetailsAPI(GenericAPIView):
    pagination_class = ItemPaginator
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get(self, request, item_id):
        item = get_object_or_404(Item, pk=item_id)
        serializer = DetailItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, item_id):
        item = get_object_or_404(Item, pk=item_id)

        serializer = ModifyDetailItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        item.price = data["price"]
        item.title = data["title"]
        item.description = data["description"]
        item.status = data["status"]
        item.save()

        return Response({"message": "item updated"})

    def delete(self, request, item_id):
        item = get_object_or_404(Item, pk=item_id)
        item.delete()
        return Response({"message": "item deleted"})


class PopulateAPI(GenericAPIView):

    def get(self, request):
        return get_landing_page(request)

    def post(self, request):
        Item.objects.all().delete()
        User.objects.all().delete()

        user1 = User.objects.create_user(username="testuser1", password="pass1", email="testuser1@shop.aa")
        user2 = User.objects.create_user(username="testuser2", password="pass2", email="testuser2@shop.aa")
        user3 = User.objects.create_user(username="testuser3", password="pass3", email="testuser3@shop.aa")
        user4 = User.objects.create_user(username="testuser4", password="pass4", email="testuser4@shop.aa")
        user5 = User.objects.create_user(username="testuser5", password="pass5", email="testuser5@shop.aa")
        user6 = User.objects.create_user(username="testuser6", password="pass6", email="testuser6@shop.aa")

        for u in [user1, user2, user3, user4, user5, user6]:
            Token.objects.create(user=u)

        item0 = Item(title="piano", description="with tiles (black and white)!", price=500, seller="testuser1",
                     status='WAITING')
        item1 = Item(title="drums", description="very good quality", price=60, seller="testuser1", status='SALE')
        item2 = Item(title="table", description="with few scratches", price=20, seller="testuser1", status='SALE')
        item3 = Item(title="chair", description="very comfortable", price=40, seller="testuser1", status='SALE')
        item4 = Item(title="desk", description="few pen traces", price=30, seller="testuser1", status='SALE')
        item5 = Item(title="kitchen stuff", description="used only during 3 months", price=10, seller="testuser1",
                     status='SALE')
        item6 = Item(title="bed", description="almost new", price=400, seller="testuser1", status='SALE')
        item7 = Item(title="curtains", description="with nice drawings", price=20, seller="testuser1", status='SALE')
        item8 = Item(title="car", description="Renault one", price=900, seller="testuser1", status='SALE')
        item9 = Item(title="lamp", description="nice lamp to read", price=10, seller="testuser1", status='SALE')

        item10 = Item(title="piano", description="with tiles (black and white)!", price=499, seller="testuser2",
                      status='WAITING')
        item11 = Item(title="drums", description="very good quality", price=59, seller="testuser2", status='SALE')
        item12 = Item(title="table", description="with few scratches", price=19, seller="testuser2", status='SALE')
        item13 = Item(title="chair", description="very comfortable", price=39, seller="testuser2", status='SALE')
        item14 = Item(title="desk", description="few pen traces", price=29, seller="testuser2", status='SALE')
        item15 = Item(title="kitchen stuff", description="used only during 3 months", price=9, seller="testuser2",
                      status='SALE')
        item16 = Item(title="bed", description="almost new", price=399, seller="testuser2", status='SALE')
        item17 = Item(title="curtains", description="with nice drawings", price=19, seller="testuser2", status='SALE')
        item18 = Item(title="car", description="Renault one", price=899, seller="testuser2", status='SALE')
        item19 = Item(title="lamp", description="nice lamp to read", price=9, seller="testuser2", status='SALE')

        item20 = Item(title="piano", description="with tiles (black and white)!", price=505, seller="testuser3",
                      status='WAITING')
        item21 = Item(title="drums", description="very good quality", price=65, seller="testuser3", status='SALE')
        item22 = Item(title="table", description="with few scratches", price=25, seller="testuser3", status='SALE')
        item23 = Item(title="chair", description="very comfortable", price=45, seller="testuser3", status='SALE')
        item24 = Item(title="desk", description="few pen traces", price=35, seller="testuser3", status='SALE')
        item25 = Item(title="kitchen stuff", description="used only during 3 months", price=15, seller="testuser3",
                      status='SALE')
        item26 = Item(title="bed", description="almost new", price=405, seller="testuser3", status='SALE')
        item27 = Item(title="curtains", description="with nice drawings", price=15, seller="testuser3", status='SALE')
        item28 = Item(title="car", description="Renault one", price=905, seller="testuser3", status='SALE')
        item29 = Item(title="lamp", description="nice lamp to read", price=15, seller="testuser3", buyer="testuser1",
                      status='SOLD')

        for item in [item0, item1, item2, item3, item4, item5, item6, item7, item8, item9,
                     item10, item11, item12, item13, item14, item15, item16, item17, item18, item19,
                     item20, item21, item22, item23, item24, item25, item26, item27, item28, item29]:
            item.save()

        return HttpResponseRedirect(reverse("home"))  # should redirect to a different URL !!!
