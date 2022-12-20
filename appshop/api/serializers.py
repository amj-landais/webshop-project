from rest_framework import serializers
from appshop.models import Item


class DetailItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ("pk", "title", "description", "price", "seller", "buyer", "status", "created_date", "date_modified")


class ShortDetailItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ("pk", "title", "description", "price")


class ModifyDetailItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ("pk", "title", "description", "price", "status")

