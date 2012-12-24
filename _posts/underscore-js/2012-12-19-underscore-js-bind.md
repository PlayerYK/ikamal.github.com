---
layout: post
category : underscore
tags : [underscore, javascript]
---
{% include JB/setup %}

这里只记录我看不懂的内容。

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
`apply` 和 `call` 功能类似，只不过只接受两个参数，第二个参数 `argArray` 是一个数组，作为函数的参数传入。

【2】这一句的意思是，如果支持原生的bind() [Function.prototype.bind (thisArg [, arg1 [, arg2, …]])](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.5)，
就调用原生的，并把当前的参数传入，第一个参数是`func`,之后的参数依次传入。  
slice = Array.prototype.slice.call [Array.prototype.slice.call](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.10)    
_call将指定函数`Function`作为`thisArg`对象的方法来调用，将参数`args`传递给`Function`，返回值为`Function`的返回值。_  
这句是取第一位以后的`arguments`，这个`arguments`并不是数组，但是有个`length`属性，所以能用`Array.prototype.slice`调用  
具体到这里，伪代码可以简略解释如下：

    Array.prototype.slice = function(start,end){
    	var result = new Array();
    	//注释部分是处理参数为负数的情况，可以掠过
    	//len = this.length;
    	//start = start < 0 ? max(len + start) : min(start,len);
    	//end = end ? len : end;
    	//end = end < 0 ? max((len + end),0) : min(end,len);
    	for(var i = start; i < end; i++){
    		result.push(this[i]);
    	}
    	return result;
    }
这里与内部实现有出入，不要深究细节，明白意思就行了。总之就是将当前函数的`agruments`转成数组

【3】这段代码有点复杂  
先上一个简单版本，绑定一个函数到一个对象上：
    
    _.bind = function(func, obj) {
        var aArgs = slice.call(arguments, 2);
        return function() {
            return func.apply(obj, args.concat(slice.call(arguments)));
        }
    };
功能就是把`bind()`时传入的参数与原来的参数合并，返回一个函数，更详细的解释[这里有](http://stackoverflow.com/questions/5603157/underscore-behavior-with-bind?rq=1)  
更多阅读参考[partial application](http://msdn.microsoft.com/en-us/magazine/gg575560.aspx)，
还有 [JavaScript currying](http://www.dustindiaz.com/javascript-curry/)

Github上根据[这个Issue](https://github.com/documentcloud/underscore/issues/280),
为了更像原生的`bind()`, 需要支持`new`一个被绑定的函数。
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
    
为了支持`bound()`单独调用被绑定的函数，
[测试用例](https://github.com/simao/underscore/blob/master/test/functions.js)  

updated:2012年12月24日 20:31:57 星期一  
原型链，new机制，原生bind()机制把我搞的头大了，明天继续  
tobe continued...