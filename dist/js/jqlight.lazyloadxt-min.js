!function(t,n,e,r){"use strict";var i=t.$,o="__jqlight_data__",c=e.matches||e.matchesSelector||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector||e.webkitMatchesSelector;function u(t){if(t){for(var n=0,e=t.length;n<e;n++)this[n]=t[n];this.length=e}}function a(e){return e instanceof u?e:new u("string"==typeof e?n.querySelectorAll(e):e&&(e===t||e.nodeType)?[e]:e)}function f(t,n,e){for(var r,i,o,c,u,a,f=(n||"").match(/\S+/g)||[],s=0,h=t.length;s<h;)if(1===(r=t[s++]).nodeType){for(i=(u=r.className)?(" "+u+" ").replace(/[\t\r\n\f]/g," "):" ",c=0;o=f[c++];)i=e(i,o,i.indexOf(" "+o+" ")>=0);u!==(a=i.slice(1,-1))&&(r.className=a)}return t}u.prototype=a.fn={constructor:u,length:0},a.fn.extend=a.extend=function(){var t,n,e,r=this,i=0,o=arguments.length;for(o>1&&(r=arguments[i++]);i<o;i++)for(n in t=arguments[i])void 0!==(e=t[n])&&e!==r&&(r[n]=e);return r},a.extend({noConflict:function(){return t.$=i,a},isFunction:function(t){return"function"==typeof t},contains:function(t,n){if(n)for(;n=n.parentNode;)if(n===t)return!0;return!1},each:function(t,n){for(var e=0,r=t.length;e<r;e++)if(!1===n(e,t[e]))return!1;return!0},grep:function(t,n,e){for(var r=[],i=0,o=t.length,c=!e;i<o;i++)!n(i,t[i])!==c&&r.push(t[i]);return r},map:function(t,n){for(var e,r=0,i=t.length,o=[];r<i;r++)null!=(e=n(t[r],r))&&o.push(e);return o}}),a.fn.extend({each:function(t){return a.each(this,function(n,e){return t.call(e,n,e)}),this},map:function(t){return a(a.map(this,function(n,e){return t.call(n,e,n)}))},filter:function(t){return a(a.grep(this,function(n,e){return t.call(e,n,e)}))},ready:function(t){return/complete|loaded|interactive/.test(n.readyState)&&n.body?t():a(n).on("DOMContentLoaded",t),this},addClass:function(t){return f(this,t,function(t,n,e){return e?t:t+n+" "})},removeClass:function(t){return f(this,t,function(t,n,e){return e?t.replace(" "+n+" "," "):t})},on:function(t,n,e){return null==e&&(e=n,n=void 0),t=t.split(" "),this.each(function(r,i){var o=n?function(t,n,e){var r=e.target;for(;r&&r!==this;){if(c.call(r,t))return n.apply(r,[].concat(e,e.detail));r=r.parentElement}}.bind(i,n,e):e;a.each(t,function(t,n){n&&i.addEventListener(n,o)})})},off:function(t,n,e){return(!1===n||a.isFunction(n))&&(e=n),t=t.split(" "),this.each(function(n,r){a.each(t,function(t,n){n&&r.removeEventListener(n,e)})})},trigger:function(e,r){return this.each(function(){var i;t.CustomEvent?i=new CustomEvent(e,{bubbles:!0,cancelable:!0,detail:r}):(i=n.createEvent("CustomEvent")).initCustomEvent(e,!0,!0,r),this.dispatchEvent(i)})},data:function(t,n){if("string"==typeof t&&void 0===n){var e=this[0];return e&&e[o]?e[o][t]:void 0}return this.each(function(e,r){r[o]=r[o]||{},r[o][t]=n}),this},attr:function(t,n){return void 0===n?this.length?this[0].getAttribute(t):void 0:(this.each(function(){this.setAttribute(t,n+"")}),this)}}),t.$=a}(window,document,Element.prototype);