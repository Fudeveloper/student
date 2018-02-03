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
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^main/$', views.main, name='main'),
    url(r'^index/$', views.index, name='index'),
    url(r'^signature/$', views.signature, name='signature'),
    url(r'^save_signature/(\d*)$', views.save_signature, name='save_signature'),

    url(r'^authorize/$', views.authorize, name='authorize'),
    url(r'^select_student/(\d*)$', views.select_student, name='select_student'),
    url(r'^index_handler/$', views.index_handler, name='index_handler'),
    url(r'^main_handler/$', views.main_handler, name='main_handler'),



]
