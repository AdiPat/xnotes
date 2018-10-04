from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from django.shortcuts import redirect
from django.http import QueryDict
from .models import Note
from .models import User
from xncore import NoteManager
from xncore import xauth
import math

import sys
import traceback
# Create your views here.

def index(request):
    return HttpResponse("Welcome to xNotes")

def chunks(l, n):
    c = []
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
         c.append(l[i:i + n])
    return c

#
# [1,2,3,4,5,6,7,8]
#  1 
#

def chunks(l, step):
    chunks = [[] for i in range(step)]
    i = j = 0
    for item in l:
        chunks[j].append(item)
        j = (j + 1) % step
        i += 1
    return chunks    

def home(request, username):
    template = loader.get_template('xnotesapp/index.html')
    nm = NoteManager.NoteManager()
    notes = nm.getNotes(username)
    #print(dataChunks)
    context = {'username': username, 'data':notes}
    return HttpResponse(template.render(context, request))

def edit(request, username, note_id):
    if request.method == 'POST':
        print("Editing stuff...", request.POST);
        note = request.POST
        nm = NoteManager.NoteManager()
        nm.editNote(note_id, note)
        return redirect('home', username=username)
    else:
        print("Request Method: ", request.method)
        return redirect('home', username=username)
    return HttpResponse("Ok")

def create(request, username):
    print("xnotesapp: Create view.",username)
    if request.method == 'POST':
        note = request.POST
        nm = NoteManager.NoteManager()
        nm.createNote(note)
        return redirect('home', username=username)
    return HttpResponse("Create Note: ", username)

def delete(request, username):
    print("xnotesapp: Delete view.",username)
    if request.method == 'DELETE':
        data = QueryDict(request.body)
        note_id = data.__getitem__('note_id')
        hard_delete = data.__getitem__('hard');
        nm = NoteManager.NoteManager()
        print(note_id, hard_delete)
        nm.deleteNote(note_id,hard_delete=hard_delete)
        return redirect('home', username=username)
    return HttpResponse('Delete Note: ', username)

def label(request, username):
    print("xnotesapp: Modify labels")
    if request.method == 'POST':
        labelData = request.POST
        note_id = labelData.__getitem__('note_id')
        labels = labelData.getlist('labels[]')
        print(labelData, note_id, labels)
        nm = NoteManager.NoteManager()
        nm.setLabels(note_id, labels)
        return redirect('home', username=username)
    return HttpResponse("Adding labels: ", username)

def all(request, username):
    print("xnotesapp: Sending all notes")
    nm = NoteManager.NoteManager()
    ## Fix get notes to convert QuerySet into list
    notes = list(Note.objects.filter(owner=username).order_by('last_edited').values())
    print(type(notes), type(notes[0]), len(notes))
    return JsonResponse(notes, safe=False)

### Login and Sign up

def login(request):
    print('xnotesapp: Login')
    if request.method == 'POST':
        status = False
        try:
            uname = request.POST.__getitem__('username')
            pwd = request.POST.__getitem__('password')
            uData = User.objects.filter(username=uname)
            if(uData and len(uData.values())== 1):
                status = xauth.verify_credentials(uData.values()[0], pwd)
            print(uname,pwd,uData.values())
            if(status):
                return redirect('home', username=uname)
            else:
                return HttpResponse('Invalid credentials')
        except:
            print("Invalid credentials", request.POST)
            traceback.print_exc()
    template = loader.get_template('xnotesapp/login.html')
    return HttpResponse(template.render({},request))


def signup(request):
    print('xnotesapp: Sign Up')
    template = loader.get_template('xnotesapp/signup.html')
    return HttpResponse(template.render({},request))