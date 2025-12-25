from django.shortcuts import render
from .serializers import TaskSerializer, UserSerializer
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import Task, User
from rest_framework.response import Response
# Create your views here.

class UserListAPIView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
class TaskCreateAPIView(generics.CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()

    def create(self, request, *args, **kwargs):
        user = self.request.user

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        assigned_users = validated_data.pop('assigned_to', [])

        task = Task.objects.create(
            creator=user,
            progress_percent=0,
            status='TO_DO',
            **validated_data
        )

        if assigned_users:
            task.assigned_to.set(assigned_users)

        return Response(
            {'message':'تسک با موفیقت ثبت شد و هم اکنون در ستون To Do است.'},
            status=status.HTTP_201_CREATED
        )




