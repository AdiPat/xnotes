from django.db import models
from django.utils import timezone
import uuid

# Create your models here.
class Note(models.Model):
    owner = models.CharField(max_length=50, blank=False)
    note_id = models.CharField(max_length=30, blank=False, unique=True)
    title = models.CharField(max_length=80, null=False) # Blank title is allowed
    content = models.TextField(blank=False) 
    color = models.CharField(max_length=8, blank=False) # Note color RRGGBB
    created = models.DateTimeField(null=False)
    last_edited = models.DateTimeField(null=False)