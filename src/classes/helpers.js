
export class Debounce {
    constructor() {
        this.timeout = null;
    }

    call(fn, time) {
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            fn();
            this.timeout = null;
        }, time);
    }
}