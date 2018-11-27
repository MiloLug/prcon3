var PATH = function (url, errFun) {
	var phpUrl = function () {
		return ACCOUNT.ftp ? ACCOUNT.urlPhp : ACCOUNT.login;
	},
	obj = {
		common: function (name, args) {
			var s = A.args({
					url: url
				}, args),
			notUrl = url === undefined;
			var wt = A.start(function (w) {
					A.ajax({
						url: phpUrl(),
						type: "POST",
						async: true,
						dataType: "json",
						data: {
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
					},
					success: function (d) {
						if (d.error.length > 0) {
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
						c === 404 && (w.value = 0, errFun && errFun(["not main"]));
					},
					error: function () {
						errFun && errFun(["net err"]);
						w.value = 0;
					}
				});
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
			});
		return tmp.join("/") + "/";
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
	name:{
		get: function (){
			return obj.arrUrl().end;
		}
	}
});
if (url instanceof Array)
	url = url.join("/"),
	url = obj.fixUrl();
return obj;
};
