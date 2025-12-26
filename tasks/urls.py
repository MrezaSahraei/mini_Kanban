from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as auth_view
from .views import (TaskCreateAPIView, UserListAPIView, TaskDetailAPIView,
                    TasksListAPIView, AllTasksListAPIView, AssignedTasks, SignUpView)
from rest_framework.authtoken import views

app_name = 'tasks'
urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),

    path('create/', TaskCreateAPIView.as_view(), name='task_create'),
    path('users-list/', UserListAPIView.as_view(), name='users_list'),
    path('detail/<int:pk>', TaskDetailAPIView.as_view(), name='tasks_detail'),
    path('created-by-me/', TasksListAPIView.as_view(), name='tasks_list'),
    path('list/', AllTasksListAPIView.as_view(), name='all_tasks'),
    path('assigned-to-me/', AssignedTasks.as_view(), name='assigned_tasks'),
    path('login/', views.obtain_auth_token)

]