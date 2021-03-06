"""student URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
import xadmin
from django.views.static import serve
from quantization import views

urlpatterns = [
    url(r'^$', view=views.one, name="root_index"),
    url(r'^auth/$', view=views.auth, name="auth"),
    url(r'^xadmin/', xadmin.site.urls),
    url(r'^quantization/', include('quantization.urls', namespace='quantization')),
    url(r'^democratic/', include('democratic.urls', namespace='democratic')),
    # url(r'^mobile/', include('democratic.urls', namespace='democratic')),
    url(r'^media/(?P<path>.*)$', serve, {"document_root": settings.MEDIA_ROOT}),
    # url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
    #     {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
]
# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
