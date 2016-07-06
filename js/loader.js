/**
 * 资源加载器
 * Modified from Hilo.js
 * by fwon
 */

import EventEmitter from 'eventemitter3';

function getExtension(src){
    var extRegExp = /\/?[^/]+\.(\w+)(\?\S+)?$/i, match, extension;
    if(match = src.match(extRegExp)){
        extension = match[1].toLowerCase();
    }
    return extension || null;
}

class ImageLoader {
    load(data) {
        const self = this;

        let image = new Image();
        if (data.crossOrigin) {
            image.crossOrigin = data.crossOrigin;
        }
        image.onload = function() {
            self.onLoad(image);
        };

        image.onerror = image.onabort = self.onError.bind(image);
        image.src = data.src;

    }

    onLoad(e) {
        e = e || window.event;
        let image = e;
        image.onload = image.onerror = image.onabort = null;
        return image;
    }

    onError() {
        let image = e.target;
        image.onload = image.onerror = image.onabort = null;
        return e;
    }
}

class ScriptLoader {
    load(data){
        var self = this, src = data.src, isJSONP = data.type == 'jsonp';

        if(isJSONP){
            var callbackName = data.callbackName || 'callback';
            var callback = data.callback || 'jsonp' + (++ScriptLoader._count);
            var win = window;

            if(!win[callback]){
                win[callback] = function(result){
                    delete win[callback];
                }
            }
        }

        if(isJSONP) src += (src.indexOf('?') == -1 ? '?' : '&') + callbackName + '=' + callback;
        if(data.noCache) src += (src.indexOf('?') == -1 ? '?' : '&') + 't=' + (+new Date());

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = self.onLoad.bind(self);
        script.onerror = self.onError.bind(self);
        script.src = src;
        if(data.id) script.id = data.id;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    onLoad(e) {
        let script = e.target;
        script.onload = script.onerror = null;
        return script;
    }

    onError(e) {
        let script = e.target;
        script.onload = script.onerror = null;
        return e;
    }
}

class CssLoader {
    load(data) {
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        if(data.id) link.id = data.id;
        link.addEventListener('load', this.onLoad.bind(this), false);
        link.addEventListener('error', this.onError.bind(this), false);
        link.href = data.src;
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    onLoad(e) {
        return e.target;
    }

    onError(e) {
        return e;
    }
}

export default class Loader extends EventEmitter{
    constructor(options) {
        super(options);
        this._source = [];
        this._loaded = 0;
        this._currentIndex = -1;
        this._completeCb = null;
    }
    load(source, complete) {
        if (source) {
            source = source instanceof Array ? source : [source];
            this._source = this._source.concat(source);
        }
        if (complete && complete instanceof Function) {
            this.on('complete', complete);
        }
        this._loadNext();
        return this;
    }
    _loadNext() {
        const self = this;
        let source = self._source;
        let len = source.length;
        if (self._loaded >= len) {
            self.emit('complete');
            return;
        }

        if (self._currentIndex < len - 1) {
            ++self._currentIndex;
            let index = self._currentIndex;
            let item = source[index];
            let loader = self._getLoader(item);

            if (loader) {
                let onLoad = loader.onLoad, onError = loader.onError;

                loader.onLoad = function(e) {
                    loader.onLoad = onLoad;
                    loader.onError = onError;
                    let content = onLoad && onLoad.call(loader, e) || e.target;
                    self._onItemLoad(index, content);
                }
                loader.onError = function(e) {
                    loader.onLoad = onLoad;
                    loader.onError = onError;
                    onError && onError.call(loader, e);
                    self._onItemError(index, e);
                }
            }
            loader && loader.load(item);
            self._loadNext();
        }
    }

    _getLoader(item) {
        const self = this;
        let loader = item.loader;

        if (loader) return loader;
        let type = item.type || getExtension(item.src);
        switch(type) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                loader = new ImageLoader();
                break;
            case 'js':
            case 'jsonp':
                loader = new ScriptLoader();
                break;
            case 'css':
                loader = new CssLoader();
                break;
        }

        return loader;
    }

    _onItemLoad(index, content) {
        const self = this;
        let item = self._source[index];

        item.loaded = true;
        item.content = content;
        self._loaded++;
        self.emit('load', item);
        self._loadNext();
    }

    _onItemError(index, e) {
        const self = this;
        let item = self._source[index];

        item.error = e;
        self._loaded++;
        self.emit('error', item);
        self._loadNext();
    }
}

