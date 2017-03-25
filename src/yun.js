(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.yun = factory();
    }
}(this, function () {
    // 构建可继承的基对象
    var Class = (function(){
        var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
        var Class = function(){};
        Class.extend = function(prop) {
            var _super = this.prototype;

            initializing = true;
            var prototype = new this();
            initializing = false;

            for (var name in prop) {
                prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function(name, fn){
                        return function() {
                            var tmp = this._super;

                            this._super = _super[name];

                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) :
                    prop[name];
            }

            function Class() {
                if ( !initializing && this.init )
                    this.init.apply(this, arguments);
            }

            Class.prototype = prototype;

            Class.prototype.constructor = Class;
            Class.extend = arguments.callee;

            return Class;
        };
        return Class;
    })()

    return {
        Base: Class.extend({
            listen: fListen,
            trigger: fTrigger
        })
    };

    function fListen(oTarget, sEvent, fHandler){
        oTarget.__listeners = oTarget.__listeners || {};
        oTarget.__listeners[sEvent] = oTarget.__listeners[sEvent] || [];
        oTarget.__listeners[sEvent].push({
            observer: this,
            handler: fHandler
        });
    }

    function fTrigger(sEvent){
        var aListeners = (this.__listeners || {})[sEvent];
        var aParams = [];

        for (var cnt = 1, length = arguments.length; cnt < length; cnt += 1) {
            aParams.push(arguments[cnt]);
        }

        if(aListeners){
            for(var cnt = 0, length = aListeners.length; cnt < length; cnt += 1){
                var oListener = aListeners[cnt];
                if(oListener){
                    var oObserver = oListener.observer || this;
                    oListener.handler.apply(oObserver, aParams);
                }
            }
        }
    }

}));