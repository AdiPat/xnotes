import * as Constants from './constants';
import * as Base from './base';

export default class Notes {

    constructor(notes) {
        this.data = {};
        let filledDefault = false;
        for(let key in notes) {
            notes[key].color = '#' + notes[key].color;
            notes[key].selected = false; // selected state
            this.data[notes[key]['note_id']] = notes[key];
            // fill empty new notes object
            if(!filledDefault) {
                this.data[Constants.ID_NEW_NOTE] = {};
                for(let k in notes[key]) {
                     this.data[Constants.ID_NEW_NOTE][k] = null;
                }
                this.data[Constants.ID_NEW_NOTE]['note_id'] = Constants.ID_NEW_NOTE;
                filledDefault = true;
            }
        }
        this.curLabel = 'all'; // current label
        this.curColor = 'all'; // current color
        console.log("Notes constructor: Added notes!",this.data);
    }
    
    // gets id of current open note from popup
    getCurrentID() {
        return String($(Constants.DOMStrings.notePopup).attr('data-id'));
    }
    
    // gets data from label menu 
    getLabelData() {
        const labels = [];
        console.log("getLabelData()", $(Constants.DOMStrings.checkboxLabelMenu).prop('checked'));
        // pull data only if checkbox is checked
        if($(Constants.DOMStrings.checkboxLabelMenu).prop('checked')) {
            const labelList = $(Constants.DOMStrings.notePopup_labelsList);
            labelList.children().each(function() {
                const lbl = $(this).find('label').attr('data-label');
                const selected = $(this).find('input').prop('checked');
                if(selected)
                    labels.push(lbl);
            });
        }
        return labels;
    }
    
    // displays note in popup when card is clicked
    
    displayNote(note_id) {
        // get note data
        const noteData = this.data[note_id];
        // set properties
        let popupElem = $(Constants.DOMStrings.notePopup);
        $(popupElem).css('background-color', noteData.color);
        $(popupElem).find(Constants.DOMStrings.notePopup_title).html(noteData.title);
        $(popupElem).find(Constants.DOMStrings.notePopup_body).html(noteData.content);
        // TODO: Format this properly
        $(popupElem).find(Constants.DOMStrings.notePopup_lastEdited).html(noteData.last_edited); 
        
        // set labels 
        $(Constants.DOMStrings.notePopup_labelsList).children().each(function() {
            const dataLabel = $(this).children('label').attr('data-label');
            if(noteData.labels.indexOf(dataLabel) == -1)
                $(this).children('input').prop('checked', false);
            else
                $(this).children('input').prop('checked', true);
        });
        
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
    
    // initializes popup element with default values and ID of new note
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
    
    deleteNote(note_id) {
        const url = $(location).attr('href');
        let path =  url.substring(url.indexOf('xnote')-1);
        path += 'delete'; // /xnote/username/delete
        console.log(note_id, path)
        // if the item is trashed, hard delete
        Base.HttpRequest('DELETE', {note_id: note_id, hard: this.data[note_id].trash}, path);
    }
    
    restoreNote(note_id) {
        if(this.data[note_id])  {
            this.data[note_id].trash = false;
            if(this.curLabel === 'trash') {
                this.toggleCard(note_id, 'hidden'); // note should not appear in trash anymore
            }
            this.updateNote(note_id);
        }
    }
    
    // TODO: add all fields
    saveNote(note_id) {
        const popupElem = $(`[data-id=${note_id}]`);
        this.data[note_id].title = $(popupElem).find(Constants.DOMStrings.notePopup_title).html();
        this.data[note_id].content = $(popupElem).find(Constants.DOMStrings.notePopup_body).html();
        this.data[note_id].color = Base.rgbToHex(String($(popupElem).css('background-color')));
        // labels get set automatically when the user closes the labels option
        this.data[note_id].pinned = false; 
        this.data[note_id].trash = false;
        
        const url = $(location).attr('href');
        let path =  url.substring(url.indexOf('xnote')-1);
        if(note_id === Constants.ID_NEW_NOTE)
            path += 'create'
        else
            path += note_id;
        this.data[note_id].color = this.data[note_id].color.replace('#', ''); // server doesn't need the #
        this.data[note_id].owner = Base.getUsername();
        Base.postData(this.data[note_id], path);
    }
    
    toggleCard(note_id, state) {
        const noteCard = $(`[data-id = ${note_id}]`);
        if($(noteCard).length && state === 'visible')
            $(noteCard).css('display', 'flex');
        else if($(noteCard).length && state === 'hidden')
            $(noteCard).css('display', 'none');
        else
            return false;
    }
    
    setCurLabel(newLabel) {
        this.curLabel = newLabel; 
        // render views
        for(let key in this.data) {
            if(key === Constants.ID_NEW_NOTE) // TODO: Store this seperately
                continue;
            const isTrash = this.data[key].trash;
            // show trashed items only if curLabel == trash is set
            if((!isTrash && this.data[key].labels.indexOf(this.curLabel) !== -1) || (isTrash && this.curLabel === 'trash'))
                this.toggleCard(key, 'visible');
            else 
                this.toggleCard(key, 'hidden');
        }
    }
    
    // set color from Constants.COLORS 
    setCurColor(newColor) {
        if(Object.keys(Constants.COLORS).indexOf(newColor) === -1)
            return false;
        this.curColor = newColor;
        for(let key in this.data) {
            if(key === Constants.ID_NEW_NOTE)
                continue;
            
            if(this.data[key].color === Constants.COLORS[this.curColor])
                this.toggleCard(key, 'visible');
            else
                this.toggleCard(key, 'hidden');
        }
    }
     
    addLabels(note_id, labels) {
        console.log('addlabels:', labels);
        let curLabels = [] // we're adding all labels from the param and discarding the rest 
        if(!curLabels)
            curLabels = [];
        console.log(labels);
        labels.forEach( (e) => {
            if(curLabels.indexOf(e) == -1)
                curLabels.push(e);
        });
        this.data[note_id].labels = curLabels;
    }
    
    highlightCard(note_id, status=true, toggle=false) {
        let border =  '2px solid orangered';
        const card = $(`[data-id = ${note_id}]`);
        if($(card).length) { 
            if(toggle) // overrides status
                status = !this.data[note_id].selected; 
            if(!status)
                border = '2px solid transparent';
            $(card).css('border', border);
            this.data[note_id].selected = status;
        }
    }
    
    highlightAllCards(status=true) {
        Object.keys(this.data).forEach((id) => {
            if(id !== Constants.ID_NEW_NOTE) {
                const card = $(`[data-id = ${String(id)}]`);
                if($(card).length) {
                    const border = (status)?('2px solid orangered'):('2px solid transparent');
                    $(card).css('border', border);
                    this.data[id].selected = status;
                }
            }
        });
    }
    
    // sends updated note data from our local copy to server
    updateNote(note_id) {
        // for testing.. 
        const username = Base.getUsername();
        
        $.ajax({
           type: 'POST',
           data: this.data[note_id],
           path: `/xnote/${username}/edit`,
           success: function(response) {
               console.log(`Updated note=${note_id} || ${response}`);
           }
        });    
    }
};