---
layout: post
category : javascript
tags : [javascript, jquery]
title : jQuery最佳实践若干
---
{% include JB/setup %}

<ol>
<li>jQuery 几种不同的写法区别 
<pre><code>
        window.jQuery = window.$ = jQuery;
</pre></code>
</li>
<li>8000墙了jQuery CDN?
<pre><code>
        <!-- Grab Google CDN jQuery. fall back to local if necessary -->
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <script>!window.jQuery && document.write('<script src="js/jquery-1.8.3.min.js">\x3C/script>')</script>
</pre></code>
</li>
<li><code>$(document).ready(function() {...})</code> 可以改成 <code>$(function() {...})</code>   
源码:
<pre><code>
    	// HANDLE: $(function)
		// Shortcut for document ready
		if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}
</pre></code>
</li>
<li><code>$()</code>这个函数可以当成入口，执行初始化的操作，其他函数都移到外面。  
最后只剩下类似 <code>validateLogin();</code> 、 <code>$("#btn").click(check);</code> 这样的调用。  
ajax方法也类似，success()中定义的匿名方法不方便调试和修改。

</li>
<li>同一个函数里面 <code>$(this)</code> 应该缓存，避免创建多个jQuery对象  
<pre><code>
        var _this = $(this);`
</pre></code>
</li>
<li>尽量用链式写法，或者用本地变量，避免创建多个jQuery对象  
<pre><code>
        cur.removeClass("active");
        cur.next().addClass("active");
</pre></code>
可以改写成
<pre><code>
        cur.removeClass("active").next().addClass("active");
</pre></code>
</li>
<li>用代理事件避免重复绑定
<pre><code>
        // bad
        $('#container').each(function(){
            $('this').find('.item').click(function() { ... });
        })
        // better
        $('#container').delegate(".item", "click", function() { ... });
        $('#container').on("click", ".item", function() { ... });
</pre></code>
</li>
<li>动画方法想要链式执行，需要放到回调函数中
<pre><code>
        $("p").click(function(e){
          $(this).fadeOut("slow", function(){
            $(this).remove();
          });
        });
</pre></code>
</li>
<li>创建对象的时候传入属性
<pre><code>
        $('</a>', {
            id : 'someId',
            className : 'someClass',
            href : 'somePath.html'
        });
</pre></code>
</li>
<li><code>$(this).css</code> 虽然高效，但是不利于修改，应该只修改class，样式定义在CSS中


</li>
<li>只要选择器写的不是太复杂，jQuery会自动优化执行，一般不用担心性能。但是有一点是真的可以优化的。①IE6/7中分开写，会调用原生的选择器,避免调用sizzle；②多写一个id，相当于增加了context，提高查询效率）
<pre><code>
		// Fine in modern browsers, though Sizzle does begin "running"
		$('#someDiv p.someClass').hide();
		// Better for all browsers, and Sizzle never inits.
		$('#someDiv').find('p.someClass').hide();	
</pre></code>
源码：
<pre><code>
		// HANDLE: $(expr, context)
		// (which is just equivalent to: $(context).find(expr)
		} else {
		   return jQuery( context ).find( selector );
		}
</pre></code>
</li>
<li>不要滥用 <code>$(this)</code>

</li>
<li>避免版本冲突  
jQuery.noConflict()：  
<pre><code>
        var j = jQuery.noConflict();
        // Now, instead of $, we use j. 
        j('#someDiv').hide();
        // The line below will reference some other library's $ function.
        $('someDiv').style.display = 'none';
</pre></code>
创建作用域：  
<pre><code>
        (function($) {
            // Within this function, $ will always refer to jQuery
        })(jQuery);
</pre></code>
</li>
<li><code>obj.html("");</code> 可以改成 <code>obj.empty();</code>,参看jquery介绍，empty做了事件解除绑定的操作，防止内存泄漏
源码：
<pre><code>
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
</pre></code>
</li>
<li>Template 源码可以写到html中或者单独的文件里，反正移出js代码最好， html页面中可以定义成这样  
<pre><code>
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
</pre></code>
调用方式,正常的浏览器 <code>var tpl = $('#tpl_list').html();</code> 或 <code>var tpl = $('#tpl_list').text();</code> 都可以，IE必须用 <code>var tpl = $('#tpl_list').innerHTML;</code>  

</li>
<li>toggle() 没有了

</li>
<li>减少操作dom的次数  
<pre><code>
        someDivs.each(function() {
            $('#anotherDiv')[0].innerHTML += $(this).text();
        });
</pre></code>
一般应该这样：
<pre><code>
        var someDivs = $('#container').find('.someDivs'),
              contents = [];        
        someDivs.each(function() {
            contents.push( this.innerHTML );
        });
        $('#anotherDiv').html( contents.join('') );
</pre></code>
或者这样：  
<pre><code>
        var someUls = $('#container').find('.someUls'),
            frag = document.createDocumentFragment(),
        	li;
        	
        someUls.each(function() {
        	li = document.createElement('li');
        	li.appendChild( document.createTextNode(this.innerHTML) );
        	frag.appendChild(li);
        });
        
        $('#anotherUl')[0].appendChild( frag );
</pre></code>
</li>
<li>绑定事件的一些区别 http://www.haipi8.com/javascript/232 
</li>
<li>jquery 手册 http://www.css88.com/jqapi-1.9/on/
</li>
<li>如何做到 jQuery-free？ http://www.ruanyifeng.com/blog/2013/05/jquery-free.html
</li>
<li>jQuery best practices http://net.tutsplus.com/tutorials/javascript-ajax/14-helpful-jquery-tricks-notes-and-best-practices/
</li>
<li>Drupal jQuery best practices https://drupal.org/node/1720586
</ol>