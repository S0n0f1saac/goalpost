# backend/profiles/urls.py                             # routes for the profiles app
from django.urls import path                           # URL routing helper
from .views import profile_me_view                     # import our view

urlpatterns = [
    path("profile/me/", profile_me_view, name="profile-me"),  # /api/profile/me/
]
