const ajax = require('ajax-request');

class Ajax {
    //format err,res,body
    static read(url, opt, callback) {
        ajax(Object.assign({
            url: url,
            method: 'GET',
            json: true
        }, opt), callback);
    }

    //format err,res,body
    static post(url, opt, callback) {
        ajax.post(Object.assign({
            url: url,
            json: true
        }, opt), callback);
    }

    // format function(err,res,body,destpath)
    static download(url, opt, callback) {
        ajax.download(Object.assign({
            url: url,
        }, opt), callback)
    }
}

export default Ajax;