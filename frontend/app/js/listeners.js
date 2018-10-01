import * as Constants from './constants';
import * as Base from './base';


// TODO: Organize listeners into proper categories 

const actionHandler = (function () {
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

    return {
        color,
        image,
        copy,
        pin,
        archive,
        discard,
        pickLabel
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
    // Open add note
    // TODO: Replace with + button
    //    $('.dashboard__top--add').find('.input--text').focus(() => {
    //        console.log('Adding class...');
    //       $('.add-note__box').addClass('add-note__box--active');
    //    });
    //

    $('.note-card').click((e) => {
        console.log("Open card for editing.");
        // get note properties
        let elem = e.target;
        while (!($(elem).hasClass('note-card')))
            elem = $(elem).parent();

        // display note by id
        _Notes.displayNote(String($(elem).attr('data-id')));
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

    // close labels
    //        $(Constants.DOMStrings.notePopup_labels).find(Constants.DOMStrings.actionBtn_text).click(function() {
    //            console.log("Close labels");
    //        });

    // done button
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


const setupActionEventListeners = (_Notes) => {
    // colorpicker
    $(Constants.DOMStrings.actionIcon).click(function () {
        const dataAction = $(this).attr('data-action');
        if (dataAction)
            actionHandler[dataAction](_Notes);
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
        _Notes.setCurLabel(category);
    });
}