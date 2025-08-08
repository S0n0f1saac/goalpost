from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse              # returns JSON without extra DRF machinery
from django.views import View                     # base class for simple class-based views

class HealthView(View):                           # defines a basic GET-only health check
    def get(self, request):                       # handles HTTP GET requests
        return JsonResponse(                      # respond with JSON payload
            {"status": "ok", "service": "goalpost-backend"},  # simple status body
            status=200                            # HTTP 200 means success
        )
