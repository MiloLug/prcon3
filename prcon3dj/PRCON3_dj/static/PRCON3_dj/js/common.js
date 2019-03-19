(function(){
	"use strict";

	window.UID = {
		get: function () {
			return "_" + ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, function (c) {
				return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
			});
		},
		eUid: function (e, agr, u) {
			return (
				u === undefined && (u = this.get()),
				u = agr ? u : (e.getAttribute("f-uid") || u),
				e.setAttribute("f-uid", u),
				u);
		}
	};
  	window.formatBytes=function(bytes,decimals) {
	   if(bytes == 0) return '0 B';
	   var k = 1024,
	       dm = decimals <= 0 ? 0 : decimals || 2,
	       sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	       i = Math.floor(Math.log(bytes) / Math.log(k));
	   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	};
	window.to2char=function(vl){
		vl=parseFloat(vl);
		return (vl<10?"0":"")+vl;
	};
	window.fullDate=function(){
		var date=new Date();
		return to2char(date.getDate())+"_"+to2char(date.getMonth()+1)+"_"+date.getFullYear()+"-"+to2char(date.getHours())+"_"+to2char(date.getMinutes())+"_"+to2char(date.getSeconds());
	};
  	A({
      	tr:function get(){
          	var txt=window.JS_LANG[this.toLowerCase()]||this;
            if(this.charAt(0)!=this.charAt(0).toUpperCase())
              	txt=txt.charAt(0).toLowerCase()+txt.slice(1);
        	else
              	txt=txt.charAt(0).toUpperCase()+txt.slice(1);
          	return txt;
        }
    });
	
	window.A.on("combination", "enter", function (e) {
		var onEnter = ".dialog[toplayer] [onEnter]".a();
		if (onEnter)
			e.stopEvent(),
			onEnter.emitEvent("click");
	});

	window.A.on("combination", "esc", function (e) {
		var dg = ".dialog[toplayer]".a(),
		onEsc = ".dialog[toplayer] [onEsc]".a();
		if (dg)
			e.stopEvent();
		else
			return;
		if (onEsc)
			onEsc.emitEvent("click");
		else
			UI.closeDialog(dg.opt("uid"));
	});

	window.A.on("beforeunload",function(e){
		if(window.allowUnload)
			return;
		var txt="close page?".tr;
		e.returnValue=txt;
		return txt;
	});

})();