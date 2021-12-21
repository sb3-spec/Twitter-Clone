from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from accounts.views import (
    register_view, logout_view, login_view,
)

from tweets.views import (
    tweets_detail_view, tweets_list_view
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', tweets_list_view),
    path('login/', login_view),
    path('logout/', logout_view),
    path('register/', register_view),
    path('<int:tweet_id>', tweets_detail_view),
    path('profile/', include('profiles.urls')),
    path('api/tweets/', include('tweets.api.urls')), 
    path('api/profile/', include('profiles.api.urls'))
    
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
