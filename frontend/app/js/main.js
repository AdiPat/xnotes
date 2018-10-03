import * as $ from 'jquery';
import * as Base from './base';
import * as Constants from './constants';
import * as Listeners from './listeners';
import Notes from './Notes';

var _Notes;

// export jquery 
window.$ = $;

// get all note data from server
(() => {
    console.log(window.location.href + 'notes');
    $.ajax({
        type: 'GET',
        url: window.location.href + 'notes',
        success: function (data) {
            console.log("Successful GET!");
            _Notes = new Notes(data);
        }
    });
})();


$('document').ready(function () {
    Base.initGrid('.dashboard__content', '.note-card', 3,2,1);
    var checkExist = setInterval(() => {
        if (_Notes) {
            Listeners.setupListeners(_Notes);
            // set colors
            $('.colorpicker-color').each(function () {
                const color = Constants.COLORS[$(this).attr('data-color')];
                if (color === Constants.COLORS.white)
                    $(this).css('border', '2px solid lightgrey');
                $(this).css('background-color', color);
            });
            Base.printStart();
            beautifyNotes();
            clearInterval(checkExist);
        }
    }, 100);
});


// replace with something better
const beautifyNotes = () => {
    const noteElems = document.querySelectorAll('.note-card__content');
    noteElems.forEach((e) => {
        if (e.innerHTML.length > 100)
            e.innerHTML = e.innerHTML.substring(0, 150) + '...';
    });
};