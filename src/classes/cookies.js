class Cookies {
    static getCookies() {
        const splitCookies = document.cookie.split(';');
        const hashCookie = {};
        splitCookies.forEach((splitCookie) => {
            let evenMoreSplitCookie = splitCookie.split(':');
            hashCookie[evenMoreSplitCookie[0]] = evenMoreSplitCookie[1];
        });
        return hashCookie;
    }

    static getCookie(name) {
        return this.getCookies()[name];
    }

    static getAccountCookie() {
        return this.getCookie('account');
    }

    static setCookie(name, val) {
        if(this.getCookie(name)) {
            this.removeCookie(name);
        }
        document.cookie += `${name}=${val}`;
    }

    static removeCookie(name) {
        const splitCookies = document.cookie.split(';');
        const newCookie = '';
        splitCookies.forEach((splitCookie) => {
            let evenMoreSplitCookie = splitCookie.split(':');
            if(evenMoreSplitCookie[0] !== name) {
                newCookie += `${evenMoreSplitCookie[0]}=${evenMoreSplitCookie[1]};`;
            }
        });
        document.cookie = newCookie;
    }
}

export default Cookies;