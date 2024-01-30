import Cookies from 'js-cookie';

const domain = import.meta.env.VITE_DOMAIN || 'localhost';


function setCookie(name, value, expire=1) {
    Cookies.set(name, value, {expires: expire});    
}

function getCookie(name) {
    return Cookies.get(name);    
}

function deleteCookie(name) {
    return Cookies.remove(name, {domain});    
}

function hasCookie(name) {
    return Cookies.get(name) ? true : false;    
}



export {setCookie, getCookie, deleteCookie, hasCookie};