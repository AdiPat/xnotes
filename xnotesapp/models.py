from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from xncore import xauth
import uuid

# Create your models here.
class Note(models.Model):
    owner = models.CharField(max_length=50, blank=False)
    note_id = models.CharField(max_length=30, blank=False, unique=True)
    title = models.CharField(max_length=80, null=False) # Blank title is allowed
    content = models.TextField(blank=False) 
    color = models.CharField(max_length=8, blank=False) # Note color RRGGBB
    labels = ArrayField(models.CharField(max_length=20), default=list(['all']))
    pinned = models.BooleanField(default=False)
    trash = models.BooleanField(default=False)
    created = models.DateTimeField(null=False)
    last_edited = models.DateTimeField(null=False)
    
class User(models.Model):
    username = models.CharField(max_length=50, blank=False)
    password = models.CharField(max_length=200, blank=False)
    salt = models.CharField(max_length=15, blank=False, default=xauth.gen_salt)