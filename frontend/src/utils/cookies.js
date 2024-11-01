import Cookies from 'js-cookie';


function setCookie(name, value, expire=1) {
    Cookies.set(name, value, {expires: expire});    
}

function getCookie(name) {
    return Cookies.get(name);    
}

function deleteCookie(name) {
    return Cookies.remove(name);    
}

function hasCookie(name) {
    return Cookies.get(name) ? true : false;    
}


export {setCookie, getCookie, deleteCookie, hasCookie};