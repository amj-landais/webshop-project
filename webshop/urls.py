"""webshop URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from appshop.views import *
from django.views.generic import TemplateView, RedirectView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', get_landing_page, name='home'),
    # path('add_user', add_user),
    # path('add_item', AddItem.as_view(), name='add-item'),


    path('api/', include("appshop.api.urls")),
    path('api/auth/', include("account.api.urls")),


    path('go_shop', go_shop, name='go_shop'),
    path('shop', TemplateView.as_view(template_name='index.html'), name='shop'),
    path('login', TemplateView.as_view(template_name='index.html')),
    path('signup', TemplateView.as_view(template_name='index.html')),
    path('myitems', TemplateView.as_view(template_name='index.html')),
    path('account', TemplateView.as_view(template_name='index.html')),
    # path('', TemplateView.as_view(template_name='home.html'))
]

