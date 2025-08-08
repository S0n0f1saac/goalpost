from django.urls import path                      # URL pattern helper
from .views import HealthView                     # import our health check view

urlpatterns = [                                   # list of API routes in this app
    path("health/", HealthView.as_view(), name="api-health"),  # GET /api/health/ -> 200 OK JSON
]
