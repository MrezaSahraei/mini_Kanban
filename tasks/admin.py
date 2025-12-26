from .models import Task
from django.contrib import admin

# Register your models here.

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'status', 'progress', 'creator']
    search_fields = ['status']

