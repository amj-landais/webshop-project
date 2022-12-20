from django.urls import path

from appshop.api.views import ItemListAPI, ItemDetailsAPI, ItemListUserAPI, PopulateAPI, ItemListSaleUserAPI, ItemListSearchAPI, ItemListSaleUserSearchAPI

urlpatterns = [
    path('v1/items', ItemListAPI.as_view()),
    path('v1/items/<str:search>', ItemListSearchAPI.as_view()),
    path('v1/items/user/<str:token>', ItemListUserAPI.as_view()),
    path('v1/items/sale/<str:token>', ItemListSaleUserAPI.as_view()),
    path('v1/items/sale/<str:token>/<str:search>', ItemListSaleUserSearchAPI.as_view()),
    path('v1/item/<int:item_id>', ItemDetailsAPI.as_view()),
    path('v1/populate', PopulateAPI.as_view(), name='populate'),
]

