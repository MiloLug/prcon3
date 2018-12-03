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
	}
  	
  	A({
      	tr:function get(){
          	return window.JS_LANG[this]||this;
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