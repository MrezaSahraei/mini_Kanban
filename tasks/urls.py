from django.contrib import admin
from django.urls import path, include
from .views import TaskCreateAPIView, UserListAPIView, TaskRetrieveUpdateDestroyAPIViewAPIView

app_name = 'api'
urlpatterns = [
    path('users-list/', UserListAPIView.as_view(), name='users_list' ),
    path('create/', TaskCreateAPIView.as_view(), name='task_create'),
    path('detail/<int:pk>', TaskRetrieveUpdateDestroyAPIViewAPIView.as_view(), name='tasks_detail' )
]