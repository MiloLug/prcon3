var PATH = function (url, errFun) {
	var phpUrl = function () {
		return ACCOUNT.ftp ? ACCOUNT.urlPhp : ACCOUNT.login;
	},
	obj = {
		common: function (name, args, files) {
			var s = A.args({
					url: url
				}, args),
			notUrl = url === undefined,
			wt = A.start(function (w) {
					var data = [{
							name: "query",
							value: A.json({
								acc: ACCOUNT,
								funcs: notUrl ? [{
										name: name,
										args: args
									}
								] : [{
										name: "ifEqual",
										args: {
											if : [{
													name: "isAvailable",
													args: {
														url: url
													},
													return : {
														type: "self"
													},
													equal: true
												}
											],
											then: [{
													name: name,
													args: s
												}
											]
									}
								}
							]
						})
					}
				];
				if(files&&files.length)
					files.all(function(file){
						data.push({
							name:"files[]",
							value:file
						});
					});
				w.XHR = A.ajax({
						url: phpUrl(),
						type: "POST",
						async: true,
						dataType: "form",
						data: data,
						downprogress: function (prog) {
							w.progressValue = {
								type: "down",
								data: prog
							};
						},
						upprogress: function (prog) {
							w.progressValue = {
								type: "up",
								data: prog
							};
						},
						abort: function (prog) {
							w.progressValue = {
								type: "abort",
								data: prog
							};
							w.value=0;
						},
						timeout: function (prog) {
							w.progressValue = {
								type: "timeout",
								data: prog
							};
							w.value=0;
						},
						success: function (d) {
							d = A.json(d);
							w.progressValue = {
								type: "success",
								data: d
							};
							if (d.error.length > 0) {
								console.log(d);
								errFun && errFun(d.error);
								w.value = 0;
								return;
							}
							if (!notUrl && d.req[0].type !== "then") {
								errFun && errFun(["wrong path"]);
								w.value = 0;
								return;
							}
							w.value = (notUrl ? d.req : d.req[0].return);
						},
						resCode: function (c) {
							w.progressValue = {
								type: "resCode",
								data: c
							};
							c === 404 && (w.value = 0, errFun && errFun(["not main"]));
						},
						error: function (e) {
							errFun && errFun(["net err"]);
							w.progressValue = {
								type: "error",
								data: e
							};
							w.value = 0;
						}
					}).XHR;
			}, true);
		wt.error(console.error);
		return wt;
	},
	arrUrl: function () {
		return url.split("/").weed(function (e) {
			return e !== "";
		});
	},
	fixUrl: function () {
		var tmp = obj.arrUrl().weed(function (e) {
				return e !== ".";
			}),
			newUrl = [],
			endItem = "";
		tmp.all(function(item,n){
			if(n>0 && item === ".." && newUrl.length>1 && endItem !== ".."){
				newUrl.pop();
				return;
			}
			
			newUrl.push(item);
			endItem = item;
		});
		return newUrl.join("/") + "/";
	},
	divNameExt: function () {
		var name = obj.arrUrl().pop(),
		r = "",
		e = "",
		nm,
		count;
		name = name.split(".");
		if (name.length < 2)
			return name;
		while ((count = name.length) > 0) {
			nm = name.shift(),
			count = name.length;
			if (count < 1) {
				e = nm;
			} else {
				r += nm;
				if (count > 1)
					r += ".";
			}
		}
		return [r, e];
	}
};
Object.defineProperties(obj, {
	url: {
		get: function () {
			return url;
		}
	},
	parentDir: {
		get: function () {
			var parent = obj.arrUrl();
			parent.pop();
			return PATH(parent).url;
		}
	},
	name: {
		get: function () {
			return obj.arrUrl().end;
		}
	}
});
if (url instanceof Array)
	url = url.join("/"),
	url = obj.fixUrl();
return obj;
};
