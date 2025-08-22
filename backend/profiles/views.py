from django.shortcuts import render

# Create your views here.
# backend/profiles/views.py                           # views for profile endpoints
from django.contrib.auth import get_user_model          # to look up users
from rest_framework.decorators import api_view, permission_classes  # function-based view tools
from rest_framework.permissions import IsAuthenticated  # require login/JWT
from rest_framework.response import Response           # HTTP JSON response
from rest_framework import status                      # HTTP status codes
from .models import Profile, Follow   
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

User = get_user_model()                                                 # active user model

@api_view(["GET"])                                                      # list who I follow
@permission_classes([IsAuthenticated])                                  # JWT required
def following_list_view(request):                                       # /api/following/
    ids = list(                                                         # gather ids I follow
        Follow.objects.filter(follower=request.user)                    # rows where I am follower
        .values_list("following_id", flat=True)                         # extract followee ids
    )
    return Response({"following_ids": ids}, status=status.HTTP_200_OK)  # return ids

@api_view(["POST", "DELETE"])                                           # follow or unfollow target
@permission_classes([IsAuthenticated])                                  # JWT required
def follow_toggle_view(request, user_id):                               # /api/follow/<user_id>/
    if user_id == request.user.id:                                      # cannot follow self
        return Response({"detail": "cannot follow yourself"},           # explain
                        status=status.HTTP_400_BAD_REQUEST)             # 400 bad request
    try:
        target = User.objects.get(pk=user_id)                           # fetch target user
    except User.DoesNotExist:                                           # if not found
        return Response({"detail": "user not found"},                   # 404 not found
                        status=status.HTTP_404_NOT_FOUND)

    if request.method == "POST":                                        # follow action
        obj, created = Follow.objects.get_or_create(                    # ensure unique
            follower=request.user, following=target                     # pair (me -> target)
        )
        if created:                                                     # if new row inserted
            return Response({"detail": "followed"}, status=status.HTTP_201_CREATED)  # 201
        return Response({"detail": "already following"}, status=status.HTTP_200_OK)  # 200 idempotent

    # DELETE → unfollow
    deleted, _ = Follow.objects.filter(                                 # try to delete the row
        follower=request.user, following=target                         # pair (me -> target)
    ).delete()
    if deleted:                                                         # if a row was removed
        return Response({"detail": "unfollowed"}, status=status.HTTP_200_OK)  # success
    return Response({"detail": "not following"}, status=status.HTTP_200_OK)   # idempotent