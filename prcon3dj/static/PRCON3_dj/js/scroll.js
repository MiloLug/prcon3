(function (w,d) {
	"use strict";
	w.scrollJS_scrollEvent=function (e, path) {
			if (e.constructor === w.scrollJS_scrollEvent)
				this.Ainit(e,w);
			else
				this.Ainit(new w.BJSEvent(e, path, false),w),
				this.axis = e.axis || "Y",
				this.direction = Math.sign(e.direction||1);
		};
	w.A._DATA.BJSListeners.ListenersList.scrollJS_scroll={
		lisData: "scrollJS_scroll",
		remover: function (a,func) {
			a.remLisData(this.lisData, func);
		},
		emitter: function (a, ev, e, exp) {
			e.path=a.path;
			A.activateLis(e, this.lisData, false, w.scrollJS_scrollEvent);
		},
		adder: function (a, ev, func, s, exp) {
			var lis = this.lisData;
			a.addLisData(lis, func, s, ev);
		}
	};
    var f0 = [],
        f1={},
        f2={},
		debounce= function(fn,time,_this){
  			var allow=false;
  			(function interval(){
  				allow=true;
  				setTimeout(interval,time);
  			})();
  			return function(){
  				if(!allow)
  					return;
  				fn.apply(_this||null,arguments);
  				allow=false;
  			}
  		},
	f3 = {
		gets: function (obj, type, e, temp) {
			obj.x = type === "X",
			obj.coo = obj.x ? "X" : "Y",
			obj.hw = obj.x ? "width" : "height",
			obj.shw = obj.x ? "scrollWidth" : "scrollHeight",
			obj.stl = obj.x ? "scrollLeft" : "scrollTop",
			obj.tl = obj.x ? "left" : "top",
			temp = obj.thP.getBoundingClientRect(),
			obj.thPOffset = temp[obj.tl],
			obj.thPSize = temp[obj.hw],
			temp = obj.th.getBoundingClientRect(),
			obj.thSize = temp[obj.hw],
			obj.thOffset = temp[obj.tl],
			obj.SPSize = obj.SP.getBoundingClientRect()[obj.hw],
			obj.thPScrollSize = obj.thP[obj.shw],
			obj.SPScrollSize = obj.SP[obj.shw],
			obj.SPScrollOffset = obj.SP[obj.stl],
			obj.cpStart = obj.x ? e.X + 0 : e.Y + 0,
            obj.curFrame=0,
			obj.cpOffset = obj.cpStart - obj.thOffset + obj.thPOffset;
		},
		preventer: function (e) {
			e.preventDefault && e.preventDefault(),
			e.stopPropagation && e.stopPropagation(),
			e.cancelBubble = true,
			e.returnValue = false,
			e.stopImmediatePropagation && e.stopImmediatePropagation();
		},
		nosel: function () {
			"html".addClass = "NOSELECT",
            w.addEventListener("scroll", f3.preventer,{
                    	capture:false,
                      	passive:true
                    }),
			w.addEventListener("wheel", f3.preventer,{
                    	capture:false,
                      	passive:true
                    }),
			w.addEventListener("drag", f3.preventer,{
                    	capture:false,
                      	passive:true
                    }),
			w.addEventListener("dragstart", f3.preventer,{
                    	capture:false,
                      	passive:true
                    });

		},
		scrollSP: function (obj, reverse, pos, temp) {
          	w.requestAnimationFrame(function(){
				reverse = reverse || false;
				var temp=obj.SP[obj.stl];
				if (reverse)
					obj.SP[obj.stl] = pos,
					obj.th.css(obj.tl, pos * (obj.thPSize - obj.thSize) / (obj.SPScrollSize - obj.SPSize) + "px");
				else
					obj.SP[obj.stl] = pos * (obj.SPScrollSize - obj.SPSize) / (obj.thPSize - obj.thSize);
				obj.SP.emitEvent("scrollJS_scroll",{
					axis:obj.coo,
					direction:temp-obj.SP[obj.stl]
				});
            });
		},
		move: function (e, obj, temp) {
          	obj=obj||f1;
          	w.requestAnimationFrame(function(){
				temp = (temp = e[obj.coo] - obj.cpOffset) < 0 ? 0 : temp + obj.thSize > obj.thPSize ? obj.thPSize - obj.thSize : temp,
				obj.th.css(obj.tl, temp + "px"),
				f3.scrollSP(obj || f1, false, temp);
            });
        },
		touchMoveX: function (e, obj, temp) {
          	obj=obj||f1;
			var tmpDelta=obj.cpStart - e[obj.coo];
			w.requestAnimationFrame(function(){
				temp = (temp = obj.SPScrollOffset + tmpDelta) < 0 ? 0 : temp > obj.SPScrollSize - obj.SPSize ? obj.SPScrollSize - obj.SPSize : temp,
				f3.scrollSP(obj, true, temp);
			});
        },
		touchMoveY: function (e, obj, temp) {
          	obj=obj||f2;
			var tmpDelta=obj.cpStart - e[obj.coo];
			w.requestAnimationFrame(function(){
				temp = (temp = obj.SPScrollOffset + tmpDelta) < 0 ? 0 : temp > obj.SPScrollSize - obj.SPSize ? obj.SPScrollSize - obj.SPSize : temp,
				f3.scrollSP(obj, true, temp);
			});
		},
		wheelMove: function (e, obj, max) {
			var delta=e["wheelDelta"+obj.coo],
				sign=Math.sign(delta),
				summ=0;
			max=max||17;
				delta=delta*sign>max?max*sign:delta;
			(function interval(){
				var temp,
					tempDelta=(delta-=sign);
				if(Math.sign(tempDelta)!==sign)
					return;
				w.requestAnimationFrame(function(){
					summ+=tempDelta*sign;
					if(summ>=obj.SPSize)
						return (delta=0);
					temp = (temp = obj.SP[obj.stl] - tempDelta) < 0 ? 0 : temp > obj.SPScrollSize - obj.SPSize ? obj.SPScrollSize - obj.SPSize : temp;
					f3.scrollSP(obj, true, temp);
				});
				setTimeout(interval,10);
			})();
		},
		toCurPos: function (obj,temp) {
          	obj.th.css(obj.tl,((temp= obj.SP[obj.stl] * (obj.thPSize - obj.thSize) / (obj.SPScrollSize - obj.SPSize)) < 0 ? 0 : temp + obj.thSize > obj.thPSize ? obj.thPSize - obj.thSize : temp) + "px");
		}
	};
	d.on("mousedown", function (docE, s, temp) {
		f1.th = docE.toElement,
		f1.thP = f1.th.parentNode,
		f1.SP = f1.thP.parentNode.child("f-scrollplane", !1, !0),
		temp = f1.th.tagName.toUpperCase();
		if (temp === "F-WHEEL") {
			f3.nosel(),
			temp = f1.thP.tagName.toUpperCase();

			if (temp === "F-SCROLL-Y")
				f3.gets(f1, "Y", docE);
			else if (temp === "F-SCROLL-X")
				f3.gets(f1, "X", docE);
          
			w.A.on("mousemove", f3.move);
		} else if (temp === "F-SCROLL-Y" || temp === "F-SCROLL-X") {
			f3.nosel(),
			f1.th = docE.toElement.child("f-wheel", !1, !0),
			f1.thP = f1.th.parentNode,
			f1.SP = f1.thP.parentNode.child("f-scrollplane", !1, !0);
            console.log(666);
			if (temp === "F-SCROLL-Y")
				f3.gets(f1, "Y", docE);
			else if (temp === "F-SCROLL-X")
				f3.gets(f1, "X", docE);

			f1.cpOffset = f1.thSize / 2 + f1.thPOffset,
			f3.move(docE,f1),
              
            w.A.on("mousemove", f3.move);
		} else {
			temp = false,
			docE.path.all(function (el) {
				if (el !== d && el !== w && el.tagName.toUpperCase() === "F-SCROLLPLANE") {
					temp = el;
					return "break";
				}
			}, "break");

			if (!temp)
				return;
			f1.SP = f2.SP = temp,
			f1.thP = f1.SP.parentNode.child("f-scroll-x", !1, !0),
			f2.thP = f1.SP.parentNode.child("f-scroll-y", !1, !0);
			if (f1.thP)
				f1.th = f1.thP.child("f-wheel", !1, !0),
				f3.gets(f1, "X", docE),
                w.A.on("touchmove", f3.touchMoveX, true);

			if (f2.thP)
				f2.th = f2.thP.child("f-wheel", !1, !0),
				f3.gets(f2, "Y", docE),
                w.A.on("touchmove", f3.touchMoveY, true);
		}
	}),
	d.on("wheel", function (e, tmp) {
		var temp = false,
		path = e.path || (e.toElement || e.srcElement || e.target).path;
		path.all(function (el) {
			if (el !== d && el !== w && el.tagName.toUpperCase() === "F-SCROLLPLANE") {
				temp = el;
				return "break";
			}
		}, "break");
		if (!temp)
			return;
		f1.SP = f2.SP = temp,
		f2.thP = f1.SP.parentNode.child("f-scroll-x", !1, !0),
		f1.thP = f1.SP.parentNode.child("f-scroll-y", !1, !0);
		if (f1.thP && !e.shiftKey && e.deltaY)
			f1.th = f1.thP.child("f-wheel", !1, !0),
			f3.gets(f1,"Y",e),
			f3.wheelMove(e, f1);
		if (f2.thP && (e.shiftKey || e.deltaX))
			f2.th = f2.thP.child("f-wheel", !1, !0),
			f3.gets(f1,"X",e),
			f3.wheelMove(e, f2);

	},{
    	capture:false,
        passive:true
	}),
	w.A.on("mouseup", function () {
		"html".remClass("NOSELECT"),
		w.removeEventListener("scroll", f3.preventer),
		w.removeEventListener("wheel", f3.preventer),
		w.removeEventListener("drag", f3.preventer),
		w.removeEventListener("dragstart", f3.preventer),
		w.A.not("mousemove", f3.move),
        w.A.not("mousemove", f3.touchMoveY),
        w.A.not("mousemove", f3.touchMoveX);
		
	});

	var el = CE({}),
	elX = CE({
			connectedCallback: function () {
				var tmpSize = 0,
				f={};
              	this.resFn=function (e) {
                  	if (e.width === tmpSize)
						return;
					tmpSize = e.width,
					f.th = e.toElement.child("f-wheel", !1, !0),
					f.thP = e.toElement,
					f.SP = f.thP.parentNode.child("f-scrollplane", !1, !0),
					f3.gets(f, "X", {
						X: 0
					}),
					f3.toCurPos(f);
				};
                this.on("resize", this.resFn);
			},
      		disconnectedCallback:function(){
              	this.not("resize",this.resFn);
            }
		}),
	elY = CE({
			connectedCallback: function () {
				var tmpSize = 0,
                    f={};
              	this.resFn=function (e) {
                  	if (e.height === tmpSize)
						return;
					tmpSize = e.height,
					f.th = e.toElement.child("f-wheel", !1, !0),
					f.thP = e.toElement,
					f.SP = f.thP.parentNode.child("f-scrollplane", !1, !0),
					f3.gets(f, "Y", {
						Y: 0
					}),
					f3.toCurPos(f);
				};
				this.on("resize", this.resFn);
			},
      		disconnectedCallback:function(){
              	this.not("resize",this.resFn);
            }
		}),
	el4 = CE({
			connectedCallback: function () {
				this.f3 = f3;
				var tmpHSize = 0,
				tmpWSize = 0,
				t = this,
				f1={},
                f2={};
                t.intervals=[];
				t.intervals.push(setInterval(function () {
					setTimeout(function () {
						if (t.scrollWidth !== tmpWSize)
							tmpWSize = t.scrollWidth,
							f1.SP = t,
							f1.thP = f1.SP.parentNode.child("f-scroll-x", !1, !0),
                            f1.thP && (
								f1.th = f1.thP.child("f-wheel", !1, !0),
								f3.gets(f1, "X", {
									X: 0
								}),
								f3.toCurPos(f1));
					}, 0),
					setTimeout(function () {
						if (t.scrollHeight !== tmpHSize)
							tmpHSize = t.scrollHeight,
							f2.SP = t,
							f2.thP = f2.SP.parentNode.child("f-scroll-y", !1, !0),
							f2.thP && (
								f2.th = f2.thP.child("f-wheel", !1, !0),
								f3.gets(f2, "Y", {
									Y: 0
								}),
								f3.toCurPos(f2));
					}, 0);
				}, 100));
				t.intervals.push(setInterval(function (temp, x, y) {
					temp = t.getBoundingClientRect(),
					x = t.parentNode.child("f-scroll-x", !1, !0),
					y = t.parentNode.child("f-scroll-y", !1, !0);
					if (tmpHSize - 1 <= temp.height)
						y && y.opt({
							no: "."
						});
					else
						y && y.opt({
							no: ""
						});

					if (tmpWSize - 1 <= temp.width)
						x && x.opt({
							no: "."
						});
					else
						x && x.opt({
							no: ""
						});

				}, 1000));
			},
      		disconnectedCallback:function(){
              	this.intervals.all(function(i){
                  	clearInterval(i);
                });
            }
		});
	customElements.define("f-wheel", el),
	customElements.define("f-scroll-x", elX),
	customElements.define("f-scroll-y", elY),
	customElements.define("f-scrollplane", el4);
})(window,document);
