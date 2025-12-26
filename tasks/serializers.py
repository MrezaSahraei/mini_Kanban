from rest_framework import serializers
from .models import Task, User

class UserSerializer(serializers.ModelSerializer):
    last_name = serializers.CharField(required=False)
    first_name = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, max_length=11)
    class Meta:
        model = User
        fields = ['id', 'username', 'password','last_name', 'first_name']
        read_only_fields = ['id']

class TaskSerializer(serializers.ModelSerializer):
    #status_choices_display = serializers.CharField(source='get_STATUS_CHOICES_display()', read_only=True)
    creator_name = serializers.CharField(source='creator.username' ,read_only=True)
    assigned_to = serializers.SlugRelatedField(many=True,queryset=User.objects.all(),slug_field='username'
    )

    class Meta:
        model = Task
        fields = ['id' , 'creator','creator_name', 'title', 'description',
                  'progress', 'assigned_to', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'creator', 'creator_name' ,'created_at', 'updated_at']

    def validate_progress(self, value):
        if value <0 or value >100:
            raise serializers.ValidationError('درصد پیشرفت باید مقداری بین 0 تا 100 باشد')
        return value