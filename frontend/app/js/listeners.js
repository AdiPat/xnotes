import * as Constants from './constants';
import * as Base from './base';

var shiftPressed = false;

// TODO: Organize listeners into proper categories 

const actionHandler = (function () {
    
    let data = {};
    
    // if the hander needs any data
    const setData = (param) => {
        data = param;
    }
    
    // clear data after you have finished using it
    const clearData = (data) => {
        data = {};
    }
    
    const color = (_Notes) => {
        // TODO
        Base.fadeToggle($(Constants.DOMStrings.colorPicker));
        console.log("Change color?");
    };

    const image = (_Notes) => {
        // TODO
        console.log("Add image?");
    };

    const copy = (_Notes) => {
        // TODO
        console.log("Copy to clipboard.");
    };

    const archive = (_Notes) => {
        // TODO
        console.log("Adding note to archives");
    };

    const discard = (_Notes) => {
        console.log("Deleting note. wtf");
        console.log($(Constants.DOMStrings.notePopup).attr('data-id'));
        _Notes.deleteNote($(Constants.DOMStrings.notePopup).attr('data-id'));
    };
    
    const restore = (_Notes) => {
        let val = Base.moveUpDOM(data.event.target, Constants.DOMStrings.noteCard.replace('.', ''));
        if(val[0]) // found
            _Notes.restoreNote($(val[1]).attr('data-id'));
    }

    const pin = (_Notes) => {
        // TODO:
        console.log("Pin note");
    };

    const pickLabel = (_Notes) => {
        console.log("Selecting labels..");
        const note_id = _Notes.getCurrentID();
        // extract labels 
        const labels = _Notes.getLabelData();
        _Notes.addLabels(note_id, labels);
    };
    
    const logout = () => {
        $.ajax({
           type: 'POST',
           url: '/xnote/logout',
           data: {username: Base.getUsername()},
           success: function(response) {
               window.location = $(location).attr('href');
           }
        });
    };

    return {
        setData, // sets data required for the handler 
        clearData, // clears data after use so that the next handler doesn't accidentally use this data
        color,
        image,
        copy,
        pin,
        archive,
        discard,
        restore,
        pickLabel,
        logout
    };

})();

const navHandler = (function () {

    const all = (_Notes) => {
        console.log('all');
    };


    const work = (_Notes) => {
        console.log('work');
    };


    const personal = (_Notes) => {
        console.log('personal');
    };


    const archive = (_Notes) => {
        console.log('archive');
    };


    const trash = (_Notes) => {
        console.log('trash');
    };

    return {
        all,
        work,
        personal,
        archive,
        trash
    };
})();

// TODO Seperate listeners to improve readability 

export const setupListeners = (_Notes) => {
    
    // masonry grid
    $(window).on('resize load', () => {
        Base.initGrid('.dashboard__content','.note-card',3,2,1); 
    });
    
    
    
    // Open add note
    // TODO: Replace with + button
    //    $('.dashboard__top--add').find('.input--text').focus(() => {
    //        console.log('Adding class...');
    //       $('.add-note__box').addClass('add-note__box--active');
    //    });
    //
    
    $(document).keydown(function(event) {
        if(event.keyCode === Constants.KEY_CODES['shift']) { //control
            event.preventDefault(); // prevent text from getting highlighted
            shiftPressed = true; 
        }
        
        if(!shiftPressed && event.keyCode === Constants.KEY_CODES['esc']) { // escape
            shiftPressed = false;
            _Notes.highlightAllCards(false);
        }
    });
    
    $(document).keyup(function(event) {
        if(event.keyCode === Constants.KEY_CODES['shift']) {
            shiftPressed = false; 
        } 
    });

    $(Constants.DOMStrings.noteCard).click((e) => {
        console.log("Clicked note. ");
        e.preventDefault();
        // get note properties
        let elem = e.target;
        while(!($(elem).hasClass(Base.selectorToClass(Constants.DOMStrings.noteCard)))) {
            if($(elem).hasClass(Base.selectorToClass(Constants.DOMStrings.actionIcon))) // terminate
                return;
            elem = $(elem).parent();
        }
            
        // display note by id
        const note_id = String($(elem).attr('data-id'));
        if(shiftPressed) 
            _Notes.highlightCard(note_id, true,true); // TODO: Get rid of status. redundant
        else
            _Notes.displayNote(note_id);
    });

    // close button
    $('.note__popup-actions--close').click(() => {
        $('.note__popup').css('z-index', '-3000');
        $('.note__popup').animate({
            opacity: 0
        }, 500, "swing");

        $('.note__popup-bg').css('z-index', '-2000');
        $('.note__popup-bg').css('opacity', '0');

        // uncheck checkbox when closing popup
        $(Constants.DOMStrings.checkboxLabelMenu).prop('checked', false);
    });

    $(Constants.DOMStrings.notePopup_done).click((event) => {
        let val = Base.moveUpDOM(event.target, Constants.DOMStrings.notePopup.replace('.', ''));
        // redundant , but ok.
        if (val[0]) {
            _Notes.saveNote(String($(val[1]).attr('data-id')));
        }
    });

    $(Constants.DOMStrings.addNoteBtn).click(function () {
        _Notes.createNote();
    });
    

    // Action events
    setupActionEventListeners(_Notes);
    setupNavListeners(_Notes);
};


// lister for all action buttons
const setupActionEventListeners = (_Notes) => {
    // colorpicker
    $(Constants.DOMStrings.actionIcon).click(function(e) {
        // for now , actions happen on popup and card
        const dataAction = $(this).attr('data-action');
        console.log(dataAction);
        if (dataAction) {
            actionHandler.setData({event:e});
            actionHandler[dataAction](_Notes);
            actionHandler.clearData();
        }
    });

    // change color
    $(Constants.DOMStrings.colorPicker_color).click(function () {
        console.log('colorchange');
        const color = Constants.COLORS[$(this).attr('data-color')];
        const note_id = $(Constants.DOMStrings.notePopup).attr('data-id');
        _Notes.changeColor(note_id, color);
        // change color
        $(Constants.DOMStrings.notePopup).css('background-color', color);
    });

    // label menu close
    $(Constants.DOMStrings.notePopup_labels + ' > span').click(function () {
        console.log("Close labels");
        actionHandler.pickLabel(_Notes);
        $(Constants.DOMStrings.checkboxLabelMenu).prop('checked', false);
    });
};

const setupNavListeners = (_Notes) => {
    $(Constants.DOMStrings.sideNav_item).click(function () {
        const parent = Base.moveUpDOM($(this), Base.selectorToClass(Constants.DOMStrings.sideNav_item));
        const category = $(parent[1]).attr('data-category');
        console.log("CLICKED: ", category);
        //Base.initGrid('.dashboard__content', '.note-card', 3,2,1);
        _Notes.setCurLabel(category);
    });
}