(function(){
	"use stict";
	A({
		addFromText: function (txt, pos) {
			var a = this.a(),
			el = document.createElement('div');
			el.innerHTML = txt;
			el.children.all(function (elem) {
				elem.paste({
					in: a,
					pos: pos
				});
			});
			return a;
		},
		br: function get() {
			var a = this.a();
			a.parentNode.insertAfter(A.createElem("br"),a);
			return a;
		}
	})
	window.UI = {
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
		getAct: function (act, text, args) {
          	var el = (".sources>" + "[act=" + act + "]"),
			txt = text||el.all(function(sr){return sr.html();}).return[0]||window.JS_SRC[act],
			_ = args||{};
			return Preprocess({
				js: function (t) {
					return Function("selfAct,_", t + "\n;")(el, _);
				},
				set: function (t) {
					return Function("selfAct,_", "return " + t + ";")(el, _);
				},
              	scrollplane: function(t) {
                  	var txt=t.split(","),attrs,tL,y,x;
                  	t=txt.splice(0,1)[0];
                  	tL=t.toLowerCase();
                  	attrs=t.match(/attrs.*?[\s\S\t\r\n\v]*?:(.*)/mi);
                  	txt=txt.join(",");
                  	y=tL.indexOf("y");
                  	y=y>-1&&(attrs?y<attrs.index:true);
                  	x=tL.indexOf("x");
                  	x=x>-1&&(attrs?x<attrs.index:true);
                  
                  	return "<f-scrollplane "+(attrs?attrs[1]:"")+" >"+txt+"</f-scrollplane>"
                    		+(y?"<f-scroll-y><f-wheel></f-wheel></f-scroll-y>":"")
                      		+(x?"<f-scroll-x><f-wheel></f-wheel></f-scroll-x>":"");
                }
			}, {
				start: "@",
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
					checked: {},
					fileLists: {}
				}
				dialog.child("f-scrollplane>input,f-scrollplane>textarea", !0).all(function (el) {
					data.values[el.opt("iid")] = el.val();
				});
				dialog.child("f-scrollplane>.uploaderstyle>input", !0).all(function (el) {
					data.fileLists[el.opt("uid")] = el.files;
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
					bc.addElem("pre", {
						class: "message",
						_TXT: el.text
					}).opt(el.opt||{});
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
				case "uploader":
					var upl="[act=dialogInputSrc]>.uploaderstyle".copy({
						pasteIn: bc
					}).child("input").opt({
						uid: el.uplID,
						accept: el.accept||"",
						multiple: el.multiple?"true":""
					}).opt(el.opt || {}),
						uplTxt =upl.parentNode.child("div");
					uplTxt.html=el.upltext||"";
					upl.addEventListener("change",function(){
						var txt="";
						for(var i=0, len=upl.files.length; i < len; i++){
							txt+=upl.files[i].name+"<br>";
						}
						uplTxt.html=txt;
					});
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
              	if(er==="no password")
                  	er="wrong password";
              	up(er.tr);
			})();
		}
	}
})();