from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Project, Card, Wire

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'public'] # Les champs exposés à l'API
        
class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'project', 'text', 'x', 'y', 'width', 'height', 'index']
        
class WireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wire
        fields = ['id', 'project', 'fromId', 'fromSide', 'toId', 'toSide']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        # write_only garantit que le mot de passe ne sera jamais renvoyé en lecture
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # create_user est une fonction native qui s'occupe de hacher le mot de passe
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user