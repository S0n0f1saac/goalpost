from django.urls import path                         # URL helper
from .views import posts_view                        # controller

urlpatterns = [
    path("posts/", posts_view, name="posts"),        # /api/posts/
]
