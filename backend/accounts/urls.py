# backend/accounts/urls.py                         # app-level URLConf for accounts ONLY
from django.urls import path                       # import path for URL patterns
from rest_framework_simplejwt.views import (       # import JWT views for token endpoints
    TokenObtainPairView,                           # view that issues access+refresh tokens
    TokenRefreshView,                              # view that refreshes an access token
)
from .views import register_view, me_view          # import our register and me endpoints

urlpatterns = [                                    # list of URL patterns exposed by this app
    path('register/', register_view, name='register'),          # POST → create a new user
    path('token/', TokenObtainPairView.as_view(), name='token'),# POST → get JWT tokens
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'), # POST → refresh token
    path('me/', me_view, name='me'),                            # GET → current user profile
]
