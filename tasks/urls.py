from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as auth_view
from .views import TaskCreateAPIView, UserListAPIView, TaskDetailAPIView, TasksListAPIView, AllTasksListAPIView

app_name = 'tasks'
urlpatterns = [

    path('create/', TaskCreateAPIView.as_view(), name='task_create'),
    path('users-list/', UserListAPIView.as_view(), name='users_list'),
    path('detail/<int:pk>', TaskDetailAPIView.as_view(), name='tasks_detail'),
    path('list/', TasksListAPIView.as_view(), name='tasks_list'),
    path('all/', AllTasksListAPIView.as_view(), name='all_tasks'),

]