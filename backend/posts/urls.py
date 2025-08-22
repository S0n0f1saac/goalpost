from django.urls import path                         # URL helper
from .views import posts_view, posts_my_view         # controller

urlpatterns = [
    path("posts/", posts_view, name="posts"),        # /api/posts/
    path("posts/my/", posts_my_view, name="posts-my")# my feed (followed + me)
]
