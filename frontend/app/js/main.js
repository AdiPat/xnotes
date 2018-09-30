import * as $ from 'jquery';
import * as Base from './base';
import * as Constants from './constants';
import * as Listeners from './listeners';
import Notes from './Notes';

var _Notes;

// export jquery 
window.$ = $;

$('document').ready(function() {
    _Notes = new Notes();
    Listeners.setupListeners(_Notes);
    // set colors
    $('.colorpicker-color').each(function() {
        const color = Constants.COLORS[$(this).attr('data-color')];
        if(color === Constants.COLORS.white)
            $(this).css('border', '2px solid lightgrey');
        $(this).css('background-color', color);
    });
    Base.printStart();
    beautifyNotes();
});


// replace with something better
const beautifyNotes = () => {
    const noteElems = document.querySelectorAll('.note-card__content');
    noteElems.forEach((e) => {
        if(e.innerHTML.length > 100) 
            e.innerHTML = e.innerHTML.substring(0,150) + '...';
    });
};