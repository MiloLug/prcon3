var PATH = function (url, errFun) {
	var phpUrl = function () {
		return ACCOUNT.ftp ? ACCOUNT.urlPhp : ACCOUNT.login;
	},
	obj = {
		common: function (name,args) {
			return obj.isAvailable().wait(function (isAv, w) {
				if (isAv !== 1) {
					w.value = 0;
					return;
				}
              	var s=A.args({
                  	url:url
                },args);
				A.start(function (arg) {
					A.ajax({
						url: phpUrl(),
						type: "POST",
						async: true,
						dataType: "json",
						data: {
							acc: ACCOUNT,
							funcs: [{
									name: name,
									args: s
								}
							]
						},
						success: function (d) {
							if (d.error.length > 0) {
								errFun && errFun(d.error);
								w.value = 0;
								return;
							}
							w.value = d.req;
						},

						resCode: function (c) {
							c === 404 && (w.value = 0, errFun && errFun(["not main"]));
						},
						error: function () {
							errFun && errFun(["net err"]);
							w.value = 0;
						}
					});
				});
			},true);
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
		},
		isAvailable: function () {
			return A.start(function (w) {
				A.ajax({
					url: phpUrl(),
					type: "POST",
					async: true,
					dataType: "json",
					data: {
						acc: ACCOUNT,
						funcs: [{
								name: "isAvailable",
								args: {
									url: url
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
						if (!d.req[0]) {
							errFun && errFun(["wrong path"]);
							w.value = 0;
							return;
						}
						w.value = 1;
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
		}
	};
  	Object.defineProperties(obj,{
    	url:{
        	get:function(){
              	return url;
            } 
        },
      	parentDir:{
          	get:function(){
              	var parent = obj.arrUrl();
				parent.pop();
				return PATH(parent).url;
            }
        }
    });
  	if(url instanceof Array)
      	url=url.join("/"),
        url=obj.fixUrl();
	return obj;
};
