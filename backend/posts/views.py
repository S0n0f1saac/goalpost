from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes  # function view tools
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated   # auth: write only for logged in
from rest_framework.response import Response                      # JSON response
from profiles.models import Follow                              #To get follow ids 
from rest_framework import status                                   # HTTP status codes
from .models import Post                                            # Post model
from .serializers import PostSerializer                             # serializer

@api_view(["GET", "POST"])                                          # support listing + creating
@permission_classes([IsAuthenticatedOrReadOnly])                    # GET anyone, POST auth only
def posts_view(request):                                            # /api/posts/
    if request.method == "GET":                                     # list recent posts
        qs = Post.objects.all()                                     # global feed queryset
        try:                                                        # parse limit param if present
            limit = int(request.GET.get("limit", "20"))             # default page size 20
        except ValueError:                                          # invalid limit fallback
            limit = 20                                              # use default on error
        data = PostSerializer(qs[: max(1, min(limit, 100))], many=True).data  # serialize slice
        return Response(data, status=status.HTTP_200_OK)            # return JSON list

    serializer = PostSerializer(data=request.data, context={"request": request})  # bind body
    if serializer.is_valid():                                       # validate fields
        post = serializer.save()                                    # insert with current user
        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED) # 201 with row
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)         # validation errs

@api_view(["GET"])                                                          # only listing
@permission_classes([IsAuthenticated])                                      # must be logged in
def posts_my_view(request):                                                 # /api/posts/my/
    follow_ids = list(                                                      # ids I follow
        Follow.objects.filter(follower=request.user)                        # rows where I follow
        .values_list("following_id", flat=True)                             # take followee ids
    )
    follow_ids.append(request.user.id)                                      # include myself
    try:
        limit = int(request.GET.get("limit", "20"))                         # page size param
    except ValueError:
        limit = 20                                                          # fallback
    qs = Post.objects.filter(user_id__in=follow_ids)                        # filter feed
    data = PostSerializer(qs[: max(1, min(limit, 100))], many=True).data    # serialize slice
    return Response(data, status=status.HTTP_200_OK)                        # send JSON
