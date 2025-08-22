# backend/profiles/urls.py                             # routes for the profiles app
from django.urls import path                           # URL routing helper
from .views import profile_me_view, following_list_view, follow_toggle_view  # import views   

urlpatterns = [
    path("profile/me/", profile_me_view, name="profile-me"),  # /api/profile/me/
    path("following/", following_list_view, name="following-list"),          # GET my followees
    path("follow/<int:user_id>/", follow_toggle_view, name="follow-toggle"), # POST/DELETE follow
]
