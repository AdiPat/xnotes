import * as Constants from './constants';
import * as Base from './base';

export default class Notes {

    constructor() {
        let data = {};
        $('.note-card').each(function () {
            let noteData = {};
            noteData.note_id = $(this).attr(Constants.DOMStrings.noteCard_dataId);
            noteData.title = $(this).find(Constants.DOMStrings.noteCard_title).html();
            noteData.content = $(this).find(Constants.DOMStrings.noteCard_content).html();
            noteData.created = $(this).find(Constants.DOMStrings.noteCard_created).html();
            noteData.color = '#' + $(this).attr(Constants.DOMStrings.noteCard_dataColor);
            data[noteData.note_id] = noteData;
        });
        // Add data for new note
        data[Constants.ID_NEW_NOTE] = {
            note_id: "",
            title: "",
            content: "",
            created: "",
            color: ""
        };
        
        this.data = data;
        console.log(this.data);
    }

    displayNote(note_id) {
        // get note data
        const noteData = this.data[note_id];
        // set properties
        let popupElem = $(Constants.DOMStrings.notePopup);
        $(popupElem).css('background-color', noteData.color);
        $(popupElem).find(Constants.DOMStrings.notePopup_title).html(noteData.title);
        $(popupElem).find(Constants.DOMStrings.notePopup_body).html(noteData.content);
        
        // display
        $(popupElem).css('z-index', '3000');
        $(popupElem).animate({
            opacity: 1
        }, 500, "swing");
        
        $(popupElem).attr('data-id', noteData.note_id);
        
        // render bg overlay
        $(Constants.DOMStrings.notePopup_background).css('z-index', '2000');
        $(Constants.DOMStrings.notePopup_background).css('opacity', '1');
    }
    
    createNote() {
        // set properties
        console.log("create note");
        let popupElem = $(Constants.DOMStrings.notePopup);
        $(popupElem).css('background-color', '#ffffff');
        $(popupElem).find(Constants.DOMStrings.notePopup_title).html('xNotes: The Coolest Note App!');
        $(popupElem).find(Constants.DOMStrings.notePopup_body).html('Start writing something...');
        
        // display
        $(popupElem).css('z-index', '3000');
        $(popupElem).animate({
            opacity: 1
        }, 500, "swing");
        
        $(popupElem).attr('data-id', Constants.ID_NEW_NOTE);
        
        // render bg overlay
        $(Constants.DOMStrings.notePopup_background).css('z-index', '2000');
        $(Constants.DOMStrings.notePopup_background).css('opacity', '1');
    }
    
    changeColor(note_id, newColor) {
        this.data[note_id].color = newColor;
    }
    
    // TODO: Change color
    getEditedNote(note_id) {
        const popupElem = $(`[data-id=${note_id}]`);
        const data = {};
        data.title = $(popupElem).find(Constants.DOMStrings.notePopup_title).html();
        data.content = $(popupElem).find(Constants.DOMStrings.notePopup_body).html();
        data.color = $(popupElem).css('background-color');
        return data;
    }
    
    deleteNote(note_id) {
        const url = $(location).attr('href');
        let path =  url.substring(url.indexOf('xnote')-1);
        path += 'delete'; // /xnote/username/delete
        console.log(note_id, path)
        Base.HttpRequest('DELETE', {note_id: note_id}, path);
    }
    
    saveNote(note_id) {
        const data = this.getEditedNote(note_id);
        this.data[note_id].title = data.title;
        this.data[note_id].content = data.content;
        const url = $(location).attr('href');
        let path =  url.substring(url.indexOf('xnote')-1);
        if(note_id === Constants.ID_NEW_NOTE)
            path += 'create'
        else
            path += note_id;
        console.log("saveNote(): ", data, path);
        this.data[note_id].color = this.data[note_id].color.replace('#', ''); // server doesn't need the #
        this.data[note_id].owner = Base.getUsername();
        Base.postData(this.data[note_id], path);
        console.log(data);
    }
    
};