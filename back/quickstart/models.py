from django.db import models

# Create your models here.

class Project(models.Model):
    title = models.TextField()
    description = models.TextField()
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Card(models.Model):
    
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='cards'
    )
    
    text = models.TextField()
    x = models.IntegerField()
    y = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    index = models.IntegerField()

    def __str__(self):
        return self.text
    
class Wire(models.Model):
    
    class Side(models.TextChoices):
        NORTH = 'n', 'North'
        SOUTH = 's', 'South'
        EAST = 'e', 'East'
        WEST = 'w', 'West'
    
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='wires'
    )
    
