from django.db import models

# Create your models here.
# backend/profiles/models.py
from django.conf import settings                           # access the active User model
from django.db import models                               # Django ORM base

class Profile(models.Model):                               # user profile linked 1:1 to User
    ROLE_CHOICES = [                                       # allowed role values
        ("player", "Player"),                              # player profile type
        ("coach", "Coach"),                                # coach profile type
        ("fan", "Fan"),                                    # fan profile type
    ]
    user = models.OneToOneField(                           # 1:1 User → Profile
        settings.AUTH_USER_MODEL,                          # reference auth user model
        on_delete=models.CASCADE,                          # delete profile when user is deleted
        related_name="profile",                            # allow user.profile access
    )
    role = models.CharField(                               # profile role
        max_length=10,                                     # small storage
        choices=ROLE_CHOICES,                              # limit to choices
        default="player",                                  # default role
    )
    display_name = models.CharField(max_length=50, blank=True) # public-facing name
    bio = models.TextField(blank=True)                     # short bio/about
    created_at = models.DateTimeField(auto_now_add=True)   # timestamp on create
    updated_at = models.DateTimeField(auto_now=True)       # timestamp on update

    def __str__(self):                                     # human-readable repr
        return f"{self.user.username} ({self.role})"       # e.g., "testuser (player)"

class Follow(models.Model):                          # a "user A follows user B" relation row
    follower = models.ForeignKey(                    # who is doing the following
        settings.AUTH_USER_MODEL,                    # FK → auth user
        on_delete=models.CASCADE,                    # delete relations if follower is deleted
        related_name="following",                    # reverse: user.following -> qs of Follow
    )
    following = models.ForeignKey(                   # who is being followed
        settings.AUTH_USER_MODEL,                    # FK → auth user
        on_delete=models.CASCADE,                    # delete relations if followee is deleted
        related_name="followers",                    # reverse: user.followers -> qs of Follow
    )
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp the follow event

    class Meta:                                      # model-level constraints/meta
        unique_together = ("follower", "following")  # a pair can exist only once
        indexes = [                                  # helpful index for lookups
            models.Index(fields=["follower", "following"]),  # composite index
        ]

    def __str__(self):                               # human-readable
        return f"{self.follower_id} -> {self.following_id}"  # e.g., "1 -> 2"
