from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as auth_view
from .views import TaskCreateAPIView

app_name = 'tasks'
urlpatterns = [

    path('create/', TaskCreateAPIView.as_view(), name='task_create'),

]