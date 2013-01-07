---
layout: post
category : underscore
tags : [underscore, javascript]
---
{% include JB/setup %}

**Collection Functions (Arrays or Objects)**  
Collections分类是underscore.js最基础的函数的集合，除了上文的`each`还有`map`、`find`等常用函数，
具体请参考[官方文档][1] 和[带注释的源码][2]

**map** \_.map(list, iterator, [context]) 别名:**collect**

用转换函数(**iterator**)处理**list**中的每个元素，组成一个新的数组。如果原生支持 **map** 则调用原生方法。
如果 **list** 是JavaScript对象，则转换函数(**iterator**)的参数为`(value, key, list)`；如果是数组则为`(value, index, list)`



[1]: http://documentcloud.github.com/underscore/ "underscore.js doc"
[2]: http://documentcloud.github.com/underscore/docs/underscore.html "annotated source code."

updated: 2013年1月7日 17:36:06 星期一