from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model

ALLOWED_HOSTS = settings.ALLOWED_HOSTS
User = get_user_model()


@api_view(['GET', 'POST'])
def user_follow_view(request, username, *args, **kwargs):
    """api view for managing following/unfollowing others"""
    # check if request user exists / isAuthenticated
    user = get_user_via_sessionid(request)
    if not user:
        return Response({"Detail": "No authentification found"})
    
    # retrieves the other user's profile if it exists
    other_user_qs = User.objects.filter(username=username)
    if not other_user_qs.exists():
        return Response({"Detail": "User could not be found."}, status=404)
    other = other_user_qs.first()
    profile = other.profile
    
    if user == other:
        current_followers_count = profile.followers.count()
        return Response({"count": current_followers_count }, status=200)
    
    # action is passed in through request, logic is performed
    data = request.data or {}
    action = data.get('action')
    if action == 'follow':
        profile.followers.add(user)
    elif action == 'unfollow':
        profile.followers.remove(user)
        
    current_followers_count = profile.followers.count()
    return Response({"count": current_followers_count }, status=200)



def get_user_via_sessionid(request):
    user_id = request.session.get('_auth_user_id')
    qs = User.objects.filter(id=user_id)
    if not qs.exists():
        return None
    return qs.first()