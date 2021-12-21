from django.db import models
from django.conf import settings
from django.db.models import Q
import datetime



# Create your models here.

User = settings.AUTH_USER_MODEL

class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class TweetManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return TweetQuerySet(self.model, using=self._db)  
    
    def feed(self, user):
        return self.get_queryset().feed(user)

class TweetQuerySet(models.QuerySet):
    def by_username(self, username):
        return self.filter(user__username=username)
    
    def feed(self, user):
        profile_exists = user.following.exists()
        followed_users_id = []
        if profile_exists:
            followed_users_id = user.following.values_list("user__id", flat=True) # [x.user.id for x in profiles].append(user.id)
        
        return self.filter(
            Q(user__id__in=followed_users_id) |
            Q(user=user)  
        ).distinct().order_by("-timestamp")
        
class Tweet(models.Model):
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tweets") # many users can have many tweets
    likes = models.ManyToManyField(User, related_name='tweet_user', blank=True, through=TweetLike)
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    objects = TweetManager()
    
    class Meta:
        ordering = ['-id']
    
    @property
    def is_retweet(self):
        return self.parent != None
    