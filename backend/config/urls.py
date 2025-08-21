# backend/config/urls.py                        # project-level URLConf
from django.contrib import admin                # admin site
from django.http import HttpResponse           # simple health-check response
from django.urls import path, include          # include child app routes

urlpatterns = [                                # list of top-level routes
    path('admin/', admin.site.urls),           # /admin/ → Django admin
    path('api/auth/', include('accounts.urls')),# /api/auth/* → accounts app
    path("api/", include("profiles.urls")),      # mounts /api/profile/me/
    path('api/health/',                        # /api/health/ → quick check
         lambda r: HttpResponse('ok'),         # tiny view returning "ok"
         name='api-health'),                   # name for reverse lookups
]