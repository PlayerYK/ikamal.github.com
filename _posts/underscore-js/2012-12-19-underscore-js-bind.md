---
layout: post
category : underscore
tags : [underscore, javascript]
---
{% include JB/setup %}

**Collection Functions (Arrays or Objects)**  
Collections分类是underscore.js最基础的函数的集合，除了上文的`each`还有`map`、`find`等常用函数，具体请参考[官方文档](http://documentcloud.github.com/underscore/)

这里只记录我看不懂的内容


另一个基础函数

**\_bind** _.bind(function, object, [*arguments])  

    _.bind = function(func, context) {
        var args, bound;
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));//【1】【2】
        if (!_.isFunction(func)) throw new TypeError;
        args = slice.call(arguments, 2);
        return bound = function() {//【3】
            if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
            ctor.prototype = func.prototype;
            var self = new ctor;
            ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) return result;
            return self;
        };
    };
    
【1】[Function.prototype.apply](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.3)
Function.prototype.apply (thisArg, argArray)

【2】Array.prototype.slice.call

【3】这段代码有点复杂  
先上一个简单版本：
    
    _.bind = function(func, obj) {
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        var aArgs = slice.call(arguments, 2);
        return function() {
            return func.apply(obj, args.concat(slice.call(arguments)));
        }
    };
    
需要解释的就是这里的[partial application](http://msdn.microsoft.com/en-us/magazine/gg575560.aspx)
还有 [JavaScript currying](http://www.dustindiaz.com/javascript-curry/)

Github上根据[这个Issue](https://github.com/documentcloud/underscore/issues/280),
[在MDN的建议下](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind),
[Pull request #282 ](https://github.com/simao/underscore/commit/fe30447d2dacd2c232c5df9f27834ebee6989b8b)让这段代码变成这么复杂了

    _.bind = function(func, obj) {
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        var aArgs = slice.call(arguments, 2),
            fNOP = function () {},
            fBound = function () {
                return func.apply(this instanceof fNOP ? this : obj, aArgs.concat(slice.call(arguments)));
            };
    
        fNOP.prototype = func.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };

updated:2012年12月19日 15:43:32
tobe continued...