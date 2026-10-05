from django.db import models

# Create your models here.

class Project(models.Model):
    title = models.TextField()
    description = models.TextField(null=True)
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Card(models.Model):
    
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='cards'
    )
    
    text = models.TextField(null=True)
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
    
    fromId = models.IntegerField(null=True)
    toId = models.IntegerField(null=True)
    
    fromSide = models.CharField(max_length=1, choices=Side.choices, default=Side.NORTH)
    toSide = models.CharField(max_length=1, choices=Side.choices, default=Side.NORTH)