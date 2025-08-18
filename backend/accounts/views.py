from django.shortcuts import render
from rest_framework import status                      # HTTP status codes
from rest_framework.decorators import api_view, permission_classes  # function views
from rest_framework.permissions import IsAuthenticated # auth gate for /me
from rest_framework.response import Response           # HTTP responses
from django.contrib.auth.models import User            # built-in User
from .serializers import RegisterSerializer            # our signup serializer

# Create your views here.

@api_view(['POST'])                                    # accept POST only
def register_view(request):                            # /api/auth/register/
    serializer = RegisterSerializer(data=request.data) # validate incoming fields
    if serializer.is_valid():                          # if payload is valid
        serializer.save()                              # create the user
        return Response({'detail': 'registered'}, status=status.HTTP_201_CREATED) # 201 created
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        # 400 invalid

@api_view(['GET'])                                     # accept GET only
@permission_classes([IsAuthenticated])                 # require a valid JWT
def me_view(request):                                  # /api/auth/me/
    user: User = request.user                          # current authenticated user
    # minimal safe profile payload; expand later as needed
    return Response({                                   # send back current user
        'id': user.id,                                  # numeric id
        'username': user.username,                      # login name
        'email': user.email,                            # email on file
    }, status=status.HTTP_200_OK)                       # 200 OK
