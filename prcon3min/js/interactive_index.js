A({resizer:function(n){var t,o,e=this.a(),s=e.hasClass("h"),i=e.parentNode,r=i.child("[res=before]",!1,!0),c=i.child("[res=after]",!1,!0),a=function(e){e.preventDefault(),e.stopPropagation(),event.stopImmediatePropagation()},l=function(e){requestAnimationFrame(function(){s?(r.css({height:"calc("+o.before+"% + "+(e.Y-t.Y)+"px)"}),c.css({height:"calc("+o.after+"% - "+(e.Y-t.Y)+"px)"})):(r.css({width:"calc("+o.before+"% + "+(e.X-t.X)+"px)"}),c.css({width:"calc("+o.after+"% - "+(e.X-t.X)+"px)"}))}),e.stopEvent&&e.stopEvent()},u=function(t){requestAnimationFrame(function(){var e=BUFFER.localData.UIStatics;!e[n]&&(e[n]=[]),(!e[n][0]||t)&&(e[n][0]=r.opt("style")),(!e[n][1]||t)&&(e[n][1]=c.opt("style")),r.opt("style",e[n][0]),c.opt("style",e[n][1])})};e.on("mousedown",function(e){o={before:s?r.css("height")/i.css("height")*100:r.css("width")/i.css("width")*100,after:s?c.css("height")/i.css("height")*100:c.css("width")/i.css("width")*100},t=e,document.on("mousemove",l),window.addEventListener("scroll",a),window.addEventListener("wheel",a),window.addEventListener("dragstart",a)}),window.A.on("mouseup",function(){window.removeEventListener("scroll",a),window.removeEventListener("wheel",a),window.removeEventListener("dragstart",a),document.not("mousemove",l),"html".remClass("NOSELECT"),u(!0)}),u()},selects:function(o,s){var i,r,c,a=this.a(),l=!1,u=!1,d={},h=[],p=!1,m=!1,f=function(e,t){var n,o;r=e[0],i[2]+i[0]>d.x[t]&&i[3]+i[1]>d.y[t]&&d.x[t]+d.w>i[2]&&d.y[t]+d.h>i[3]?(o=e)[2]||(o[2]=!0,o[1]&&p?r.remClass("selected"):r.addClass("selected")):!1!==(n=e)[2]&&(n[2]=!1,p?n[1]?r.addClass("selected"):r.remClass("selected"):!m&&n.remClass("selected"))},e=function(){l&&(u=l=!1,d={},h=[],c&&c.remElem(),c=!1,"html".remClass("NOSELECT"))};a.on("mousedown",function(e){l=!0},!0),a.on("select",function(e){StopEvent(e)()}),window.A.on("mousemove",function(e){var t,n;l&&(u||(u=!0,t=e,c="body".addElem("div",{class:"selector",contextfuncs:"."}),d.start=[t.X,t.Y+a.scrollTop,t.Y],d.x=[],d.y=[],d.a=a.getBoundingClientRect(),p=-1<A._DATA.BJSListeners.keyLis.pressed.indexOf(16),m=!!(o+".selecting".a()),a.child(s,!0,!0).all(function(e,t){h.push([e,e.hasClass("selected")]),i=e.getBoundingClientRect(),d.x.push(i.x),d.y.push(i.y+a.scrollTop),d.h=i.height,d.w=i.width})),(i=[(n=e).X-d.start[0],n.Y+a.scrollTop-d.start[1],d.start[0],d.start[1],d.start[2]])[0]<0&&(i[2]-=(i[0]=-i[0])-1),i[1]<0&&(i[3]-=i[1]=-i[1],i[4]-=i[1]-1),c.css({width:i[0]+"px",height:i[1]+"px",left:i[2]+"px",top:i[4]+"px"}),h.all(f))},!0),window.A.on("mouseup",e),window.A.on("contextmenu",e),window.A.on("click",function(e){var t=!1,n=".contextmenu".a();n&&e.path.all(function(e){if(t=e===n)return"break"},"break"),t||(o+":not(.selecting)>"+s).all(function(e){e.remClass("selected")})})}}),".upDownPResizer".resizer("udPRes"),".leftRightEResizer".resizer("lrERes"),function(){var t=".rightmenu .blackbtn:not(.rightshower)".a(!0);t=(t[0].css("height")+t[0].css("margin-top"))*t.length,".rightmenu".on("resize",function(e){e.height<t?".rightmenu".opt({rmhide:"."}):".rightmenu".opt({rmhide:"",show:""})})}(),".pathRow>input".on("combination","enter",function(e){UI.openDir("",e.toElement.val())},!1),window.A.on("combination","ctrl+shift+f",function(e){UI.createFile(document,BUFFER.explorer.curDir)},!1),window.A.on("combination","ctrl+shift+d",function(e){UI.createDir(document,BUFFER.explorer.curDir)},!1),window.A.on("combination","ctrl+shift+r",function(e){UI.openDir(document,BUFFER.explorer.curDir,"stay")},!1),window.A.on("combination","ctrl+shift+o",function(e){UI.dialogPanel({content:[{type:"message",text:"enter path:"},{type:"input",inpID:"path",opt:{value:"@ROOT:/",_INIT:function(e){e.selectionStart=e.value.length}}},{type:"button",btntext:"open",btnID:"open"},{type:"button",btntext:"cancel",btnID:"cancel"}],onEnter:"open",func:function(e){if("open"===e.pressed){if(""==e.values.path)return UI.errors(["no name"]);UI.setLSToPlace("body",!0);var t=PATH(e.values.path).fixUrl();PATH(t,UI.errors).common("ifEqual",{if:[{name:"isDir",args:{url:t},return:{type:"self"},equal:!0}],then:[{name:"getList",args:{url:t}}],else:[{name:"getContent",args:{url:t}}]}).wait(function(e){UI.setLSToPlace("body",!1),0!==e&&("then"===(e=e[0]).type?UI.openDir(document,t,t===PATH(BUFFER.explorer.curDir).fixUrl()?"stay":"",e.return):UI.openFile(!1,t,e.return[0].content))})}}})},!1),".rightexplorer>f-scrollplane".selects(".rightexplorer>f-scrollplane",".dirPlace");