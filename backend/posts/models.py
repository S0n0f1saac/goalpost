from django.db import models

# Create your models here.
from django.conf import settings                         # import active User model setting
from django.db import models                             # ORM base classes

class Post(models.Model):                                # Post row in DB
    user = models.ForeignKey(                            # author of the post
        settings.AUTH_USER_MODEL,                        # link to auth.User
        on_delete=models.CASCADE,                        # delete posts if user deletes
        related_name="posts",                            # user.posts reverse accessor
    )
    text = models.TextField(max_length=1000)             # post body (text only)
    media_url = models.URLField(blank=True)              # optional image/video URL
    created_at = models.DateTimeField(auto_now_add=True) # time of creation

    class Meta:                                          # model metadata
        ordering = ("-created_at", "id")                 # newest first, stable tiebreaker

    def __str__(self):                                   # human-readable display
        return f"{self.user.username}: {self.text[:40]}" # prefix with author, snippet
