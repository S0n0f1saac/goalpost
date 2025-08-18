# backend/accounts/serializers.py
from django.contrib.auth.models import User            # built-in User model
from rest_framework import serializers                 # DRF serializer base

class RegisterSerializer(serializers.ModelSerializer): # serializer for signup
    password = serializers.CharField(write_only=True)  # password only inbound
    class Meta:                                        # inner config for serializer
        model = User                                   # operate on User model
        fields = ('username', 'email', 'password')     # required signup fields

    def create(self, validated_data):                  # how to create new user
        # pop password so we can hash it properly
        password = validated_data.pop('password')      # extract raw password
        user = User(**validated_data)                  # build user object
        user.set_password(password)                    # hash the password
        user.save()                                    # persist to database
        return user                                    # return created user
