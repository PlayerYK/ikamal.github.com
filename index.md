---
layout: page
title: 又一个技术博客
---
{% include JB/setup %}

文章列表

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

demo

- [ascii image]({{ BASE_PATH }}/demo/ascii.html)
- [ascii image]({{ BASE_PATH }}/demo/qr.html)
