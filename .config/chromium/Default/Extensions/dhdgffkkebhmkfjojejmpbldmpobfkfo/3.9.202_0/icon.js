(function(){var m=$.Deferred,c,k,r=function(a,e,b,g,d,f,n){var h=document.createElement("img");h.onload=function(){var a=null,a=k?k:document.createElement("canvas");a.height=b;a.width=e;k=a;c=k.getContext("2d");f&&c.scale(f,f);c.drawImage(h,g,d);h.parentNode&&h.parentNode.removeChild(h);h=null;n&&n()};h.src=a},l=function(a,e,b,g){g="rgba("+g.join(",")+", 1)";c.fillStyle=g;c.beginPath();c.arc(a,e,b,0,2*Math.PI,!0);c.fill()},p=function(a,e,b,g,d,f){null==d&&(d=!0);d?(c.fillStyle="rgba("+f.join(",")+
", 0.99)",c.fillRect(a,e,b,g)):(c.fillStyle="rgb("+f.join(",")+", 1)",c.beginPath(),c.moveTo(a,e),c.lineTo(a+b,e),c.lineTo(a+b,e+g),c.lineTo(a,e+g),c.lineTo(a,e),c.stroke())},q=function(a,e,b,c,d,f){l(a+d,e+d,d,f);l(b-d,e+d,d,f);l(a+d,c-d,d,f);l(b-d,c-d,d,f);p(a+d,e,b-a-2*d,c-e,!0,f);p(a,e+d,b-a,c-e-2*d,!0,f)};Registry.register("icon","202",{toPNG:function(){return k.toDataURL()},getDataUriFromUrl:function(a){var c=m(),b=document.createElement("img"),g=!1,d=null;document.body.appendChild(b);
var f=function(){d&&window.clearTimeout(d);g||c.reject()},d=window.setTimeout(function(){d=null;f();g=!0},5E3);b.onload=function(){d&&window.clearTimeout(d);var a=document.createElement("canvas");a.width=b.width;a.height=b.height;a.getContext("2d").drawImage(b,0,0);b.parentNode&&b.parentNode.removeChild(b);b=null;g||c.resolve(a.toDataURL())};b.onerror=f;b.src=a;return c.promise()},createIconEx:function(a){var e=m();r(chrome.extension.getURL("images/icon128.png"),140,140,6,6,1,function(){var b=116-
(10<a?14:0)-(100<a?14:0)-(1E3<a?14:0)-(1E4<a?14:0);q(b,0,140,25,4,[200,0,0]);q(b+3,3,137,22,4,[190,0,0]);b+=4;c.font="22pt Arial bold";c.fillStyle="rgba("+[240,250,240].join()+", 1)";c.fillText(a,b,22);e.resolve(k.toDataURL())});return e.promise()}})})();
