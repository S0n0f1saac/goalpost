from django.shortcuts import render

# Create your views here.
# backend/profiles/views.py                           # views for profile endpoints
from rest_framework.decorators import api_view, permission_classes  # function-based view tools
from rest_framework.permissions import IsAuthenticated  # require login/JWT
from rest_framework.response import Response           # HTTP JSON response
from rest_framework import status                      # HTTP status codes
from .models import Profile                            # Profile model
from .serializers import ProfileSerializer             # serializer defined above

@api_view(["GET", "PUT"])                              # accept GET (read) and PUT (update)
@permission_classes([IsAuthenticated])                 # only authenticated users allowed
def profile_me_view(request):                          # endpoint: /api/profile/me/
    profile, _ = Profile.objects.get_or_create(        # fetch or create a profile for this user
        user=request.user                              # link to the current user
    )
    if request.method == "GET":                        # on GET requests
        data = ProfileSerializer(profile).data         # serialize profile -> dict
        data.update({                                  # include basic user info too
            "id": request.user.id,                     # current user id
            "username": request.user.username,         # username
            "email": request.user.email,               # email
        })
        return Response(data, status=status.HTTP_200_OK)  # return payload

    # PUT (partial update allowed)
    serializer = ProfileSerializer(                    # bind incoming JSON to serializer
        instance=profile,                              # target instance to update
        data=request.data,                             # incoming fields
        partial=True                                   # allow partial updates
    )
    if serializer.is_valid():                          # validate fields against model/choices
        serializer.save()                              # write changes to DB
        data = serializer.data                         # get updated profile data
        data.update({                                  # include user info again
            "id": request.user.id,                     # user id
            "username": request.user.username,         # username
            "email": request.user.email,               # email
        })
        return Response(data, status=status.HTTP_200_OK)  # success
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # validation errors