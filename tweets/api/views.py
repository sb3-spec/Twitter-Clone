from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination

from django.contrib.auth import get_user_model

from ..serializers import TweetSerializer, TweetActionSerializer, TweetCreateSerializer
from ..models import Tweet
ALLOWED_HOSTS = settings.ALLOWED_HOSTS
User = get_user_model()

@api_view(['POST']) # http method that client has to send == POST
def tweet_create_view(request, *args, **kwargs):
    user = get_user_via_sessionid(request) or get_user_by_username(request.data.get('username'))

    
    if not user:
        return Response({"Details": "No authentication"}, status=401)
    serializer = TweetCreateSerializer(data=request.data)
   
    if serializer.is_valid(raise_exception=True):
        serializer.create(serializer.data, user)
        return Response(serializer.data, 201)
    return Response({}, status=400)

@api_view(['DELETE', 'POST'])

def tweet_delete_view(request, tweet_id, *args, **kwargs):
    user = get_user_via_sessionid(request)
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    qs = qs.filter(user=user)
    if not qs.exists():
        return Response({"message": "You cannot delete this tweet"}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({"message": "Tweet removed"}, status=200)



@api_view(['DELETE', 'POST', 'GET'])
def tweet_action_view(request, *args, **kwargs):
    '''
    id is required
    Action options are like, unlike, and retweet
    '''
    user = get_user_via_sessionid(request) or get_user_by_username(request.data.get('username'))
    
    
    if not user or not user.is_authenticated:
        return Response({"Details": "No authentication"}, status=401)
    

    serializer = TweetActionSerializer(data=request.data)
    
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        tweet_id = data.get("id")
        action = data.get("action")
        # content = data.get("content")
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    if action == "like":
        obj.likes.add(user)
        serializer = TweetSerializer(obj)
        return Response(serializer.data, status=200)
    elif action == "unlike":
        obj.likes.remove(user)
        serializer = TweetSerializer(obj)
        return Response(serializer.data, status=200)
    elif action == 'retweet':
        new_tweet = Tweet.objects.create(user=user, parent=obj, content='')
        serializer = TweetSerializer(new_tweet)
        
        return Response(serializer.data, status=201)

def get_paginated_queryset_response(qs, request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(qs, request)
    serializer = TweetSerializer(paginated_qs, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def tweet_feed_view(request, *args, **kwargs):
    qs = Tweet.objects.feed(get_user_via_sessionid(request))
    return get_paginated_queryset_response(qs, request)

@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):

    user = get_user_via_sessionid(request) or get_user_by_username(request.GET.get('username'))
    qs = Tweet.objects.all()
    if user != None:
        qs = qs.by_username(user.username)
    return get_paginated_queryset_response(qs, request)


@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data, status=200)


def get_user_via_sessionid(request):
    user_id = request.session.get('_auth_user_id')
    qs = User.objects.filter(id=user_id)
    if not qs.exists():
        return None
    return qs.first()
    

def get_user_by_username(username):
    qs = User.objects.filter(username=username)
    return qs.first()



    
    