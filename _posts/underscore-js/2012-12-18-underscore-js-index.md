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
        if (nativeForEach && obj.forEach === nativeForEach) { //nativeForEach = Array.prototype.forEach
          obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) { // 解释【1】
          for (var i = 0, l = obj.length; i < l; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return; // 解释【2】、【3】
          }
        } else {
          for (var key in obj) {
            if (_.has(obj, key)) {
              if (iterator.call(context, obj[key], key, obj) === breaker) return;
            }
          }
        }
      };

【1】 [一元运算符+](http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.6)

    1. Let expr be the result of evaluating UnaryExpression.
    2. Return ToNumber(GetValue(expr)).


【2】[Function.prototype.call](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.4)  Function.prototype.call\(thisArg \[ , arg1 \[ , arg2, … \] \] \)


【3】神秘的breaker

关于中断枚举这里有[好长的讨论](https://github.com/documentcloud/underscore/issues/596)
简略版有[很好的总结](http://stackoverflow.com/questions/11600735/underscores-each-checking-for-return-of-callback)

> 用一个秘密的变量来中断each循环，这个变量不暴露在外。
> 不暴露的原因是原生方法中（目前）没有这个特性，如果这样做了（暴漏这个秘密变量在外），
> 就会导致（用户写的代码中的）中断特性只有在原生函数不支持的时候才能用

Tobe continued...








<script src="/lib/jquery.js" type="text/javascript"></script>
<script src="/lib/underscore.js" type="text/javascript"></script>