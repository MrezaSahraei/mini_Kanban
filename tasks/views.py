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
            progress=0,
            status='TO_DO',
            **validated_data
        )

        if assigned_users:
            task.assigned_to.set(assigned_users)

        return Response(
            {'message':'تسک با موفیقت ثبت شد و هم اکنون در ستون To Do است.'},
            status=status.HTTP_201_CREATED
        )
class TaskDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(creator=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        updated_status = serializer.validated_data.get('status', instance.status)
        updated_progress= serializer.validated_data.get('progress', instance.progress)

        if updated_status == 'IN_PROGRESS' and instance.status != 'IN_PROGRESS':
            if updated_status == 0:
                updated_status = 1

        if updated_status == 'COMPLETED' and instance.status != 'COMPLETED':
            updated_progress = 100

        if updated_progress == 100:
            updated_status = 'COMPLETED'
        elif 0 < updated_progress< 100:
            updated_status = 'IN_PROGRESS'

        serializer.save(
            status=updated_status,
            progress_percent=updated_progress
        )

class TasksListAPIView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(creator=self.request.user)

class AllTasksListAPIView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAdminUser]
    queryset = Task.objects.all()

class AssignedTasks(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(assigned_to=self.request.user)

class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')
        return Response(
            {'message': "ثبت‌نام با موفقیت انجام شد. حالا می‌توانید لاگین کنید.",
                   "username": username,
                    'password': password
             },
            status=status.HTTP_201_CREATED
        )


