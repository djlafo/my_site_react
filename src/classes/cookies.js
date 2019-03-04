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

    static getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
      

    static setCookie(name, val) {
        document.cookie = `${name}=${val};`;
    }

    static removeCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }

    static removeAllCookies() {
        const splitCookies = document.cookie.split(';');
        splitCookies.forEach((splitCookie) => {
            let evenMoreSplitCookie = splitCookie.split('=');
            this.removeCookie(evenMoreSplitCookie[0]);
        });
    }
}

export default Cookies;