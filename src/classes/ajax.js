class Ajax {
    //format err,res,body
    static read(url, {data, headers, json=true, auth}, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        this._addHeaders(xhr, {headers, auth, json});
        this._addCallbacks(xhr, {}, onSuccess, onError);
        xhr.send();
        return xhr;
    }

    //format err,res,body
    static post(url, {data, headers, json=true, auth}, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        this._addHeaders(xhr, {headers, auth, json});
        this._addCallbacks(xhr, {}, onSuccess, onError);
        xhr.send(json ? JSON.stringify(data) : data);
        return xhr;
    }

    static _addHeaders(xhr, {headers, auth, json}) {
        headers && headers.forEach((header) => {
            xhr.setRequestHeader(header.key, header.value);
        });
        if(json) xhr.setRequestHeader('Content-Type', 'application/json');
        if(auth) xhr.setRequestHeader('Authorization', `Token ${auth}`);
    }

    static _addCallbacks(xhr, { json=true }, onSuccess, onError) {
        if(onSuccess) xhr.onload = () => onSuccess(json ? JSON.parse(xhr.response) : xhr.response);
        xhr.onerror = () => {
            if(onError) {
                onError();
            } else {
                alert('Cannot connect to server');
            }
        }
    }
}

export default Ajax;