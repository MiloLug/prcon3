!function(m,o,i){"use strict";o.A.on("combination","ctrl+r",function(e){UI.dialogPanel({content:[{type:"message",text:"close page?".tr},{type:"button",btnID:"y",btntext:"yes".tr},{type:"button",btnID:"n",btntext:"no".tr}],onEnter:"y",func:function(e){"y"===e.pressed&&(o.allowUnload=!0,o.location.reload())}})},!1),o.UI.Ainit({langSet:function(){var e=[{type:"message",text:"lan reload".tr},{type:"button",btntext:"cancel".tr,btnID:"cl"}];m.toArray(LANG_LIST,!0).all(function(t){"@default@"!==t[0]&&e.push({type:"checkbox",chctext:t[0],chcID:t[0],opt:{checked:CUR_LANG===t[1]?".":"",_INIT:function(e){e.on("change",function(){if(!e.checked)return e.checked=!0;localStorage.setItem(PRCON_LANGUAGE_SAVE_NAME,t[1]),o.allowUnload=!0,o.location.reload()})}}})}),UI.dialogPanel({content:e})},redactorSet:function(){var e=[{type:"message",text:"red reload".tr},{type:"button",btntext:"cancel".tr,btnID:"cl"}];m.toArray(REDACTORS_LIST,!0).all(function(t){"@default@"!==t[0]&&e.push({type:"checkbox",chctext:t[0],chcID:t[0],opt:{checked:CUR_REDACTOR===t[1]?".":"",_INIT:function(e){e.on("change",function(){if(!e.checked)return e.checked=!0;localStorage.setItem(PRCON_REDACTOR_CURRENT_NAME,t[1]),o.allowUnload=!0,o.location.reload()})}}})}),UI.dialogPanel({content:e})},closeAll:function(){var e=function(e){e.allowUnload=!0,e.close()};m.toArray(BUFFER.windows.viewInReload).all(e),m.toArray(BUFFER.windows.redactors).all(e),".srcplace".html="",BUFFERToLocal(),BUFFER=new N_BUFFER,localToBUFFER()},openLogin:function(){UI.setSrcToPlace("login",!0),".back[act=loginLocal]".errored().remElem(),".back[act=loginFtp]".errored().remElem()},openLoginFtp:function(){UI.setSrcToPlace("loginFtp",!0),".back[act=loginLocal]".errored().remElem(),".back[act=login]".errored().remElem()},openLoginLocal:function(){var n=UI.setSrcToPlace("loginLocal",!0).child(".backcontent>f-scrollplane");".back[act=loginLocal] f-scrollplane".selects(".back[act=loginLocal] f-scrollplane",".forsel"),".back[act=login]".errored().remElem(),".back[act=loginFtp]".errored().remElem(),BUFFER.localData.accounts.name.all(function(e,t){n.addElem("button",{title:BUFFER.localData.accounts.ftp[t]?"PHP: "+BUFFER.localData.accounts.urlPhp[t]+"\nFTP url: "+BUFFER.localData.accounts.urlFtp[t]+"\nFTP login: "+BUFFER.localData.accounts.login[t]:BUFFER.localData.accounts.login[t],funcs:"sendLoginLocal",class:"cls item forsel",contextfuncs:"loginLocalListItem",name:e,_TXT:e})})},openedFiles:function(e,n){var o=UI.setSrcToPlace("openedFilesList",!0).child(".backcontent>f-scrollplane");n=PATH(n||e.attrFromPath("_url")).fixUrl(),Object.keys(BUFFER.redactors).all(function(e,t){o.addElem("button",{funcs:"toTopFileRedactor,easyCancel",class:"cls item",emhover:n===e?".":"",_url:e,_TXT:e})})},openDownloads:function(e){var t=UI.setSrcToPlace("downloads",!0).child(".backcontent>f-scrollplane");for(var n in BUFFER.downloads){var o=m.createElem("div",{_TXT:UI.getAct(BUFFER.downloads[n].up?"uploadsFileSrc":"downloadsFileSrc")}).children[0].pasteIn(t);o.opt({_url:n}),o.child(".name").html=BUFFER.downloads[n].up?BUFFER.downloads[n].name:PATH(n).name,BUFFER.downloads[n].inDownloads=o,BUFFER.downloads[n].inDownSpeed=o.child(".speed"),BUFFER.downloads[n].inDownIng=o.child(".downloading"),BUFFER.downloads[n].inDownBar=o.child(".bar")}},toTopFileRedactor:function(e,t){t=PATH(t||e.attrFromPath("_url")).fixUrl(),UI.toTopLayer(BUFFER.redactors[t].a().parent(function(e){return"back"===e.className})||BUFFER.redactors[t])},openSettings:function(){var e=UI.setSrcToPlace("settings",!0).child(".backcontent>f-scrollplane"),t=[],n={};for(var o in SETTINGS_DECLARE.all(function(e){n[e.group]||(n[e.group]=[]),n[e.group].push(e)}),n){var a={div:{class:"group",group:o,_DOM:[{div:{class:"groupname center",_TXT:o}}]}};n[o].all(function(n){var e={div:{title:n.realtime?"":"need to reload".tr,class:"blackbtn sett_cont",_DOM:[{div:{class:"sett_info",_TXT:n.info+(n.realtime?"":"<br><text class='ntr'>[&#8635;]</text>")}}]}},o=n.param?objWalk(BUFFER.localData.settings,n.param.iteration?["I"]:[]):{};switch(n.type){case"checkbox":e.div._DOM.unshift("[act=dialogInputSrc] .chbstyle".copy(!0).child("input").opt({checked:o[n.param.name]?".":"",_LIS:[{change:function(e){o[n.param.name]=m.eGetElem(e).checked,n.realtime&&applySettings()}}],funcs:n.funcs?n.funcs:""}).parentNode.child("text").html(n.chctext).parentNode);break;case"button":e.div._DOM.unshift({button:{class:"blackbtn cls",_TXT:n.btntext,funcs:n.funcs?n.funcs:""}});break;case"input":var r=o[n.param.name]||"";e.div._DOM.unshift({input:{class:"inputstyle cls",placeholder:n.inptext,type:"text",_LIS:[{change:function(e){var t=m.eGetElem(e).val();if("number"===n.inptype&&!m.isNumeric(t))return m.eGetElem(e).val=""==t?0:r;r=t,o[n.param.name]=t,n.realtime&&applySettings()}}],funcs:n.funcs?n.funcs:"",_AFTER:{_VAL:o[n.param.name]||""}}});break;case"select":e.div._DOM.unshift({select:{class:"selstyle cls",_DOM:n.options.all(function(e){return{option:{_TXT:e}}}).return,_LIS:[{change:function(e){o[n.param.name]=m.eGetElem(e)[n.compareBy],n.realtime&&applySettings()}}],funcs:n.funcs?n.funcs:"",_AFTER:{_INIT:function(e){e[n.compareBy]=o[n.param.name]||""}}}})}a.div._DOM.push(e)}),t.push(a)}e.DOMTree(t)},deleteAccs:function(e,l){UI.dialogPanel({content:[{type:"message",text:"delete it?".tr},{type:"message",text:"Accounts".tr+":\n"+l.join("\n")},{type:"button",btntext:"yes".tr,btnID:"yes"},{type:"button",btntext:"no".tr,btnID:"no"}],onEnter:"yes",func:function(e){if("yes"===e.pressed){var t,n,o=BUFFER.localData.accounts,r=".back[act=loginLocal]".a(),a={};r&&r.child(".item.forsel",!0).all(function(e){a[e.opt("name")]=e}),l.all(function(e){t=o.name.indexOf(e),n=t+1,t<0||e===ACCOUNT.name||(o.name.splice(t,n),o.login.splice(t,n),o.password.splice(t,n),o.ftp.splice(t,n),o.urlPhp.splice(t,n),o.urlFtp.splice(t,n),o.portFtp.splice(t,n),delete o.data.explorer[e],r&&a[e].remElem())}),BUFFERToLocal()}}})},resetSettings:function(){BUFFER.localData.settings=new N_SETTINGS,BUFFERToLocal(),applySettings(),UI.dialogPanel({content:[{type:"message",text:"close page?".tr},{type:"button",btnID:"ok",btntext:"yes".tr},{type:"button",btnID:"n",btntext:"no".tr}],onEnter:"ok",func:function(e){"ok"===e.pressed&&(o.allowUnload=!0,o.location.reload())}})},showResizeButton:function(){".middlebtn.hide".a()?".middlebtn".all(function(e){e.remClass("hide")}):".middlebtn".all(function(e){e.addClass("hide")})},toggleRightMenu:function(){".rightmenu[show]".a()?".rightmenu".opt({show:""}):".rightmenu".opt({show:"."})},generateTree:function(e,t){return m.start(function(n){var o,r=PATH(t).arrUrl(),a="",l="",i=BUFFER.explorer.tree,s=m.start(),c=function(e,t){void 0!==(l=r.shift())?i.hasOwnProperty(l)&&i[l].opened?(a+=l+"/",i=i[l].list,s=s.wait(c,!0),t.value=1):PATH(a+l,UI.errors).common("getList").wait(function(e){0!==e?(e=e[0],o={},e.all(function(e){o[e.name]={type:e.type,list:{},opened:!1,parent:l,url:e.url}}),i[l]={type:"dir",list:o,opened:!0,parent:null,url:a+l},a+=l+"/",i=i[l].list,s=s.wait(c,!0),t.value=1):n.value=0}):n.value=1};s.wait(c,!0)},!0)},parseTree:function(e,t,n){var a=void 0===t?BUFFER.explorer.tree:objWalk(BUFFER.explorer.tree,PATH(t).arrUrl(),["list"]);(n||".leftexplorer>f-scrollplane").html="",(n||".leftexplorer>f-scrollplane").DOMTree(function e(t){var n=[];for(var o in t=t||a)if("."!==o&&".."!==o){var r=[{div:{class:"typeimg",_TXT:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 64" width="64" height="64"><use xlink:href="#SVG'+t[o].type+'Icon" x="0" y="0"/></svg><div></div>'}},{div:{class:"rowtext txtnowrap",funcs:"dir"===t[o].type?"openDir":"openFile",_TXT:o}}];"dir"===t[o].type?r.unshift({div:{class:"dirarr showarrow",funcs:"reloadTree",_TXT:"&#9013;"}}):r.unshift({div:{class:"dirarr buffer NOSELECT",_TXT:"&#9013;"}}),n.push({div:{class:"tree cls "+t[o].type,_type:t[o].type,_url:t[o].url,opened:t[o].opened,contextfuncs:"dirFileMenu, treeMenu",bubblecontext:".",mergecontext:".",_DOM:r}}),t[o].opened&&n.push({div:{class:"tree offset",url:t[o].url,_DOM:e(t[o].list)}})}return n}())},reloadTree:function(a,l,i){return BUFFER.loadprocess.reloadTree=BUFFER.loadprocess.reloadTree.wait(function(e,t){l=l||a.attrFromPath("_url");var n=a.errored().parent(),o=n.errored().opt("opened");if("true"===o){var r=objWalk(BUFFER.explorer.tree,PATH(l).arrUrl(),["list"],!0);return r.list={},r.opened=!1,n.nextSibling.remElem(),n.opt("opened","false"),void(t.value=1)}"false"===o&&(i=i||n.parentNode.addElem({elem:"div",pos:n.nextSibling||void 0},{class:"tree offset",url:l})),UI.setLSToPlace(n||".leftexplorer",!0),UI.generateTree(a,l).wait(function(e){UI.setLSToPlace(n||".leftexplorer",!1),(t.value=1)===e&&(UI.parseTree(a,l,i),n.errored().opt("opened","true"))})},!0)},openDir:function(a,l,i,s){return BUFFER.loadprocess.openDir.XHR&&BUFFER.loadprocess.openDir.XHR.abort(),BUFFER.loadprocess.openDir=BUFFER.loadprocess.openDir.wait(function(e,t){var n=".rightexplorer>f-scrollplane";l=PATH(l||!!a&&a.attrFromPath("_url")||BUFFER.explorer.curDir).fixUrl(),UI.setLSToPlace(".rightexplorer",!0);var o=PATH(l,UI.errors),r=s?m.start(function(){return s}):o.common("getList",{getSize:!0});!s&&pendTo(function(){return r.XHR}).wait(function(e){t.XHR=e}),r.wait(function(e){if(UI.setLSToPlace(".rightexplorer",!1),0===e)return UI.setPathRow(BUFFER.explorer.curDir),void(t.value=0);e=e[0],"back"===i?UI.addBack(BUFFER.explorer.curDir):"forward"===i?UI.addForward(BUFFER.explorer.curDir):"stay"!==i&&(UI.addBack(BUFFER.explorer.curDir),BUFFER.explorer.forward=[]),BUFFER.explorer.curDir=UI.setPathRow(l),n.html="",e.all(function(e){if("."===e.name||".."===e.name)return"continue";n.addElem("div",{class:"dirPlace",_type:e.type,_url:e.url,funcs:"selectIfSelecting,"+("dir"===e.type?"openDir":"openFile"),contextfuncs:"dirFileMenu",bubblecontext:"."}).DOMTree([{div:{class:"typeimg",_TXT:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 64" width="64" height="64"><use xlink:href="#SVG'+e.type+'Icon" x="14.0625%" y="0"/></svg><div></div>'}},{div:{class:"rowtext",_TXT:e.name}},{div:{class:"closer",title:"dir"===e.type?"":formatBytes(e.size||0)}},"dir"===e.type?{}:{div:{class:"size center",_TXT:formatBytes(e.size||0)}}])},"break","continue"),n.opt("_url",l),t.value=1})},!0)},fileEditor:function(e,t,n){if(FILE_REDACTOR){var o=FILE_REDACTOR;return n&&(o=o.windowed),o[e].apply(o,t)}return UI.errors(["no editor"]),!1},closeRedactor:function(t,n){(n=PATH(n||t.attrFromPath("_url")).fixUrl())in BUFFER.redactors&&UI.dialogPanel({content:[{type:"message",text:"close file?".tr+"<br>"+n},{type:"button",btntext:"yes".tr,btnID:"y"},{type:"button",btntext:"no".tr,btnID:"n"}],onEnter:"y",onEsc:"n",func:function(e){"y"===e.pressed&&UI.fileEditor("close",[t,n])}})},openFile:function(e,t,n){var o=!BUFFER.localData.settings.defaultFileEditorType;UI.fileEditor("edit",[e,t,n],o)},saveFile:function(t,n){(n=PATH(n||t.attrFromPath("_url")).fixUrl())&&UI.dialogPanel({content:[{type:"message",text:"save file?".tr+"<br>"+n},{type:"button",btntext:"yes".tr,btnID:"y"},{type:"button",btntext:"no".tr,btnID:"n"}],onEnter:"y",onEsc:"n",func:function(e){"y"===e.pressed&&UI.fileEditor("save",[t,n])}})},windowedRedactor:function(e,t){UI.fileEditor("edit",[e,t],!0)},selectIfSelecting:function(e){if(".rightexplorer>f-scrollplane.selecting".a())return e.toggle("selected",""),"break"},toggleDirSelecting:function(){2===".rightexplorer>f-scrollplane".toggle("selecting","")&&UI.clearDirSelecting()},clearDirSelecting:function(){".rightexplorer>f-scrollplane .selected".all(function(e){e.remClass("selected")})},setPathRow:function(t){return".pathRow>input".val=t,BUFFER.loadprocess.setHash=BUFFER.loadprocess.setHash.wait(function(e){return o.location.hash=t,"setJS"}),t},addBack:function(e){return BUFFER.explorer.back.unshift(e),e},addForward:function(e){return BUFFER.explorer.forward.unshift(e),e},goBack:function(e){BUFFER.explorer.back.length<1||UI.openDir(e,BUFFER.explorer.back.shift(),"forward")},goForward:function(e){BUFFER.explorer.forward.length<1||UI.openDir(e,BUFFER.explorer.forward.shift(),"back")},sendLoginLocal:function(e,t){t=t||e.html();var n=getAccRow(t);n.index<0&&(BUFFERToLocal(),localToBUFFER(),UI.openLoginLocal(),(n=getAccRow(t)).index<0)?UI.errors(["no acc"]):(n=n.row,UI.setLSToPlace("body",!0),m.ajax({url:n.ftp?n.urlPhp:n.login,type:"POST",async:!0,dataType:"form",data:[{name:"query",value:m.json({acc:n,funcs:[{name:"login"}]})}],success:function(e){e=m.json(e),UI.setLSToPlace("body",!1),0<e.error.length?UI.errors(e.error):setAccount(n)},resCode:function(e){404===e&&(UI.setLSToPlace("body",!1),UI.errors(["not main"]))},error:function(){UI.setLSToPlace("body",!1),UI.errors(["net err"])}}))},sendLogin:function(e,s,o,r,c,d,u){o=o||".back .login".val(),r=r||".back .pass".val(),s&&(c=c||".back .urlPhp".val(),d=d||".back .urlFtp".val(),u=m.isEmpty(u)?21:parseFloat(u)),UI.setLSToPlace("body",!0),m.ajax({url:s?c:o,type:"POST",async:!0,dataType:"form",data:[{name:"query",value:m.json({acc:{ftp:s,password:r,login:o,urlFtp:d,portFtp:u},funcs:[{name:"login"}]})}],success:function(e){if(e=m.json(e),UI.setLSToPlace("body",!1),0<e.error.length)UI.errors(e.error);else{var a=BUFFER.localData.accounts,n=a.login.indexOf(o),l=function(t){o!==ACCOUNT.login||r!==ACCOUNT.password||s&&(d!==ACCOUNT.urlFtp||c!==ACCOUNT.urlPhp)?setAccount(t||"",s,o,r,c,d,u):UI.dialogPanel({content:[{type:"message",text:"already logged".tr}],func:function(e){"ok"===e.pressed&&setAccount(t||"",s,o,r,c,d,u)}})},i={newAcc:function(o,r){UI.dialogPanel({content:[{type:"message",text:"account to local?".tr},{type:"input",inpID:"name",opt:{placeholder:"NAME"}},{type:"button",btnID:"ok",btntext:"ok".tr},{type:"button",btnID:"cancel",btntext:"cancel".tr}],onEnter:"ok",onEsc:"cancel",func:function(e){if("ok"===e.pressed){var t=e.values.name,n=a.name.indexOf(t);-1<n?i.upAcc(o,r,n):(a.name.push(t),a.login.push(o),a.ftp.push(s),a.urlFtp.push(d),a.urlPhp.push(c),a.portFtp.push(u),a.password.push(r),BUFFERToLocal(),l(t))}else l(t)}})},upAcc:function(t,n,o){UI.dialogPanel({content:[{type:"message",text:"Account exists".tr+"\n("+"name".tr+":"+a.name[o]+")"},{type:"button",btnID:"ok",btntext:"ok".tr},{type:"button",btnID:"no",btntext:"no".tr},{type:"button",btnID:"new",btntext:"new store".tr}],func:function(e){"ok"===e.pressed&&(a.password[o]=n,a.ftp[o]=s,a.urlFtp[o]=d,a.urlPhp[o]=c,a.portFtp[o]=u,a.login[o]=t,BUFFERToLocal()),"new"===e.pressed&&i.newAcc(t,n),("ok"===e.pressed||"no"===e.pressed)&&l(a.name[o])}})}};s&&a.urlFtp.all(function(e,t){if(e===d&&a.login[t]===o&&a.urlPhp[t]===c)return n=t,"break"},"break"),BUFFER.localData.settings.showAccountSaveMessage?n<0?i.newAcc(o,r):i.upAcc(o,r,n):l()}},resCode:function(e){404===e&&(UI.setLSToPlace("body",!1),UI.errors(["not main"]))},error:function(){UI.setLSToPlace("body",!1),UI.errors(["net err"])}})},sendLoginFtp:function(e){UI.sendLogin(e,!0)},clearLocal:function(){UI.dialogPanel({content:[{type:"message",text:"delete all data?".tr},{type:"button",btnID:"ok",btntext:"ok".tr},{type:"button",btnID:"cancel",btntext:"cancel".tr}],func:function(e){"ok"===e.pressed&&clearLocal()}})},reloadListsChanges:function(n,o,e){var r,a,l;(o=PATH(o).fixUrl(),PATH(BUFFER.explorer.curDir).fixUrl()===o&&"tree"!==e&&UI.openDir(i,o,"stay"),"dir"!==e)&&(".tree.cls.dir[opened=true]".all(function(e){if(PATH(e.opt("_url")).fixUrl()===o)return a=(r=e).nextElementSibling,"break"},"break"),r&&(BUFFER.loadprocess.reloadTree=BUFFER.loadprocess.reloadTree.wait(function(e,t){(l=objWalk(BUFFER.explorer.tree,PATH(o).arrUrl(),["list"],!0)).list={},l.opened=!1,UI.setLSToPlace(r,!0),UI.generateTree(n,o).wait(function(e){UI.setLSToPlace(r,!1),(t.value=1)===e&&UI.parseTree(n,o,a)})},!0)))},startLoadWaiting:function(o,r){r=PATH(r).fixUrl();var e=m.start(function(e){var t,n;return".tree.cls.dir[opened=true]".all(function(e){if(PATH(e.opt("_url")).fixUrl()===r)return n=(t=e).nextElementSibling,"break"},"break"),o(e,function(e){return t&&UI.setLSToPlace(t,e),t&&UI.setLSToPlace(n,e),UI.setLSToPlace(".rightexplorer",e),e})},!0);BUFFER.loadprocess.openDir=BUFFER.loadprocess.openDir.wait(function(){return e}),BUFFER.loadprocess.reloadTree=BUFFER.loadprocess.reloadTree.wait(function(){return e})},treeParentOfNotExists:function(e,t){for(var n,o=PATH(t).arrUrl(),r=o.pop();0<o.length;){if((n=objWalk(BUFFER.explorer.tree,o,["list"],!0))&&n.opened&&!n.list[r])return PATH(o).fixUrl();r=o.pop()}return!1},curDirParentOfNotExists:function(e,t){for(var n=PATH(t).arrUrl(),o=BUFFER.explorer.curDir,r=n.pop(),a=".rightexplorer .dirPlace".a(!0).all(function(e){return PATH(e.opt("_url")).name}).return;0<n.length;){if(n.join("/")+"/"===o&&a.indexOf(r)<0)return o;r=n.pop()}return!1},deleteDirFile:function(n,t,e,o){UI.dialogPanel({content:[{type:"message",text:"delete it?".tr},{type:"message",text:t},{type:"button",btntext:"yes".tr,btnID:"yes"},{type:"button",btntext:"no".tr,btnID:"no"}],onEnter:"yes",func:function(e){"yes"===e.pressed&&(t=t||n.attrFromPath("_url"),o=PATH(t,UI.errors),UI.startLoadWaiting(function(e,t){t(!0),o.common("delete").wait(function(){t(!1),e.value=1,UI.reloadListsChanges(n,o.parentDir)})},o.parentDir))}})},extractZip:function(l,e,t){e=e||l.attrFromPath("_url"),t=PATH(e,UI.errors),UI.dialogPanel({content:[{type:"message",text:"extract to".tr+":"},{type:"input",inpID:"dest",opt:{_VAL:t.parentDir}},{type:"button",btntext:"ok".tr,btnID:"ok"},{type:"button",btntext:"cancel".tr,btnID:"cl"}],onEnter:"ok",func:function(a){"ok"===a.pressed&&a.values.dest&&UI.startLoadWaiting(function(o,r){r(!0),t.common("extractZip",{destinationDir:a.values.dest}).wait(function(e,t){r(!1),o.value=1;var n=UI.curDirParentOfNotExists(l,a.values.dest);n&&UI.reloadListsChanges(l,n),(n=UI.treeParentOfNotExists(l,a.values.dest))&&UI.reloadListsChanges(l,n),UI.reloadListsChanges(l,a.values.dest)})},PATH(a.values.dest).parentDir)}})},deleteAllList:function(a,t){UI.dialogPanel({content:[{type:"message",text:"delete it?".tr},{type:"message",text:t.join("<br>")},{type:"button",btntext:"yes".tr,btnID:"yes"},{type:"button",btntext:"no".tr,btnID:"no"}],onEnter:"yes",func:function(e){if("yes"===e.pressed){var r=PATH(t[0]).parentDir;UI.startLoadWaiting(function(n,o){o(!0),PATH(r,UI.errors).common("deleteList",{list:t}).wait(function(e,t){o(!1),n.value=1,UI.reloadListsChanges(a,r)})},r)}}})},createZip:function(o,t,r){UI.dialogPanel({content:[{type:"message",text:"enter archive".tr+":"},{type:"input",inpID:"name",opt:{placeholder:"my.zip"}},{type:"button",btntext:"create".tr,btnID:"create"},{type:"button",btntext:"cancel".tr,btnID:"cancel"}],onEnter:"create",func:function(e){if("create"===e.pressed){if(""==e.values.name)return UI.errors(["no name"]);if(!((r=r||[]).length<1)){t=t||o.attrFromPath("_url");var n=PATH(t,UI.errors);UI.setLSToPlace("body",!0),n.common("createZip",{name:e.values.name,list:r}).wait(function(e,t){if(UI.setLSToPlace("body",!1),"requery"===(e=e[0]).type&&"obj exists"===e.info||"error"===e.type)return UI.errors([e.info]);UI.reloadListsChanges(o,n.url)})}}}})},rename:function(r,t,a){UI.dialogPanel({content:[{type:"message",text:"enter rename".tr+":<br><pre>function (oldName,oldExtension,nameIndex){</pre>"},{type:"message",text:"<pre>var newName;</pre>",opt:{_CSS:JS_STYLE.renameDialogCodeTab}},{type:"textarea",inpID:"name",opt:{placeholder:"new name",_CSS:JS_STYLE.renameDialogTextArea,_VAL:a.length<2?a[0]:"",_LIS:[{combination:["tab",function(e){i.execCommand("insertText",!1,"\t")},!1]}]}},{type:"message",text:"<pre>return newName;</pre>",opt:{_CSS:JS_STYLE.renameDialogCodeTab}},{type:"message",text:"<pre>}</pre>"},{type:"checkbox",chctext:"this is JS".tr,chcID:"isjs"},{type:"checkbox",chctext:"no ext rename".tr,chcID:"noext"},{type:"message",text:"no ext rename info".tr},{type:"button",btntext:"rename".tr,btnID:"rename"},{type:"button",btntext:"cancel".tr,btnID:"cancel"}],onEnter:"rename",func:function(n){if("rename"===n.pressed){if(""==n.values.name)return UI.errors(["no name"]);if(!a||a.length<1)return UI.errors(["no processed"]);var e={oldNames:a,newNames:a.all(function(e,t){return e=PATH(e).divNameExt(),e=n.checked.isjs?new String(Function("oldName,oldExtension,nameIndex","var newName;\n\r"+n.values.name+";\n\r return newName;")(e[0],e[1]||"",t)):new String(n.values.name)}).return,staticExtension:n.checked.noext};t=t||PATH(r.attrFromPath("_url")).parentDir;var o=PATH(t,UI.errors);UI.setLSToPlace("body",!0),o.common("rename",e).wait(function(e,t){if(UI.setLSToPlace("body",!1),"requery"===(e=e[0]).type&&"obj exists"===e.info||"error"===e.type)return UI.errors([e.info]);UI.reloadListsChanges(r,o.url),UI.dialogPanel({content:[{type:"message",text:"renamed".tr+":<br>"+e.renames.all(function(e){return e[0]+" => "+e[1]}).return.join("<br>")},{type:"button",btntext:"ok".tr,btnID:"ok"}],onEnter:"ok"})})}}})},createDir:function(o,t){UI.dialogPanel({content:[{type:"message",text:"Enter dir name".tr+":"},{type:"input",inpID:"name",opt:{placeholder:"new dir"}},{type:"button",btntext:"create".tr,btnID:"create"},{type:"button",btntext:"cancel".tr,btnID:"cancel"}],onEnter:"create",func:function(e){if("create"===e.pressed){if(""==e.values.name)return UI.errors(["no name"]);t=t||o.attrFromPath("_url");var n=PATH(t,UI.errors);UI.setLSToPlace("body",!0),n.common("create",{name:e.values.name,type:"dir"}).wait(function(e,t){if(UI.setLSToPlace("body",!1),"requery"===(e=e[0]).type&&"obj exists"===e.info||"error"===e.type)return UI.errors([e.info]);UI.reloadListsChanges(o,n.url)})}}})},createFile:function(o,t){UI.dialogPanel({content:[{type:"message",text:"Enter file name".tr+":"},{type:"input",inpID:"name",opt:{placeholder:"new file"}},{type:"button",btntext:"create".tr,btnID:"create"},{type:"button",btntext:"cancel".tr,btnID:"cancel"}],onEnter:"create",func:function(e){if("create"===e.pressed){if(""==e.values.name)return UI.errors(["no name"]);t=t||o.attrFromPath("_url");var n=PATH(t,UI.errors);UI.setLSToPlace("body",!0),n.common("create",{name:e.values.name,type:"file"}).wait(function(e,t){if(UI.setLSToPlace("body",!1),"requery"===(e=e[0]).type&&"obj exists"===e.info||"error"===e.type)return UI.errors([e.info]);UI.reloadListsChanges(o,n.url)})}}})},stopLoading:function(e,t){t=PATH(t||e.attrFromPath("_url")).fixUrl(),BUFFER.downloads[t]&&BUFFER.downloads[t].xhr.wait(function(e){e.x.XHR.abort()})},stopAllLoads:function(e){for(var t in BUFFER.downloads)BUFFER.downloads[t].xhr.wait(function(e){e.x.XHR.abort()})},paste:function(a,l){l&&l.list.length&&(UI.setLSToPlace(".rightexplorer",!0),PATH(l.destinationDir).common("copyListTo",l).wait(function(e,t){if(UI.setLSToPlace(".rightexplorer",!1),"ok"===(e=e[0]).type){var n=[],o=[];!function t(e){e.all(function(e){"ok"!==e.type?n.push(e.url):(o.push(e.url),t(e.includes))})}(e.objList),n.length&&UI.dialogPanel({content:[{type:"message",text:"not copied".tr+":<br>"+n.join("<br>")},{type:"button",btntext:"ok".tr,btnID:"ok"}]});var r=[];l.deleteSource&&l.list.all(function(e){e=PATH(e).parentDir,-1<r.indexOf(e)||(r.push(e),o.length&&UI.reloadListsChanges(a,e))}),o.length&&UI.reloadListsChanges(a,l.destinationDir)}}))},getLocalData:function(e){BUFFERToLocal();new Date;var t=m.json({language:localStorage.getItem(PRCON_LANGUAGE_SAVE_NAME),redactor:localStorage.getItem(PRCON_REDACTOR_CURRENT_NAME),storage:m.json(localStorage.getItem(PRCON_LOCAL_STORAGE_NAME))});getFile(t,"prcon3_local_storage_"+fullDate()+".json","application/json")},setLocalData:function(e){UI.dialogPanel({content:[{type:"message",text:"please, select .json file".tr+":"},{type:"uploader",accept:".json",upltext:"...",uplID:"file"},{type:"button",btntext:"ok".tr,btnID:"ok"},{type:"button",btntext:"cancel".tr,btnID:"cl"}],onEnter:"ok",func:function(e){if("ok"===e.pressed&&1===e.fileLists.file.length){var t=new FileReader;t.addEventListener("loadend",function(){var e=t.result;return e?"String"==(e=m.json(e)).__typeOfThis__?UI.errors(["file cont is dep code"]):(e.language&&"String"==e.language.__typeOfThis__&&localStorage.setItem(PRCON_LANGUAGE_SAVE_NAME,e.language),e.redactor&&"String"==e.redactor.__typeOfThis__&&localStorage.setItem(PRCON_REDACTOR_CURRENT_NAME,e.redactor),e.storage&&"Object"==e.storage.__typeOfThis__&&(o.BUFFERToLocal=function(){},e.storage.version=BUFFER.localData.version,localStorage.removeItem(PRCON_LOCAL_STORAGE_NAME),localStorage.setItem(PRCON_LOCAL_STORAGE_NAME,m.json(e.storage)),localToBUFFER()),void((e.language||e.redactor||e.storage)&&(o.allowUnload=!0,o.location.reload()))):UI.errors(["empty file"])}),t.readAsText(e.fileLists.file[0])}}})},download:function(t,e,p){var f=[];e.all(function(e){var r,a,l,i,t=PATH(e,UI.errors),n=t.fixUrl(),s=[-1,-1],c=0;if(BUFFER.downloads[n]){if(!p)return void f.push(n);BUFFER.downloads[n].download.XHR.abort()}BUFFER.downloads[n]=r={type:m.start(function(){},!0),name:t.name,delete:m.start(function(){},!0),speed:m.start(function(){},!0),downloaded:m.start(function(){},!0),xhr:m.start(function(){},!0)},r.delete.wait(function(){var e=r.inDownloads;e&&setTimeout(function(){e.remElem()},1e3),r.inDownloads=void 0,delete BUFFER.downloads[n]}),r.type.progress(function(e){r.inDownIng&&r.inDownIng.html(e.tr),"complete"===e&&(r.inDownSpeed&&r.inDownSpeed.html(formatBytes(0)),r.inDownBar&&r.inDownBar.css("width","100%"),r.delete.value=!0),"stop"!==e&&"error"!==e||(r.inDownSpeed&&r.inDownSpeed.html(formatBytes(0)),r.delete.value=!0)}),r.type.progressValue="getting size",r.size=t.common("sizeOf").wait(function(e){return r.type.progressValue=0===e?"error":"downloading",[4*e[0]/3,formatBytes(4*e[0]/3)]}),r.download=r.size.wait(function(){return(r.xhr.value={x:t.common("getBase64")}).x}),r.download.wait(function(e){if(r.type.value=r.speed.value=r.downloaded.value=!0,0===e)return r.type.progressValue="error",0;e=e[0],getFile(b64toBlob(e.content,e.mime),r.name),r.type.progressValue="complete"}),r.download.progress(function(o){if("abort"===o.type)return r.download.value=0;(a=r.size.wait(function(e){return e})).wait(function(e){if("down"===o.type&&o.data.loaded<=e[0]){if(r.downloaded.progressValue=o.data.loaded,-1<s[0]){var t=[s[0],s[1]],n=500<a.time-c;l=(o.data.loaded-t[1])/(a.time-t[0])*1e3,100<(i=o.data.loaded/e[0]*100)&&(i=100),n&&(c=a.time),n&&(r.inDownIng&&r.inDownIng.html(formatBytes(o.data.loaded)+"/"+e[1]),r.inDownSpeed&&r.inDownSpeed.html(formatBytes(l)),r.inDownBar&&r.inDownBar.css("width",i+"%")),r.speed.progressValue=l}s[0]=a.time,s[1]=o.data.loaded}}).error(console.error)}),BUFFER.loadprocess.reloadDownloads.progressValue=!0;var o=".srcplace>[act=downloads]".a();if(o){var d=o.child(".backcontent>f-scrollplane"),u=m.createElem("div",{_TXT:UI.getAct("downloadsFileSrc")}).children[0].pasteIn(d);u.opt({_url:n}),u.child(".name").html=t.name,r.inDownloads=u,r.inDownSpeed=u.child(".speed"),r.inDownIng=u.child(".downloading"),r.inDownBar=u.child(".bar")}}),f.length&&UI.dialogPanel({content:[{type:"message",text:"already in load".tr+"\n"+f.join("\n")},{type:"button",btntext:"reload".tr,btnID:"rn"},{type:"button",btntext:"close".tr,btnID:"cl"}],onEnter:"rn",func:function(e){"rn"===e.pressed&&UI.download(t,f,p)}})},upload:function(p,e,f,t){e.all(function(e){var r,a,l,i,t=PATH(f,UI.errors),n=t.fixUrl(),s=[-1,-1],c=0;BUFFER.downloads[n]&&function e(t){if(BUFFER.downloads[t+"_"+n])return e(t+1);n=t+"_"+n}(0),BUFFER.downloads[n]=r={type:m.start(function(){},!0),up:!0,name:e.name,delete:m.start(function(){},!0),speed:m.start(function(){},!0),downloaded:m.start(function(){},!0),xhr:m.start(function(){},!0),name:e.name},r.delete.wait(function(){var e=r.inDownloads;e&&setTimeout(function(){e.remElem()},1e3),r.inDownloads=void 0,delete BUFFER.downloads[n]}),r.type.progress(function(e){r.inDownIng&&r.inDownIng.html(e.tr),"complete"===e&&(r.inDownSpeed&&r.inDownSpeed.html(formatBytes(0)),r.inDownBar&&r.inDownBar.css("width","100%"),r.delete.value=!0,UI.reloadListsChanges(p,f)),"stop"!==e&&"error"!==e||(r.inDownSpeed&&r.inDownSpeed.html(formatBytes(0)),r.delete.value=!0)}),r.type.progressValue="getting size",r.size=m.start(function(){return[e.size,formatBytes(e.size)]}),r.download=r.size.wait(function(){return(r.xhr.value={x:t.common("uploadFile",{name:e.name,index:0},[e])}).x}),r.download.wait(function(e){return console.log(e),r.type.value=r.speed.value=r.downloaded.value=!0,0===e?(r.type.progressValue="error",0):"ok"===(e=e[0]).type?r.type.progressValue="complete":(console.log(e),r.type.progressValue="error")}),r.download.progress(function(o){if("abort"===o.type)return r.download.value=0;(a=r.size.wait(function(e){return e})).wait(function(e){if("up"===o.type&&o.data.loaded<=e[0]){if(r.downloaded.progressValue=o.data.loaded,-1<s[0]){var t=[s[0],s[1]],n=500<a.time-c;l=(o.data.loaded-t[1])/(a.time-t[0])*1e3,100<(i=o.data.loaded/e[0]*100)&&(i=100),n&&(c=a.time),n&&(r.inDownIng&&r.inDownIng.html(formatBytes(o.data.loaded)+"/"+e[1]),r.inDownSpeed&&r.inDownSpeed.html(formatBytes(l)),r.inDownBar&&r.inDownBar.css("width",i+"%")),r.speed.progressValue=l}s[0]=a.time,s[1]=o.data.loaded}}).error(console.error)}),BUFFER.loadprocess.reloadDownloads.progressValue=!0;var o=".srcplace>[act=downloads]".a();if(o){var d=o.child(".backcontent>f-scrollplane"),u=m.createElem("div",{_TXT:UI.getAct("uploadsFileSrc")}).children[0].pasteIn(d);u.opt({_url:n}),u.child(".name").html=e.name,r.inDownloads=u,r.inDownSpeed=u.child(".speed"),r.inDownIng=u.child(".downloading"),r.inDownBar=u.child(".bar")}})},getLocalFiles:function(r,e,t){e=e||r.attrFromPath("multiple"),t=t||r.attrFromPath("accept"),queryFiles(function(e){for(var t="",n=0,o=(r.files=e).length;n<o;n++)t+=e[n].name+"<br>";r.html=t},e,t)},copyText:function(e,t){if(o.clipboardData)o.clipboardData.setData("Text",t);else{var n="body".addElem("textarea",{_CSS:{position:"absolute",left:"-1000px",top:"-1000px"},_VAL:t});n.select(),i.execCommand("copy",!1,null)||UI.dialogPanel({content:[{type:"message",text:"copy instruction".tr},{type:"textarea",inpID:".",opt:{_VAL:t,_INIT:function(e){e.select()}}},{type:"button",btntext:"ok".tr,btnID:"ok"}],onEnter:"ok"}),n.remElem()}}})}(window.A,window,document);