from django.contrib import admin
from .models import Note
from .models import User
from .models import Session

# Register your models here.

admin.site.register(Note)
admin.site.register(User)
admin.site.register(Session)