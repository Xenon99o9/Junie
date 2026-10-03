from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets

from quickstart.serializers import GroupSerializer, UserSerializer

from .models import Project, Card, Wire
from .serializers import ProjectSerializer, CardSerializer, WireSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all() # Quelles données on manipule ?
    serializer_class = ProjectSerializer # Comment on les traduit ?
    
class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all() 
    serializer_class = CardSerializer 
    
class WireViewSet(viewsets.ModelViewSet):
    queryset = Wire.objects.all() 
    serializer_class = WireSerializer 