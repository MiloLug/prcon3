/**
BJS v 6.5.0 (in develop) -beta -full
No copyright library
Prev define version: 6.0.0 (15.10.2018)
 **/

(window._AinitF = function (W, Ain) {
	"use strict";
	var _objTypes = {
		"[object Undefined]": "undefined",
		"[object Null]": "null"
	},
	_cType = function (obj) {
		return _objTypes[Object.prototype.toString.call(obj)];
	};
	[
		"NodeList",
		"Object",
		"String",
		"Function",
		"NodeList",
		"Array",
		"EventTarget",
		"HTMLCollection",
		"Number",
		"Boolean",
		"Blob",
		"File"
	].forEach(function (obj) {
		_objTypes[Object.prototype.toString.call(W[obj] ? W[obj].prototype : W[obj])] = obj;
	});

	!Ain && W.Object.defineProperties(W.Object.prototype, {
		Ainit: {
			/**конструктор объектов.
			принимает объект и помещает его свойства в тот, на котором вызван Init.
			если объект содержит конструкции типа l:{set:...,get:...}(только как прямые потомки), то они будут использованы как get l или set l (так же как и numerable,configurable,writable).
			если свойство __isParam__ установлено в false l:{__isParam__:false}, то все свойства будут приниматься НЕ как параметры свойствa l (enumerable,configurable,writable,get,set)
			также get и set можно создать, используя имя самой функции l:function get(){}-
			getfun - создаст get с обёрткой
			l:{
			get:function (){
			return get(){};
			}
			} - функция не будет выполняться сама
			set - создаст set
			get- создаст get без обёртки функции(она выполнится сама при вызове get)
			setgetfun - создаст set и get (get с обёрткой) для одной функци
			setget - создаст set и get без обёртки для одной функции
			 **/
			enumerable: false,
			configurable: false,
			writable: true,
			value: function (vl, Ww) {
				var tmp = {};
				Ww = Ww || W;
				for (var nm in vl) {
					var s = vl[nm] || {},
					isp = s.__isParam__,
					sn = s.name || "";
					delete s.__isParam__;
					tmp[nm] = (s.set === undefined && s.get === undefined && s.enumerable === undefined && s.configurable === undefined && s.writable === undefined && ["get", "set", "setget", "setgetfun", "getfun"].indexOf(sn) === -1 && isp !== true) || isp === false ? {
						enumerable: true,
						configurable: true,
						writable: true,
						value: vl[nm]
					}
					 : _cType(s) !== "Function" ? s : (function (s, sn) {
						switch (sn) {
						case "setget":
							return {
								get: s,
								set: s
							};
						case "setgetfun":
							return {
								get: function () {
									return s;
								},
								set: s
							};
						case "set":
							return {
								set: s
							};
						case "get":
							return {
								get: s
							};
						case "getfun":
							return {
								get: function () {
									return s;
								}
							};
						}
					})(s, sn);
				}
				Ww.Object.defineProperties(this, tmp);
			}
		},
		__typeOfThis__: {
			get: function () {
				return _cType(this);
			},
          	set: function (v){
              	return v;
            }
		},
		__cName__:{
			get: function () {
				return this.constructor.name;
			},
          	set: function (v){
              	return v;
            }
		},
		errored: {
			value: function (test) {
				if (this === errored)
					return errored;
				if (!!arguments.length) {
					if (_cType(test) === "Function" ? test(this) : test)
						return this;
				} else if (!A.isEmpty(this) && this.a && this.a())
					return this;
				return this.errored;
			}
		}
	});
	Object.__typeOf__ = _cType;

	var nodeobj = {},
	WA = {},
	WAfunc = function (obj, Ww) {
		if(obj.__typeOfThis__==="String"){
			return new String(obj);
		}
		var empty = {};
		WA.Ainit(obj, Ww || W);
		for (var nm in obj) {
			empty[nm] = function get() {
				return errored;
			};
		}
		errored.Ainit(empty, Ww || W);
	};
	WA.__proto__ = W.Object.prototype;
	WAfunc.__proto__ = WA;

	nodeobj.Ainit(W.EventTarget.prototype, W);
	nodeobj.__proto__ = WA;
	nodeobj.constructor = W.EventTarget;
	W.Node.prototype.__proto__ = nodeobj;
	W.Array.prototype.__proto__ = WA;
	W.String.prototype.__proto__ = WA;
	W.NodeList.prototype.__proto__ = WA;
	W.HTMLCollection.prototype.__proto__ = WA;
	var A = W.A = WAfunc;

	W.A({
		/**\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		\\+---------------------------------------------------------------+\\
		\\|функции непосредственного взаимодействия с элементами          |\\
		\\+---------------------------------------------------------------+\\
		\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		\\+---------------------------------------------------------------+\\
		\\|Дополнительная информация                                      |\\
		\\+---------------------------------------------------------------+\\
		\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		\\+---------------------------------------------------------------+\\
		\\|Эти функции не могут изменять строки при стандартных           |\\
		\\|параметрах! Они лишь получают их значения и используют для     |\\
		\\|получения указателя на элемент								  |\\
		\\|																  |\\
		\\|a-elemet(над которым будут совершаться манипуляции)            |\\
		\\|"a" получается через функцию this.a() или this.a(true) если	  |\\
		\\|нужен массив													  |\\
		\\|																  |\\
		\\|elements общее наименование для строк-css-селекторов, 		  |\\
		\\|	элементов, массивов с элементами, NodeList и HTMLCollection   |\\
		\\|element общее наименование для строк-css-селекторов, элементов |\\
		\\|                         									  |\\
		\\|(!прочтите описание Init (функция выше))						  |\\
		\\+---------------------------------------------------------------+\\
		\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\**/
		a: function (arr, tmp, th) {
			/**основная функция получения указателей.
			Если аргумент= true, то вернёт массив независимо от входа this(если элемент один, то будет массив с ним),
			стандартное значение: false. В качестве this принимает elements**/
			th = this;
			return th === W.A ?
			W :
			th.__typeOfThis__ === "String" ?
			W.document[arr ? "querySelectorAll" : "querySelector"](th) :
			th.almostArray ?
			arr ?
			th :
			th[0] :
			arr ?
			[th] :
			th;
		},
		almostArray: function get(c) {
			return (c = this.__typeOfThis__, c === "Array" || c === "NodeList" || c === "HTMLCollection" || c instanceof W.Array);
		},
		child: function (vl, arr, immed) {
			var a = this.a();
			A.isEmpty(a) && A.error(A.errs.E_1);
			return a.querySelectorAll(vl).weed(immed ? function (el) {
				return el.parentNode === a;
			}
				 : function () {
				return true;
			}).a(arr);
		},
		val: function setgetfun(vl) {
			/**задать||получить значение a.
			функция автоматически определяет, где использовать value или innerHTML.
			если аргумент отсутствует, возвращает значение a,
			если есть, то возвращает сам a, передавая ему значение vl
			 **/
			var a = this.a();
			A.isEmpty(a) && A.error(A.errs.E_1);
			if (!!arguments.length)
				return (a.value = vl, a);
			return a.value;
		},
		html: function setgetfun(vl) { /**на случай, если val не может правильно определить, что использовать(value или inndeHTML).**/
			var a = this.a();
			A.isEmpty(a) && A.error(A.errs.E_1);
			if (!!arguments.length)
				return (a.innerHTML = vl, a);
			return a.innerHTML;
		},
		weed: function (func) {
			var a = this.a(!0),
			yeah = [];
			a.all(function (el) {
				func(el) && yeah.push(el);
			});
			return yeah;
		},
		DOMTree: function setgetfun(dom) {
			/**генерация DOM дерева(вспомогательная функция для .opt()).
			в качестве аргумента принимает массив или объект следующего вида:{
			_ADD:[{elem:opt},{elem:opt}
			....
			],
			_EDIT:[{elem:opt},{elem:opt}
			....
			]
			}
			_ADD добавляет новые элементы
			так же можно добавлять сразу несколь элементов с одинаковым opt {"elem0,elem1,elem2":opt}
			_ADD может принимать объекты в перемешку с элементами и тоже вставлять их в дерево:
			_ADD:[{elem:opt},element,{elem:opt}]
			_EDIT редактирует существующие по селекторам(прямые потомки)
			если dom- массив, то будет использовано _ADD
			opt означает, что значение такое же, какое принимает .opt()
			то-есть можно создать бесконечную цепочку {"div":{id:"id1",_DOM:{"div":{_DOM:{"div".....}}}}
			функция возвращает a
			 **/
			var a = this === W.A ? (a = A.createElem("div"), a._DOMTreeList = true, a) : this,
			key,
			elems,
			tmp = [];
			if (!A.isEmpty(dom))
				if (dom.__typeOfThis__ === "Array")
					tmp = dom;
				else if (dom.__typeOfThis__ !== "Object") {
					dom.pasteIn(a);
					return;
				} else if (dom.almostArray) {
					dom.all(function (el) {
						el.pasteIn(a);
					});
					return;
				} else
					tmp = [];

			dom = A.args({
					_ADD: tmp,
					_EDIT: []
				}, dom);
			dom._ADD.all(function (obj) {
				if (obj instanceof HTMLElement) {
					obj.pasteIn(a);
					return;
				}
				for (key in obj)
					elems = key.split(","),
					elems.all(function (el) {
						a.addElem(el, obj[key]);
					});
			});
			dom._EDIT.all(function (obj) {
				for (key in obj)
					elems = a.child(key, true, true),
					elems.all(function (el) {
						el.opt(obj[key]);
					});
			});
			return a;
		},
		copy: function (mv) {
			/**копировать a.
			Eсли mv- объект, то принимает следующие свойства: {
			deep(глубокое копирование элемента):true/false(стандарт- true),
			pasteIn: (аналог {in:} в .pasteIn()) необязательно,
			pos: (аналог {pos:} в .pasteIn()) необязательно
			}
			в противном случае сам аргумент принимает true/false(стандарт- true) и используется в качестве {deep:}
			функция в любом случае возвращает КОПИЮ a
			 **/
			mv = A.args({
					deep: !A.isEmpty(mv) && mv.__typeOfThis__ === "Object" || A.isEmpty(mv) ? true : mv
				}, mv);
			var a = this.a(),
			tmp = a.cloneNode(mv.deep);
			mv.pasteIn && tmp.pasteIn({
				in: mv.pasteIn,
				pos: mv.pos
			});
			return tmp;
		},
      	insertAfter: function(el,pos){
          	var a=this.a(),
                el=el.a(),
                ne;
          	if(!pos||!(A.isEmpty(pos=pos.a()))||!(ne=pos.nextElement))
              	a.appendChild(el);
          	else
            	a.insertBefore(el,ne);
            
          	return a;
        },
		pasteIn: function (args) {
			/**вставить a в элемент.
			Eсли args- объект, то принимает следующие свойства: {
			in: (указатель на элемент, куда будет вставлен а (принимает element), стандартное значение отсутствует),
			pos:"last"(вставить в конец элемента)/ "first"(вставить в начало элемента)/ element(вставить перед данным потомком элемента)
			(стандарт- "last")
			}
			в противном случае сам аргумент работает как {in:}
			функция возвращает a
			 **/
			var a = this.a();
			args = A.args({
					in: !A.isEmpty(args) && args.__typeOfThis__ !== "Object" ? args : undefined,
					pos: "last"
				}, args);
			args.in = args.in.a();
			A.isEmpty(a) && A.error(A.errs.E_1),
			A.isEmpty(args.in) && A.error(A.errs.E_1);
			if (a._DOMTreeList) {
				a.children.all(function (el) {
					args.in.appendChild(el);
				});
				return a;
			}
			switch (args.pos) {
			case "first":
				args.in.insertBefore(a, args.in.firstChild);
				break;
			case "last":
				args.in.appendChild(a);
				break;
			default:
				args.in.insertBefore(a, args.pos.a());
			}
			return a;
		},
		callbackFun: function (fun) { /**выполнить call-back функцию с использованием a в качестве аргумента.**/
			var a = this.a();
			fun(a);
		},
		css: function (vl, vl2) {
			/**получить/задать стили a.
			если vl- строка и при этом задан vl2 то будет фактически выполнено a.css({vl:vl2})
			----------------------------------------------------------------------------------
			получить свойство- передать в к-ве аргумента его имя
			изменить свойства- передать в к-ве аргумента объект {name:value, name:value, na....}(возвращает a)
			если использовать без аргумента, то вернёт ВСЕ стили элемента
			значение типа 112px автоматически переводятся в обычные числа
			 **/
			var req,
			a = this.a(),
			vl = vl || "",
			tmp,
			pf;
			A.isEmpty(a) && A.error(A.errs.E_1);
			if (vl.__typeOfThis__ === "Object") {
				for (var key in vl) {
					a.style[key] = vl[key];
				}
				return a;
			}
			if (arguments.length > 1) {
				a.style[vl] = vl2;
				return a;
			}
			if (!A.isEmpty(vl))
				tmp = a.currentStyle ? a.currentStyle[vl] : W.getComputedStyle(a).getPropertyValue(vl),
				pf = tmp.match(/[,  %]/) ? NaN : parseFloat(tmp),
				req = A.isNumeric(pf) ? pf : tmp;
			else
				req = a.currentStyle ? a.currentStyle() : W.getComputedStyle(a);
			return req;
		},
		opt: function setgetfun(vl, vl2) {
			/**различные действи с элементом a.
			если vl- строка и при этом задан vl2 то будет фактически выполнено a.opt({vl:vl2})
			----------------------------------------------------------------------------------
			если vl-объект({attribute:value,attribute:val....}), то a получит соответствующие атрибуты ;
			если vl-строка("attribute"), то будет возвращён соответствующий атрибут a ;
			если vl не задан, то будет возвращён объект со всеми атрибутами a
			Особые случаи:
			атрибут _DOM принимает значение в формате .DOMTree()
			атрибут _ON принимает значение в формате .LisTree()
			атрибут _TXT принимает строку, которая помещается в элемент через .html()
			атрибут _VAL принимает строку, которая помещается в элемент через .val()
			атрибут _CSS принимает значение в формате .css()
			 **/
			var req = null,
			a = this.a(),
			bl = !!arguments.length,
			allAttrs;
			A.isEmpty(a) && A.error(A.errs.E_1);
			if (bl && vl.__typeOfThis__ === "Object") {
				for (var key in vl) {
					if (A._DATA.opt_spec.keys.indexOf(key) < 0) {
						if (vl[key] === "")
							a.removeAttribute(key);
						else
							a.setAttribute(key, vl[key]);
					} else {
						a[A._DATA.opt_spec.funcs[key]](vl[key]);
					}
				}
				return a;
			} else if (arguments.length > 1) {
				req = {};
				req[vl] = vl2;
				return a.opt(req);
			} else if (bl)
				req = a.getAttribute(vl);
			else {
				req = {};
				allAttrs = a.attributes;
				for (var key in allAttrs) {
					if (allAttrs[key].nodeName)
						req[allAttrs[key].nodeName] = allAttrs[key].nodeValue;
				}
			}
			return req;
		},
		attrFromPath: function (attr) {
			var ret;
			this.path.all(function (el) {
				if (el !== W && el !== W.document && (el = el.opt(attr))) {
					ret = el;
					return "break";
				}
			}, "break");
			return ret;
		},
		jsonData: function (vl) {
			/**если vl - пустой, то возвращает значение атрибута "bjs-json" или пустой объект.
			Если vl- объект, то переводит его в json строку и помещает в атрибут "bjs-json"**/
			var a = this.a();
			if (arguments.length)
				return (a.opt("bjs-json", A.json(vl)), a);
			else
				return A.json(a.opt("bjs-json") || "{}");
		},
		addClass: function setgetfun(vl) { /**добавить класс vl к a **/
			var a = this.a();
			A.isEmpty(a) && A.error(A.errs.E_1);
			!a.hasClass(vl) && (a.className += (a.className.length ? " " : "") + vl);
			return a;
		},
		remClass: function (vl) { /**удалить класс vl из a **/
			var a = this.a(),
			newClassArr = [];
			A.isEmpty(a) && A.error(A.errs.E_1);
			a.getClass.all(function (its) {
				its !== vl && newClassArr.push(its);
			});
			a.className = newClassArr.join(' ');
			return a;
		},
		getClass: function get() { /**возвращает массив классов a **/
			return (A.isEmpty(this.a()) && A.error(A.errs.E_1), this.a().className.split(' '));
		},
		hasClass: function (cl) { /**возвращает true, если класс cl пренадлежит элементу a **/
			var x = !1,
			a = this.a();
			A.isEmpty(a) && A.error(A.errs.E_1);
			a.getClass.fined(cl) != -1 && (x = !!1);
			return x;
		},
		toggle: function (vl1, vl2) { /**смена класса vl1 на vl2. Возвращает текущий класс по номеру (1 или 2) или false, если менять нечего (оба аргумента = пустые строки)**/
			var a = this.a(),
			classes = a.getClass,
			srch = vl1 === "" ? [[vl2, 2], [vl1, 1]] : [[vl1, 1], [vl2, 2]];
			if (srch[0][0] === "")
				return false;
			if (classes.indexOf(srch[0][0]) < 0)
				return (a.remClass(srch[1][0]).addClass(srch[0][0]), srch[0][1]);
			else
				return (a.remClass(srch[0][0]).addClass(srch[1][0]), srch[1][1]);
		},
		createElem: function (elem, attrs) { /**создать элемент с атрибутами. attrs принимает то же, что и .opt()**/
          	if(elem.match("<.*?>")){
            	var elems=A.createElem("div",{_TXT:elem}).children;
              	return elems.length===1?elems[0]:elems.all(function(el){return el;}).return;
            }
			return W.document.createElement(elem).opt(attrs || {});
		},
		addElem: function (args, attrs) {
			/**создать элемент в а.
			атрибуты:
			args-принимает строку "element" или объект
			если args- строка то будет создан один элемент c тегом, переданым в атрибут ("tag") и помещён в конец a
			если args- объект то будет создано количество элементов равное args.count(страндарт- 1) с тегом args.elem
			положение элемента при этом указываетс через свойство pos(то же, что и {pos:} в .pasteIn())
			attrs- принимает те же значения, что и .opt()
			 **/
			var a = this,
			count = args.count || 1,
			elem = args.elem || args,
			createdElem,
			CE = [];
			A.isEmpty(a) && A.error(A.errs.E_1);
			for (var i = 1; i <= count; i++) {
				createdElem = A.createElem(elem);
				createdElem.all(function(el,ind){
					el.pasteIn({
						in: a,
						pos: args.pos
					});
					attrs !== undefined && el.opt(attrs);
					CE.push(el);
				});
			}
			return CE.length>1?	CE : CE[0];
		},
		parent: function (step) {
			/**перейти на step родителей a вверх.
			стандартное значение step=1
			если step=elements, то переход осуществляется к указанному элементу-родителю
			если такого элемента нет среди родителей a (в обоих случаях), то возвращается false
			 **/
			var a = this.a(),
			step = step || 1,
			steptmp;
			A.isEmpty(a) && A.error(A.errs.E_1);
			if (step.__typeOfThis__ === "Number")
				for (var i = 1; (a = a.parentNode) && i < step; i++);
			else if (step.__typeOfThis__ === "String")
				step.all(function (el) {
					steptmp = a;
					while ((steptmp = steptmp.parentNode) && steptmp !== el);

				}),
				a = steptmp;
			else
				while ((a = a.parentNode) && a && !step(a));
			return a || false;
		},
		path: function get() {
			/**путь от элемента до window.
			возвращает массив, где каждый последующий элемент- родитель предыдущего.
			[a,elem1,elem2,...,document,window]
			 **/
			var a = this.a(),
			p = [a],
			tempP = a;
			while (tempP = tempP.parentNode) {
				p.push(tempP);
			}
			if (p[p.length - 1] !== W)
				p.push(W);
			return p;
		},
		remElem: function (el) {
			/**удалить дочерний элемент(el) a.
			если el отсутствует, то удаляется сам a
			 **/
			var a = this.a(),
			removed = false;
			A.isEmpty(a) && A.error(A.errs.E_1);
			if (!!arguments.length) {
				el = A(el).a();
				A.isEmpty(el) && A.error(A.errs.E_1);
				a.removeChild(el);
			} else {
				removed = a.parentNode;
				removed.removeChild(a);
			}
			return removed || a;
		},
		previousElement: function get() {
			/**возвращает предыдущий по элемент**/
			var a = this.a();
			A.isEmpty(a) && A.error(A.errs.E_1);
			while (a = a.previousSibling) {
				if (a.nodeType === 1) {
					return a;
				}
			}
			return null;
		},
        nextElement:function get(){
          	var a = this.a();
			A.isEmpty(a) && A.error(A.errs.E_1);
  		  	while (a = a.nextSibling) {
				if (a.nodeType === 1) {
					return a;
				}
			}
          	return null;
  		},
		end: function get() { /**возвращает последний элемент массива a **/
			var arr = this.a(!0);
			return arr[arr.length - 1];
		},
		all: function () {
			/**Итерирует массив или все элементы по селектору как .forEach()
			первый аргумент- callback-функция, получающая как аргументы текущий элемент и его индекс.
			второй- ключевое значение, при возврате которого callback'ом происходить break
			третий- значение для continue
			Возвращает объект {
			allEl: a, - сам итерируемый массив/ коллекция и т.д.
			return: массив всех return callback'а
			}
			 **/
			var a = this.a(!0),
			req = [],
			tmp,
			args = A.toArray(arguments);
			if (args.length > 1)
				for (var i = 0, len = a.length; i < len; i++) {
					req.push(tmp = args[0](a[i], i));
					if (tmp === args[1])
						break;
					if (tmp === args[2])
						continue;
				}
			else
				for (var i = 0, len = a.length; i < len; i++)
					req.push(args[0](a[i], i));
			return {
				allEl: a,
				return : req
			};
		},
		fined: function (vl, strict) {
			/**аналог indexOf.
			работает так же, только может искать ещё и массивы (только на первом уровне)
			если strict===true, то поиск учитывает порядок элементов в массиве
			 **/
			var a = this.a(!!1),
			eqArr = vl !== undefined && vl.almostArray;
			if (!eqArr)
				for (var i = 0, len = a.length; i < len; i++) {
					if (a[i] === vl)
						return i;
				}
			else {
				var tmp = -1;
				a.all(function (l, id) {
					if (vl.equals(l, strict)) {
						tmp = id;
						return "t";
					}
				}, "t");
				return tmp;
			}
			return -1;
		},
		equals: function (arr, strict) {
			/**сраванение массива a с массивом arr (независимо от расположение значений по порядку, если strict!==true).
			если значение толкьо одно, то arr может быть и не массивом.
			многомерные массивы только в strict.
			 **/
			var a = this.a(!!1),
			req = false,
			arr = arr.__typeOfThis__ === "Array" ? arr : [arr];
			a.length === arr.length && (
				req = true,
				strict ? (
					a.all(function (l, id) {
						if (l.__typeOfThis__ === "Array")
							req = l.equals(arr[id], true);
						else
							req = l === arr[id]
								if (!req)
									return "stop";
					}, "stop")) : (
					a.all(function (l) {
						if (arr.fined(l) < 0) {
							req = false;
							return "stop";
						}
					}, "stop")));
			return req;
		},
		countOf: function (vl, deep) {
			/**кол-во значений vl в массиве a.
			если deep=true(стандарт- false), то поиск будет вестись на всех уровнях
			 **/
			var a = this.a(!!1),
			c = 0;
          	deep = deep || false;
			deep ? a.all(function (l) {
				l === vl && c++;
				if (l.__typeOfThis__ === "Array")
					c += l.countOf(vl, true);
			}) : a.all(function (l) {
				l === vl && c++;
			});
			return c;
		},
		clearArr: function (vl) { /**очистить одномерный массив а от повторяющихся значений vl. **/
			var a = this.a(!!1);
			while (a.countOf(vl) > 1) {
				a.splice(a.fined(vl), 1);
			}
			return a;
		},
		clearArrFull: function get() { /**очистить одномерный массив а от ВСЕХ повторяющихся значений. **/
			var a = this.a(!!1),
			i = 0;
			while (i < a.length) {
				if (a.countOf(a[i]) > 1)
					a.splice(a.fined(a[i]), 1);
				else
					i++;

			}
			return a;
		},
		/**\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		\\+---------------------------------------------------------------+\\
		\\|Функции общего назначения                                      |\\
		\\+---------------------------------------------------------------+\\
		\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\**/
		start: function (func, NoWaitReturn) {
			/**аналог Promise.
			waiter={
			wait:function(callback,NoWaitReturn){...},- принимает функцию, которая выполнится по завершению выполнения func
			и получит как аргументы:
			значение, которое она вернула
			новый объект waiter (и так по цепочке далее)


			error:function(callback,NoWaitReturn){...},- принимает функцию, которая выполнится при ошибке выполнения func
			и получит как аргументы:
			ошибку
			новый объект waiter (и так по цепочке далее)

			arg:{
			changed:true/false, -true, если функция была завершена
			vl: ... -содержит значени, которое вернула функция
			},
			err:{
			changed:true/false, -true, если функция была завершена с ошибкой
			vl: ... - содержит значние ошибки
			},
			time:, -время завершения текущей функции (с ошибкой или без) в формате UNIX
			value:, - при установке любого значения func считается завершённой и возвратившей value
			errorValue: - при установке любого значения func считается завершённой с ошибкой и возвртившей ошибке errorValue
			}

			A.start принимает те же аргументы, что .wait и .error
			НО:
			callback получает как аргумент только объект waiter

			.wait, .error и A.start одинаково возвращают свой waiter

			NoWaitReturn- принимает true/false (стандарт- false).
			Если true, то следующая по цепочке функция выполнится ТОЛЬКО после прямого изменения waiter.value (waiter.error в любом случае будет выполнена при ошибке)
			 **/
			func = func || function (w, w2) {
				w2 ? (w2.value = 1) : (w.value = 1);
				return;
			};
			if(func.almostArray){
				console.log(3);
				var ret=[],
					count=0,
					len=func.length,
					er=false,
					tmpItem,
					erRet=[];
				func.all(function(item,i){
					tmpItem=item&&item.constructor===A.start?item:A.start(function(){
						return item;
					});
					tmpItem.error(function(vl){
						er=true;
						erRet[i]=vl;
						count++;
					});
					tmpItem.wait(function(vl){
						if(er)
							return;
						ret[i]=vl;
						count++;
					});
					console.log("gg>>",tmpItem);
				});
				return A.start(function(obj){
					(function interval(){
						if(count===len)
							return (obj[er?"errorValue":"value"]=er?erRet:ret);
						setTimeout(interval,0);
					})();
				},true);
			}
			var arg = {
				changed: false,
				vl: false
			},
			error = {
				changed: false,
				vl: false
			},
			progress = {
				changed: false,
				vl: false
			},
			mult = function (func, nwr, iserr, isprog) {
				var req = {
					fn: func
				};
				if (!req.fn || req.fn.__typeOfThis__ !== "Function")
					return;

				return A.start(function (obj) {
					var interval;
					if (iserr)
						interval = function () {
							if (arg.changed)
								return;

							if (error.changed) {
								if (!nwr)
									obj.value = req.fn(error.vl, obj);
								else
									req.fn(error.vl, obj);
								return;
							}

							return setTimeout(interval, 1);
						};
					else if (isprog)
						interval = function () {
							if (progress.changed) {
								if (!nwr)
									obj.value = req.fn(progress.vl, obj);
								else
									req.fn(progress.vl, obj);
								progress.changed = false;
								if (error.changed || arg.changed)
									return;
							}

							return setTimeout(interval, 0);
						};
					else
						interval = function () {
							if (error.changed)
								return;

							if (arg.changed) {
                              	var tmpWt;
								if (!nwr)
                                  	obj.value=req.fn(arg.vl, obj);
								else
									req.fn(arg.vl, obj);
								return;
							}

							return setTimeout(interval, 0);
						};
					interval();
				}, true);
			},
			waiter = {
				wait: function (fn, nwr) {
					var tmp;
					tmp = mult(fn, nwr, false);
					waiter.wt = true;
					return tmp;
				},
				error: function (fn, nwr) {
					var tmp;
					tmp = mult(fn, nwr, true);
					waiter.er = true;
					return tmp;
				},
				progress: function (fn, nwr) {
					var tmp;
					tmp = mult(fn, nwr, false, true);
					waiter.pr = true;
					return tmp;
				},
				wt: false,
				er: false,
				pr: false,
              	nwr: NoWaitReturn,
				arg: arg,
              	pro: progress,
				err: error,
				time: -1
			};
			W.Object.defineProperties(waiter, {
				value: {
					set: function (vl) {
                      	function _fn(vlW){
                          	arg.vl=vlW;
                        	arg.changed = true;
                        	waiter.time = Date.now();
                        }
                      	if(vl&&vl.constructor===A.start){
                          	vl.wait(function(vlW){
                            	_fn(vlW);
                            });
                          	vl.progress(function(vlW){
                              	waiter.progressValue=vlW;
                            });
                          	vl.error(function(vlW){
                              	waiter.errorValue=vlW;
                            });
                          	return;
                        }
                      	_fn(vl);
					}
				},
				errorValue: {
					set: function (vl) {
						function _fn(vlW){
                          	error.vl=vlW;
                        	error.changed = true;
                        	waiter.time = Date.now();
                        }
                      	vl&&vl.constructor===A.start?vl.wait(function(vlW){
                            _fn(vlW);
                        }):(_fn(vl));
					}
				},
				progressValue: {
					set: function (vl) {
						function _fn(vlW){
                          	progress.vl=vlW;
                        	progress.changed = true;
                        }
                      	vl&&vl.constructor===A.start?vl.wait(function(vlW){
                            _fn(vlW);
                        }):(_fn(vl));
					}
				}
			});
			setTimeout(function () {
				var tmp;
				try {
					tmp = func(waiter);
				} catch (err) {
					waiter.errorValue = err;
				}
				if (NoWaitReturn || arg.changed || error.changed)
					return;
				waiter.value=tmp;
			}, 0);
          	waiter.constructor=A.start;
			return waiter;
		},
		eGetElem: function (e) {
			return e.srcElement || e.target || e.toElement || e.fromElement || e.relatedTarget;
		},
		XHR: function () {
			/**
			вспомогательная функция для ajax()
			 **/
			try {
				return new W.ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					return new W.ActiveXObject("Microsoft.XMLHTTP");
				} catch (ee) {}
			}
			if (typeof W.XMLHttpRequest != 'undefined') {
				return new W.XMLHttpRequest();

			}
		},
		cPos: function (e) {
			/**обнаружить позицию курсора относительно scope(стандарт- client)
			возвращает объект {l:left,t:top};
			 **/
			e = e || W.event;
			var scope = 'client',
			type = A.isEmpty(e.changedTouches) && A.isEmpty(e.targetTouches) ? e : e.changedTouches[0] || e.targetTouches[0],
			r = {
				t: type[scope + 'Y'],
				l: type[scope + 'X']
			};
			return {
				t: r.t !== undefined ? r.t : "Y",
				l: r.l !== undefined ? r.l : "X"
			};
		},
		json: function (vl) { /**функция автоматически парсит строку vl или переводит в неё массивы и объекты**/
			var req;
			try {
				req = vl.__typeOfThis__ === "String" ? JSON.parse(vl) : JSON.stringify(vl);
			} catch (e) {
				req = vl;
			}
			return req;
		},
		args: function (standart, ins) {
			/**стандартные аргументы.
			функция принимает объект standart, где все свойства имеют стандартные заданные значения
			и заменяет нужные свойства на свойства из ins.
			возвращает изменённый standart
			 **/
			var ins = ins || {};
			standart.__typeOfThis__ !== "Object" && A.error(A.errs.E_2);
			if (ins.__typeOfThis__ === "Object")
				for (var nm in ins)
					ins[nm] !== undefined && (standart[nm] = ins[nm]);
			return standart;
		},
		ajax: function(args){/**ajax...
			принимает строку или объект
			если строка, то принимает только адрес файла к торому делается запрос
			если объект:{
			url: ссылка на файл,
			type: тип запроса(стандарт- "GET"),
			cache: включить кэширование запросов(true/false)(стандарт- false),
			header: заголовок запроса стандарт- "application/x-www-form-urlencoded",
			async: асинхронность(true/false)(стандарт-false),
			statuscode: объект вида {код_статуса_запроса:function}- выполняет функции при различных кодах(например, 404), передавая само тело XHR в арумент
			data: данные запроса, принимает строку (d=xxx) либо объект ({d:xxx}) (в случае с объектом FormData установит заголовок в соответствии со стандартами),
			success: callback функция, принимающая один параметр- ответ сервера(необязательно)
			}
			если была указана функция в succes, то .ajax() вернёт её return,
			если нет, то будет возвращён ответ сервера.
			 **/
        	var s=A.args({
            	url: args,
				type: "GET",
				cache: !1,
				header: "application/x-www-form-urlencoded",
				async: !1,
				dataType: "text",
				data: null,
				sucсess: null,
				upprogress: null,
				downprogress: null,
              	loadstart: null,
              	abort: null,
				error: null,
				load: null,
				timeout: null,
				loadend: null,
              	end: null,
				resCode: null
            },args),
                XHR=A.XHR(),
                tmp;
          
          	tmp = s.url && s.url.__typeOfThis__ === "String" ? s.url.trim() : "";
            tmp = tmp[0] === "?" ? W.location.pathname + tmp : tmp;
          	tmp += !s.cache ? ((tmp.indexOf('?') >= 0) ? '&' : '?') + '_=' + new Date().getTime() : "";
          	
          	s.url=tmp;
          	
          	switch(s.dataType){
              	case "json":
                	s.data=A.json(s.data);
                	s.header="application/json";
                	break;
              	case "form":
                	s.header="";
                	tmp=new W.FormData();
					s.data.all(function(vl){
						tmp.append(vl.name,vl.value);
					});
                	s.data=tmp;
            }
          	
          	XHR.open(s.type, s.url, s.async);
          	s.header && XHR.setRequestHeader("Content-type", s.header);
          
          	s.upprogress&&XHR.upload.addEventListener("progress",s.upprogress);
          	s.downprogress&&XHR.addEventListener("progress",s.downprogress);
          	s.loadstart&&XHR.addEventListener("loadstart",s.loadstart);
          	s.abort&&XHR.addEventListener("abort",s.abort);
          	s.error&&XHR.addEventListener("error",s.error);
          	s.load&&XHR.addEventListener("load",s.load);
          	s.timeout&&XHR.addEventListener("timeout",s.timeout);
			s.loadend&&XHR.addEventListener("loadend",s.loadend);
          	
          	var ended=false,
                end=function(e){
                  	if(ended)
                      	return;
                  	ended=true;
                  	s.end(e);
                };
          	s.end&&(
            	XHR.addEventListener("abort",end),
              	XHR.addEventListener("error",end),
              	XHR.addEventListener("timeout",end),
              	XHR.addEventListener("loadend",end)
            );
          	
          	tmp=A.start(function(obj){
              	XHR.addEventListener("readystatechange",function (e) {
					if(XHR.readyState === 4){
                       	s.resCode && s.resCode(XHR.status);
                      	s.end&&end(e);
                      	if(XHR.status === 200){
                          	var resp = s.dataType === "json" ? A.json(XHR.responseText) : XHR.responseText;
							obj.value = s.success ? s.success(resp) : resp;
                        }
                	}
				});
              	XHR.send(s.data);
            },true);
			return {
              	wait:tmp.wait,
              	XHR:XHR
            };
        },
      	include: function(type, urls, documentWrite){
      		var el,
                str;
          	if(!urls||!type||type.__typeOfThis__!=="String")
              	return;
          	urls=urls.almostArray?urls:[urls];
          	type=type.toLowerCase();
          	switch(type){
              	case "js":
                	str='<script src="@URL" type="text/javascript"></script>';
                	break;
                case "css":
                	str='<link rel="stylesheet" type="text/css" href="@URL"/>';
                	break;
              	case "js text":
                	str='<script type="text/javascript">@URL</script>';
                	break;
                case "css text":
                	str='<style>@URL</style>';
                	break;
            }
          	documentWrite=documentWrite===undefined?true:documentWrite;
    		urls.all(function(url){
				if(!url)
					return;
              	if(type==="txt text")
                  	return W.document.write(url);
              	if(documentWrite)
                  	W.document.write(str.replace(/@URL/gm, url));
                else
                  	A.createElem(str.replace(/@URL/gm, url)).pasteIn("head");
            });	
          
    	},
		toArray: function (obj, ind) {
			/**перевод объекта в массив.
			переводит объект в массив вида [val1,val2,val3]
			если ind=true, то вернёт массив вида [[property_name1,val1],[property_name2,val2],[property_name3,val3]]
			 **/
			var arr = [];
			if (!W.Array.isArray(obj))
				for (var el in obj) {
					arr.push(ind ? [el, obj[el]] : obj[el]);
				}
			else
				arr = obj;
			return arr;
		},
		isNumeric: function (n) {
			/**проверка n на число(проверяет как строку, так и любой другой тип).
			Возвращает true/false
			 **/
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		isEmpty: function (a) {
			/**проверить a на пустоту.
			пустотой будут считаться:
			undefined,
			null,{},
			[](Array,NodeList,HTMLCollection),
			""(пустая строка)
			возвращает true/false
			 **/
			var req = false,
			c;
			if (a !== undefined && a !== null) {
				switch (a.__typeOfThis__) {
				case "Object":
					req = !0;
					for (var v in a) {
						req = !1;
						break;
					}
					break;
				case "Array":
				case "NodeList":
				case "HTMLCollection":
					req = !a.length;
					break;
				case "String":
					req = !a;
					break;
				}
			} else
				req = !0;
			return req;
		},
		error: function (name, message, out, nothrow, ecode) {
			/**конструктор ошибок.
			name- имя ошибки,
			message- сообщение,
			out- если = true, то сообщение выводится в консоль,
			nothrow- если true, то вместо throw функция просто вернёт объект ошибки.
			ecode- код ошибки(добавляется в тело сгенерированной ошибки в свойтво ecode)), если значение пустое, то не добавится
			возвращает ошибку с данным именем и сообщением
			 **/
			var s = A.args({
					name: "betobe",
					message: "undefined error",
					out: !1,
					ecode: undefined,
					nothrow: !1
				}, name.__typeOfThis__ === "Object" ? name : {
					name: name,
					message: message,
					out: out,
					nothrow: nothrow,
					ecode: ecode
				});
			var er = function () {
				this.name = s.name;
				this.message = s.message;
				this.stack = (new Error).stack;
				this.ecode = s.ecode;
			};

			er.prototype = W.Object.create(Error.prototype);
			er.prototype.constructor = Error;

			s.out && console.error(s.name, ":", (s.ecode !== undefined ? s.ecode + " : " : "") + s.message, "\n\r" + (new Error).stack.split("\n").splice(2).join("\n\r"));
			if (s.nothrow)
				return new er();
			throw new er();
		},
		errs: { /**база со стандартными ошибками**/
			E_1: {
				name: "undefined Element",
				message: "function tries to access a non-existent element",
				ecode: "E_1",
				out: !0
			},
			E_2: {
				name: "TypeError",
				message: "variable is not an Object",
				ecode: "E_2",
				out: !0
			},
			E_3: {
				name: "TypeError",
				message: "variable is not an Array",
				ecode: "E_3",
				out: !0
			},
			E_4: {
				name: "TypeError",
				message: "variable is not an String",
				ecode: "E_4",
				out: !0
			}
		}
	});
	W.A.Ainit({
		_DATA: {
			opt_spec: {
				keys: ["_TXT", "_DOM", "_CSS", "_VAL", "_INIT", "_AFTER"],
				funcs: {
					_TXT: "html",
					_DOM: "DOMTree",
					_CSS: "css",
					_VAL: "val",
					_INIT: "callbackFun",
					_AFTER: "opt"
				}
			}
		},
		_TEMP: {
			dataModSeq: A.start(),
          	addJSSeq:A.start()
		}
	}, W);
})(window);
