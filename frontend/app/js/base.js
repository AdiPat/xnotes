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


// 54/16 = 36 
export const rgbToHex = (rgbVal) => {
    if(rgbVal.indexOf('rgb') != -1)
        return rgbVal;
    function intToHex(val) {
        const table = {10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'};
        let hexStr = "";
        while(val != 0) {
            let rem = val % 16;
            if(rem > 9)
                hexStr += table[rem];
            else
                hexStr += String(rem);
            val = parseInt(val/16);
        }   
        return hexStr.split("").reverse("").join("");
    }
    let rgbStr = rgbVal.replace(')','').replace('rgb(','').replace(' ', '');
    const arr = rgbStr.split(',').map((e) => parseInt(e.trim()));
    return arr.reduce( (acc,e) => acc + intToHex(e), '');
};