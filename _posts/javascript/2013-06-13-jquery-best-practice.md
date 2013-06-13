---
layout: post
category : javascript
tags : [javascript, jquery]
title : jQuery最佳实践若干
---
{% include JB/setup %}

1. jQuery 几种不同的写法区别 

        window.jQuery = window.$ = jQuery;  
1. 8000墙了jQuery CDN?

        <!-- Grab Google CDN jQuery. fall back to local if necessary -->
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <script>!window.jQuery && document.write('<script src="js/jquery-1.8.3.min.js">\x3C/script>')</script>
1. `$(document).ready(function() {...})` 可以改成 `$(function() {...})`   
源码:

    	// HANDLE: $(function)
		// Shortcut for document ready
		if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}


1. $()这个函数可以当成入口，执行初始化的操作，其他函数都移到外面。  
最后只剩下类似 `validateLogin();` 、 `$("#btn").click(check);` 这样的调用。  
ajax方法也类似，success()中定义的匿名方法不方便调试和修改。

1. 同一个函数里面 `$(this)` 应该缓存，避免创建多个jQuery对象  

        var _this = $(this);`
 
1. 尽量用链式写法，或者用本地变量，避免创建多个jQuery对象  

        cur.removeClass("active");
        cur.next().addClass("active");
可以改写成

        cur.removeClass("active").next().addClass("active");
1. 用代理事件避免重复绑定

        // bad
        $('#container').each(function(){
            $('this').find('.item').click(function() { ... });
        })
        // better
        $('#container').delegate(".item", "click", function() { ... });
        $('#container').on("click", ".item", function() { ... });
1. 动画方法想要链式执行，需要放到回调函数中

        $("p").click(function(e){
          $(this).fadeOut("slow", function(){
            $(this).remove();
          });
        });
1. 创建对象的时候传入属性

        $('</a>', {
            id : 'someId',
            className : 'someClass',
            href : 'somePath.html'
        });

1. `$(this).css` 虽然高效，但是不利于修改，应该只修改class，样式定义在CSS中


1. 只要选择器写的不是太复杂，jQuery会自动优化执行，一般不用担心性能。但是有一点是真的可以优化的。①IE6/7中分开写，会调用原生的选择器,避免调用sizzle；②多写一个id，相当于增加了context，提高查询效率）

		// Fine in modern browsers, though Sizzle does begin "running"
		$('#someDiv p.someClass').hide();
		// Better for all browsers, and Sizzle never inits.
		$('#someDiv').find('p.someClass').hide();	
源码：

		// HANDLE: $(expr, context)
		// (which is just equivalent to: $(context).find(expr)
		} else {
		   return jQuery( context ).find( selector );
		}

1. 不要滥用 $(this)  

1. 避免版本冲突  
jQuery.noConflict()：  

        var j = jQuery.noConflict();
        // Now, instead of $, we use j. 
        j('#someDiv').hide();
        // The line below will reference some other library's $ function.
        $('someDiv').style.display = 'none';
创建作用域：  

        (function($) {
            // Within this function, $ will always refer to jQuery
        })(jQuery);

1. `obj.html("");` 可以改成 `obj.empty();`,参看jquery介绍，empty做了事件解除绑定的操作，防止内存泄漏
源码：

        empty: function() {
        	var elem,
    			i = 0;
    
    		for ( ; (elem = this[i]) != null; i++ ) {
    			// Remove element nodes and prevent memory leaks
    			if ( elem.nodeType === 1 ) {
    				jQuery.cleanData( elem.getElementsByTagName("*") );
    			}
    
    			// Remove any remaining nodes
    			while ( elem.firstChild ) {
    				elem.removeChild( elem.firstChild );
    			}
    		}
    
    		return this;
	    }
1. Template 源码可以写到html中或者单独的文件里，反正移出js代码最好， html页面中可以定义成这样  

        <script id="tpl_list" type="text/template">  
            <ul>  
            <tpl for=".">  
            	<li class="book">  
        			<img alt="bookcover" src="bookcover/book1.jpg" />  
        			<div class="bookId none">{bookId}</div>  
        			<div class="bookName">{bookName}</div>  
        			<div class="authors">{authors}</div>  
        			<div class="borrowBtn">加入借阅篮</div>  
        			</li>  
        		</tpl>  
        	</ul>  
        </script>
调用方式,正常的浏览器 `var tpl = $('#tpl_list').html();` 或 `var tpl = $('#tpl_list').text();` 都可以，IE必须用 `var tpl = $('#tpl_list').innerHTML;`  

1. toggle() 没有了

1. 减少操作dom的次数  

        someDivs.each(function() {
            $('#anotherDiv')[0].innerHTML += $(this).text();
        });
一般应该这样：

        var someDivs = $('#container').find('.someDivs'),
              contents = [];        
        someDivs.each(function() {
            contents.push( this.innerHTML );
        });
        $('#anotherDiv').html( contents.join('') );
或者这样：  

        var someUls = $('#container').find('.someUls'),
            frag = document.createDocumentFragment(),
        	li;
        	
        someUls.each(function() {
        	li = document.createElement('li');
        	li.appendChild( document.createTextNode(this.innerHTML) );
        	frag.appendChild(li);
        });
        
        $('#anotherUl')[0].appendChild( frag );
1. 绑定事件的一些区别 http://www.haipi8.com/javascript/232 
1. jquery 手册 http://www.css88.com/jqapi-1.9/on/
1. 如何做到 jQuery-free？ http://www.ruanyifeng.com/blog/2013/05/jquery-free.html
1. jQuery best practices http://net.tutsplus.com/tutorials/javascript-ajax/14-helpful-jquery-tricks-notes-and-best-practices/
1. Drupal jQuery best practices https://drupal.org/node/1720586