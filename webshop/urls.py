from django.contrib import admin
from django.urls import path, include
from appshop.views import *
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', get_landing_page, name='home'),

    path('api/', include("appshop.api.urls")),
    path('api/auth/', include("account.api.urls")),


    path('go_shop', go_shop, name='go_shop'),
    path('shop', TemplateView.as_view(template_name='index.html'), name='shop'),
    path('login', TemplateView.as_view(template_name='index.html')),
    path('signup', TemplateView.as_view(template_name='index.html')),
    path('myitems', TemplateView.as_view(template_name='index.html')),
    path('account', TemplateView.as_view(template_name='index.html')),
]

