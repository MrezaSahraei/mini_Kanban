from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

class Task(models.Model):
    STATUS_CHOICES = [
        ('TO_DO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]

    title = models.CharField(max_length=100)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    description = models.TextField()
    progress_percent = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    assigned_to = models.ManyToManyField(User, related_name='assigned_tasks')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='TO_DO')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.title} by {self.creator}'

