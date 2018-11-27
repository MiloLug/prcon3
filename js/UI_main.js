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
var UI = {
		toTopLayer: function (elem) {
			elem = elem.a();
			var tl = elem.parentNode.child("[toplayer]");
			tl && tl.opt({
				toplayer_queue: UI.getLargestLayer(elem.parentNode) + 1,
				toplayer: ""
			});
			elem.opt({
				toplayer_queue: "",
				toplayer: "."
			});
          	return elem;
		},
		getAct: function (act, text) {
          	var el = (".sources>" + "[act=" + act + "]"),
			txt = text||el.all(function(sr){return sr.html();}).return[0]||window.JS_SRC[act],
			_ = {};
			return Preprocess({
				js: function (t) {
					return Function("selfAct,_", t + " ;")(el, _);
				},
				set: function (t) {
					return Function("selfAct,_", "return " + t + ";")(el, _);
				}
			}, {
				commandStart: "@",
				bodyStart: "::",
				end: "::@"
			}, txt);
		},
		getLargestLayer: function (TH, elem) {
			var tl = 0,
			cur = 0,
			re;
			TH.child("[toplayer_queue]", !0).all(function (el) {
				tl = parseFloat(el.opt("toplayer_queue"));
				if (cur < tl)
					cur = tl,
					re = el;
			});
			return elem ? re : cur;
		},
		setSrcToPlace: function (act, demult, text) {
			var src = "[act=" + act + "]",
			req = false;
			if (demult ? (".srcplace>" + src).a(!0).length < 1 : true) {
				UI.toTopLayer(req = ".srcplace".addElem("div", {
							act: act,
							class: "back",
							_TXT: UI.getAct(act, text)
						}));
			} else {
				req=UI.toTopLayer((".srcplace>" + src).a());
			}
			return req;
		},
		setLSToPlace: function (elem, set) {
			var req = false;
			elem = elem.child(".lsplace", !1, !0) || elem.addElem("div", {
					class: "lsplace"
				});
          	set ?
			elem.child(".loadscreen", !0).length < 1 && (
				req = true,
				elem.addElem("div", {
					class: "loadscreen",
					_TXT: UI.getAct("loadscreen")
				}))
			 : elem.html("");
			return req;
		},
		easyCancel: function (TH) {
			var el = TH.parent(function (el) {
					return el.hasClass("back");
				}),
			tl = el.parentNode.child("[toplayer]") !== el ? false : UI.getLargestLayer(el.parentNode, true);
			el.remElem();
			tl && UI.toTopLayer(tl);
		},
		closeDialog: function (uid) {
			uid = (".dialog[uid=" + uid + "]").a();
			if (!uid)
				return;
			(uid = [
					uid,
					uid.previousElement
				], uid[0]).remElem();
			if (!".dialogback".a().children.length)
				".dialogback".opt({
					hidden: "."
				});
			else
				UI.toTopLayer(uid[1]);
		},
		dialogPanel: function (param) {
          	window.focus();
			var s = A.args({
					content: [{
							type: "message",
							text: "Warning!!!"
						}, {
							type: "button",
							btntext: "ok",
							btnID: "ok"
						}, {
							type: "button",
							btntext: "cancel",
							btnID: "cancel"
						}
					],
					//onEnter:"ok",
					//onEsc:"cancel",
					func: function () {}
				}, param),
			dialog = ".dialogback".addElem("div", {
					class: "dialog",
					uid: UID.get(),
					_TXT: "<f-scrollplane></f-scrollplane><f-scroll-y no='.'><f-wheel></f-wheel></f-scroll-y><div class='downmenu'></div>"
				}),
			bc,
			inpcount = 0,
			fn = function (e) {
				var data = {
					pressed: e.toElement.opt("bid"),
					values: {},
					checked: {}
				}
				dialog.child("f-scrollplane>input", !0).all(function (el) {
					data.values[el.opt("iid")] = el.val();
				});
				dialog.child("f-scrollplane>.chbstyle>input", !0).all(function (el) {
					data.checked[el.opt("cid")] = el.checked;
				});
				UI.closeDialog(dialog.opt("uid"));
				s.func(data);
			};

			UI.toTopLayer(dialog);
			".dialogback".opt({
				hidden: ""
			});

			bc = dialog.child("f-scrollplane");
			s.content.all(function (el, ind) {
				switch (el.type) {
				case "message":
					bc.addElem("div", {
						class: "message",
						_TXT: el.text
					});
					break;
				case "button":
					"[act=dialogInputSrc]>button".copy({
						pasteIn: dialog.child(".downmenu")
					}).opt({
						bid: el.btnID,
						_TXT: el.btntext,
						_LIS: [{
								click: fn
							}
						],
						onEnter: el.btnID === s.onEnter ? "." : "",
						onEsc: el.btnID === s.onEsc ? "." : ""
					}).opt(el.opt || {});
					break;
				case "textarea":
				case "input":
					("[act=dialogInputSrc]>" + el.type).copy({
						pasteIn: bc
					}).opt({
						iid: el.inpID
					}).opt(el.opt || {})[inpcount < 1 ? (inpcount++, "focus") : "a"]();
					break;
				case "checkbox":
					"[act=dialogInputSrc]>.chbstyle".copy({
						pasteIn: bc,
						deep: true
					}).br.child("input").opt({
						cid: el.chcID
					}).opt(el.opt || {}).parentNode.child("text").html = el.chctext;
					break;
				}
			});
		},
		errors: function (errors, next) {
			(next = function () {
				if (!errors.length)
					return;
				var er = errors.splice(0, 1)[0],
				up = function (msg) {
					UI.dialogPanel({
						content: [{
								type: "message",
								text: msg
							}, {
								type: "button",
								btnID: "ok",
								btntext: "ok"
							}
						],
						onEnter: "ok",
						onEsc: "ok",
						func: function () {
							next();
						}
					});
				};
				switch (er) {
				case "no password":
				case "wrong password":
					up("Password is missing or incorrect. <br> Enter another password.");
					break;
				case "net err":
					up("Network connection error. <br> Check your network connection");
					break;
				case "no ftp login":
					up("Ftp login is missig.");
					break;
				case "ftp con err":
					up("Ftp connection error.");
					break;
				case "ftp login err":
					up("Error connecting to ftp account.");
					break;
				case "not main":
					up("Invalid server client address.");
					break;
				case "logged":
					up("you are already logged in");
					break;
				case "no acc":
					up("account not found in storage");
					break;
				case "wrong path":
					up("path is not exists or not available");
					break;
				case "no name":
					up("you did not enter the name of the object being created");
					break;
				case "already exists":
					up("this object already exists in the destination folder");
					break;
				case "obj is dir":
					up("this function needs a file, not a folder!");
                    break;
                case "no editor":
                    up("please, select file editor");
                    break;
				case "no pop-up":
					up("please, allow popups");
					break;
				}
			})();
		}
}