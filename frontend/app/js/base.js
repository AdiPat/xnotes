export const printStart = () => {
    console.log("XNotes(JQuery) Hello - Powered by Django!!");
};

export const moveUpDOM = (elem, targetClass) => {
    let e = elem;
    let status = true;
    while(status && !($(e).hasClass(targetClass))) {
        if($(e).parent().length)
            e = $(e).parent()
        else 
            status = false;  
    }
    return [status, e];
}

export const postData = (data, path) => {
    $.ajax({
        type: 'POST',
        url: path,
        data: data,
        success: function() {
            console.log("Successfully sent data to django!");
            // redirect to home// TODO: read response and redirect
            window.location = $(location).attr('href');
        }
    });
}

export const HttpRequest = (method='GET', data, path) => {
    $.ajax({
       type: method,
       url: path,
       data: data,
        success: function() {
            console.log("HTTP REQUEST: " + method, " to " + path + " successful!");
            window.location = $(location).attr('href');
        }
    });
}

export const selectorToClass = (selector) => {
    return selector.substring(1); // strip the first dot
}

export const getUsername = () => {
    let url = $(location).attr('href');
    // 
    let start = url.indexOf('x') + 'xnote/'.length;
    url = url.substring(start);
    let end = url.indexOf('/');
    let username = url.substring(0,end);
    return username;
}

export const fadeToggle = (elem) => {
    const op = $(elem).css('opacity');
    if(op === '0') {
        $(elem).css('z-index', '5000');
        $(elem).css('opacity', '1');
    }
    else if(op === '1') {
        $(elem).css('opacity', '0');
        $(elem).css('z-index', '-5000');
    }
};