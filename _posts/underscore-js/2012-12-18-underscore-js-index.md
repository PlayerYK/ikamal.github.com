---
layout: post
category : underscore
tags : [underscore, javascript]
---
{% include JB/setup %}

[Underscore](http://github.com/documentcloud/underscore/)是一个JavaScript函数库，
在不修改原生对象的基础上提供了很多支持函数式编程的工具。[官方文档](http://documentcloud.github.com/underscore/)
已经详细的介绍了使用方法，还有大量的栗子。还有[加了注释的源代码](http://documentcloud.github.com/underscore/docs/underscore.html)

Underscore有80多个函数，使用Backbone.js时发现了这个精巧的函数库。
这里的`javascript templating`可以单独拿出来用到别的小项目中，快速生成前端页面。
其它还有`forEach`、`map`、`indexOf`等Array操作中常用但是原生js中没有的功能。
最近的新版本中还增加了函数绑定等新功能。

阅读源码时发现我的js基础不是一般的差，下面就是记录我看不懂到看懂的过程。

**each** _.each(list, iterator, \[context\]) Alias: **forEach**

遍历**List**，用其中的每个值生成一个**iterator**对象。如果传入了**context**，
则把**iterator**绑定到**context**对象上。每次调用**iterator**对象都会传入三个参数：
`(element, index, list)`，如果**List**是一个JavaScript对象，则传入参数：`(value, key, list)`。
如果有原生的forEach（ECMAScript 5）方法，则会调用原生方法。

      var each = _.each = _.forEach = function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) { //【1】
          obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) { // 【2】【3】
          for (var i = 0, l = obj.length; i < l; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return; // 【4】【5】
          }
        } else {
          for (var key in obj) {
            if (_.has(obj, key)) {
              if (iterator.call(context, obj[key], key, obj) === breaker) return;
            }
          }
        }
      };

【1】//nativeForEach = Array.prototype.forEach

【2】 [一元运算符+](http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.6)

    1. Let expr be the result of evaluating UnaryExpression.
    2. Return ToNumber(GetValue(expr)).

【3】这里只检查length属性，这样会有问题的吧，不只是Array，argument才有length属性，如果用户自己构造了一个带length属性的对象，
这样的结果会很意外吧：

    function show(val,key,o){
        console.log(val);
        console.log(key);
        console.log(o);
        console.log('----');
    }

    var obj = {
        "length":3,
        "var1":"one",
        "var4":"four"
    };
    _.each(obj,show);



执行结果见[jsbin](http://jsbin.com/uxeneb/3/edit)：

    undefined
    0
    Object {length: 3, var1: "one", var4: "four"}
    ----
    undefined
    1
    Object {length: 3, var1: "one", var4: "four"}
    ----
    undefined
    2
    Object {length: 3, var1: "one", var4: "four"}
    ----
【4】[Function.prototype.call](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.4)
Function.prototype.call\(thisArg \[ , arg1 \[ , arg2, … \] \] \)  
call将指定函数`Function`作为`thisArg`对象的方法来调用，将参数`args`传递给`Function`，返回值为`Function`的返回值。

【5】神秘的breaker
关于underscore.js中断枚举Github有[好长的讨论](https://github.com/documentcloud/underscore/issues/596)，
Stackoverflow有个回答是[简略版](http://stackoverflow.com/questions/11600735/underscores-each-checking-for-return-of-callback)

> 用一个秘密的变量来中断each循环，这个变量是underscore的内部变量。
> 不暴露在外的原因是原生方法中（目前）没有这个特性，如果这样做了，
> 就会导致（用户写的代码中的）中断特性只有在原生函数不支持的时候才能用

不过看源码是先尝试用原生的forEach方法，既然原生不支持，那执行到这里的时候就不能中断了？

待续……







<script src="/lib/jquery.js" type="text/javascript"></script>
<script src="https://raw.github.com/documentcloud/underscore/master/underscore-min.js" type="text/javascript"></script>