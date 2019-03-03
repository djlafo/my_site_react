class Cookies {
    static getCookies() {
        const splitCookies = document.cookie.split(';');
        const hashCookie = {};
        splitCookies.forEach((splitCookie) => {
            let evenMoreSplitCookie = splitCookie.split('=');
            if(!hashCookie[evenMoreSplitCookie[0]]) {
                hashCookie[evenMoreSplitCookie[0]] = evenMoreSplitCookie.slice(1, evenMoreSplitCookie.length).join();
            }
        });
        return hashCookie;
    }

    static getCookie(name) {
        return this.getCookies()[name];
    }

    static setCookie(name, val) {
        document.cookie = `${name}=${val};`;
    }

    static removeCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    static removeAllCookies() {
        const splitCookies = document.cookie.split(';');
        splitCookies.forEach((splitCookie) => {
            let evenMoreSplitCookie = splitCookie.split(':');
            this.removeCookie(evenMoreSplitCookie[0]);
        });
    }
}

export default Cookies;