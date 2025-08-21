# backend/profiles/serializers.py                     # DRF serializer for Profile
from rest_framework import serializers                # import DRF serializer base
from .models import Profile                           # import our Profile model

class ProfileSerializer(serializers.ModelSerializer): # serializer maps model <-> JSON
    class Meta:                                       # serializer configuration
        model = Profile                               # bind to Profile model
        fields = ("role", "display_name", "bio")      # fields client can read/write
        read_only_fields = ()                         # none are read-only here (PUT allowed)
