#
# Handles all Note specific stuff
#

from django.utils import timezone
from xnotesapp.models import Note
from xncore import utils
import traceback

class NoteManager():
    def __init__(self, username=""):
        self.username = username
        ## Fetch all notes
        
    def fetchNotes(self):
        """Retrieves notes from db. """
        # notes = DbWrapper.getQueryResults(params)]
        self.notes = []
        return True
    
    @staticmethod
    def getNotes(username, title="", note_id="", order="last_edited"):
        """Retrieves note by title or note id. If multiple notes of the same title are found, fetch all sorted by edited date."""
        ## Fetch note from self.notes
        qset = []
        results = []
        if(note_id):
            qset = Note.objects.filter(note_id=note_id).order_by(order)
        elif(title):
            qset = Note.objects.filter(title=title).order_by(order)
        else: # Fetch all
            qset = Note.objects.filter(owner=username).order_by(order)         
        for n in qset:
            results.append(n)
        return results
    
    def createNote(self, noteData):
        """Creates a note, doesn't save it to the database yet. Use update() for that."""
        status = True
        try:
            #nid = noteData.__getitem__('owner') + str(random.randint(0,10000))
            created_time = timezone.now()
            edited_time = created_time
            nid = utils.create_pKey(created_time)
            print('createNote() ',noteData)
            # TODO: Update all fields dynamically 
            newNote = Note(
                owner=noteData.__getitem__('owner'), 
                note_id=nid, 
                title=noteData.__getitem__('title'), content=noteData.__getitem__('content'), color=noteData.__getitem__('color'), created=created_time, 
                labels=noteData.getlist('labels[]'),
                last_edited=edited_time
            )
            newNote.save()
        except Exception as e:
            print("FAILED TO CREATE NOTE: ", noteData)
            traceback.print_exc();
            status = False
        return status
    
    @staticmethod
    def editNote(note_id, noteData):
        """Edits contents of a note. Pass all the parameters that need to be changed in a dictionary"""
        status = False
        if(note_id and noteData is not None):
            pk = Note.objects.filter(note_id=note_id)[0].pk
            note = Note.objects.get(pk=pk)
            ## TODO: This is too clunky, adding each entry every time I add a field
            note.title = noteData.__getitem__('title')
            note.content = noteData.__getitem__('content')
            note.color = noteData.__getitem__('color')
            note.trash = noteData.__getitem__('trash')
            note.last_edited = timezone.now()
            ## Update labels
            note.labels = list(noteData.getlist('labels[]'))
            note.save()
            status = True
        ## Find all notes with edited flag set and update them
        return status
    
    @staticmethod
    def deleteNote(note_id, hard_delete=False):
        status = True
        print("Deleting note: ", note_id, " hard_delete = ",hard_delete);
        item = Note.objects.filter(note_id=str(note_id)).get()
        if(hard_delete):
            item.delete()
        else:
            item.trash = True
            item.save()
        return status
    
    @staticmethod
    def setLabels(note_id, labels):
        status = True
        if(not note_id or type(labels) != list):
            return False
        print("Setting labels: ", note_id,labels)
        item = Note.objects.filter(note_id=str(note_id)).get()
        for label in labels:
            if label not in item.labels:
                item.labels.append(label)
        item.labels.sort()
        item.save()
        return status
        
    def searchNote(self, searchQuery):
        """Searches for note with either content or title matching the query."""
        ### Do this in the database -> faster
        return None