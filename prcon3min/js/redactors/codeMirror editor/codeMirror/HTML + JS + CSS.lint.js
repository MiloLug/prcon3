!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("htmlhint")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","htmlhint"],e):e(CodeMirror,window.HTMLHint)}(function(g,u){"use strict";var w={"tagname-lowercase":!0,"attr-lowercase":!0,"attr-value-double-quotes":!0,"doctype-first":!1,"tag-pair":!0,"spec-char-escape":!0,"id-unique":!0,"src-not-empty":!0,"attr-no-duplication":!0},e=[];if(u&&!u.verify&&(u=u.HTMLHint),u||(u=window.HTMLHint),!u)return window.console&&window.console.error("Error: window.HTMLHint not found, CodeMirror HTML mixed linting cannot run."),e;if(!window.CSSLint)return window.console&&window.console.error("Error: window.CSSLint not defined, CodeMirror HTML mixed linting cannot run."),e;if(!window.JSHINT)return window.console&&window.console.error("Error: window.JSHINT not defined, CodeMirror HTML mixed linting cannot run."),[];function l(e,n,r){for(var i=0;i<e.length;i++){var o=e[i];if(o){if(o.line<=0){window.console&&window.console.warn("Cannot display JSHint error (invalid line "+o.line+")",o);continue}var t=o.character-1,s=t+1;if(o.evidence){var l=o.evidence.substring(t).search(/.\b/);-1<l&&(s+=l)}var a=o.line-1+r-1,c={message:o.reason,severity:o.code&&o.code.startsWith("W")?"warning":"error",from:g.Pos(a,t),to:g.Pos(a,s)};n.push(c)}}}function v(e){return e.split("\n").length}g.registerHelper("lint","html",function(e,n){var r=[],i={t:e,o:0};n.indent||(n.indent=1);var o=n.css||JSON.parse(JSON.stringify(n)),t=n.js||JSON.parse(JSON.stringify(n)),s=n.html||JSON.parse(JSON.stringify(n));return t.esversion=6,function(e,n,r){for(var i=e.t,o=u.verify(i,n&&n.rules||w),t=0,s=0;s<o.length;s++){var l=o[s],a=(t=e.o[l.line]||t)+l.line-1,c=t+l.line-1,d=l.col-1,f=l.col;r.push({from:g.Pos(a,d),to:g.Pos(c,f),message:l.message,severity:l.type})}}(i,s,r),function(e,n,r){for(var i=e.t.split(/<style[\s\S]*?>|<\/style>/gi),o=0,t=1;t<i.length;t+=2){var s=v(i.slice(0,t).join()),l=CSSLint.verify(i[t],n).messages,a=null;o=e.o[s]||o;for(var c=0;c<l.length;c++){var d=o+s-1+(a=l[c]).line-1,f=o+s-1+a.line-1,u=a.col-1,w=a.col;r.push({from:g.Pos(d,u),to:g.Pos(f,w),message:a.message,severity:a.type})}}}(i,o,r),function(e,n,r){for(var i=e.t.split(/<script[\s\S]*?>|<\/script>/gi),o=1;o<i.length;o+=2)if(1<i[o].length){JSHINT(i[o],n,n.globals);var t=JSHINT.data().errors,s=v(i.slice(0,o).join());t&&l(t,r,s+e.o[s])}}(i,t,r),r})});