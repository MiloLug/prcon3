!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror"),require("htmlhint")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","htmlhint"],e):e(CodeMirror,window.HTMLHint)}(function(m,u){"use strict";var w={"tagname-lowercase":!0,"attr-lowercase":!0,"attr-value-double-quotes":!0,"doctype-first":!1,"tag-pair":!0,"spec-char-escape":!0,"id-unique":!0,"src-not-empty":!0,"attr-no-duplication":!0},e=[];if(u&&!u.verify&&(u=u.HTMLHint),u||(u=window.HTMLHint),!u)return window.console&&window.console.error("Error: window.HTMLHint not found, CodeMirror HTML mixed linting cannot run."),e;if(!window.CSSLint)return window.console&&window.console.error("Error: window.CSSLint not defined, CodeMirror HTML mixed linting cannot run."),e;m.registerHelper("lint","html",function(e,n){var r=[],o={t:e,o:0};n.indent||(n.indent=1);var i=n.css||JSON.parse(JSON.stringify(n));return function(e,n,r){for(var o=e.t,i=u.verify(o,n&&n.rules||w),t=0,s=0;s<i.length;s++){var l=i[s],a=(t=e.o[l.line]||t)+l.line-1,c=t+l.line-1,d=l.col-1,f=l.col;r.push({from:m.Pos(a,d),to:m.Pos(c,f),message:l.message,severity:l.type})}}(o,n.html||JSON.parse(JSON.stringify(n)),r),function(e,n,r){for(var o=e.t.split(/<style[\s\S]*?>|<\/style>/gi),i=0,t=1;t<o.length;t+=2){var s=o.slice(0,t).join().split("\n").length,l=CSSLint.verify(o[t],n).messages,a=null;i=e.o[s]||i;for(var c=0;c<l.length;c++){var d=i+s-1+(a=l[c]).line-1,f=i+s-1+a.line-1,u=a.col-1,w=a.col;r.push({from:m.Pos(d,u),to:m.Pos(f,w),message:a.message,severity:a.type})}}}(o,i,r),r})});