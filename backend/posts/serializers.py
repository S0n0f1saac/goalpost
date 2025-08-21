from rest_framework import serializers                   # DRF serializer base
from .models import Post                                 # import Post model

class PostSerializer(serializers.ModelSerializer):       # JSON ↔︎ Post mapper
    author = serializers.SerializerMethodField(read_only=True)   # computed author info

    class Meta:                                          # serializer config
        model = Post                                     # target model
        fields = ("id", "author", "text", "media_url", "created_at")  # exposed fields
        read_only_fields = ("id", "author", "created_at")              # server-managed

    def get_author(self, obj):                            # build author payload
        return {"id": obj.user_id, "username": obj.user.username}     # id + username

    def create(self, validated_data):                     # server-side authoring
        user = self.context["request"].user               # current JWT user
        return Post.objects.create(user=user, **validated_data)       # create row
