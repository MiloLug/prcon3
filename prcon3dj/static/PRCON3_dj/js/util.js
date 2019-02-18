var ACCOUNT={
    	login:"",
		password:"",
    	name:"",
      	ftp:false,
      	urlFtp:"",
      	urlPhp:""
    },
    SETTINGS_DECLARE=[],
    N_SETTINGS=function(){
      	var t=this;
      	t.I={};
      	SETTINGS_DECLARE=[];
      	TEMP_SETTINGS_DECLARE.all(function(dec){
          	var newDec={},
                tmpObj={};
          	for(var nm in dec){
              	if(dec[nm].constructor===Object&&dec[nm]._InitClass){
                  	tmpObj[nm]=dec[nm]._InitClass;
                  	newDec.Ainit(tmpObj);
                  	continue;
                }
              	newDec[nm]=dec[nm];
            }
          	SETTINGS_DECLARE.push(newDec);
		});
      	SETTINGS_DECLARE.all(function(dec){
          	var newDec=dec.param;
		  	if(!newDec)return;
		  	if(newDec.iteration)
		    	t.I[newDec.name]=newDec.def;
		  	else
		      	t[newDec.name]=newDec.def;
        });
    },
	E_SETTINGS=function(){
		var t=window.BUFFER.localData.settings;
      	t.I=t.I||{};
      	SETTINGS_DECLARE=[];
      	TEMP_SETTINGS_DECLARE.all(function(dec){
          	var newDec={},
                tmpObj={};
          	for(var nm in dec){
              	if(dec[nm].constructor===Object&&dec[nm]._InitClass){
                  	tmpObj[nm]=dec[nm]._InitClass;
                  	newDec.Ainit(tmpObj);
                  	continue;
                }
              	newDec[nm]=dec[nm];
            }
          	SETTINGS_DECLARE.push(newDec);
		});
      	SETTINGS_DECLARE.all(function(dec){
          	var newDec=dec.param;
		  	if(!newDec)return;
		  	if(newDec.iteration)
		    	t.I[newDec.name]=t.I[newDec.name]!==undefined?t.I[newDec.name]:newDec.def;
		  	else
		      	t[newDec.name]=t[newDec.name]!==undefined?t[newDec.name]:newDec.def;
        });
	},
    N_LOCAL=function(){
      	var t=this;
    	t.accounts= {
     	  	name:[],
     	  	login:[],
     	  	password:[],
    		ftp:[],
    		urlPhp:[],
    		urlFtp:[],
          	portFtp:[],
    		data:{
     	      	explorer:{}
     	    }
     	},
		t.settings = new N_SETTINGS(),
        t.version=VERSION,
        t.UIStatics={
          	resizePanels:{}
        };
    },
    N_BUFFER=function(){
      	this.localData= new N_LOCAL(),
		this.explorer={
          	back:[],
          	copied:[],
			copiedCut:false,
			forward:[],
          	curDir:"@ROOT:",
          	tree:{
              	"@ROOT:":{
                  	type: "dir",
					list: {},
					opened: false,
                    parent: null,
                    url: "@ROOT:"
                }
            }
    	},
        this.downloads = {},
		this.redactors = {},
        this.windows= {
			viewInReload: {},
			redactors: {}
		},
      	this.loadprocess={
          	reloadDownloads:A.start(function(){},true),
          	openDir:A.start(),
          	reloadTree:A.start(),
			setHash:A.start()
        };
    },
	BUFFER = new N_BUFFER(),
	BUFFERToLocal = function () {
      	if(ACCOUNT.name!=="")
        	BUFFER.localData.accounts.data.explorer[ACCOUNT.name]=BUFFER.explorer;
		localStorage.setItem(PRCON_LOCAL_STORAGE_NAME, A.json(BUFFER.localData));
	},
	localToBUFFER = function () {
		BUFFER.localData = A.json(localStorage.getItem(PRCON_LOCAL_STORAGE_NAME)),
      	BUFFER.explorer = BUFFER.localData.accounts.data.explorer[ACCOUNT.name]||(new N_BUFFER).explorer;
	},
    clearLocal=function(){
      	localStorage.setItem(PRCON_LOCAL_STORAGE_NAME, A.json(new N_LOCAL()));
      	localToBUFFER();
		localStorage.removeItem(PRCON_LANGUAGE_SAVE_NAME),
      	localStorage.removeItem(PRCON_REDACTOR_CURRENT_NAME),
      	window.location.reload();
    },
    getAccRow=function(name){
      	var pos=-1,
            cur;
      	BUFFER.localData.accounts.name.all(function(nm,i){
        	if(nm===name){
            	pos=i;
              	return "break";
            }
        },"break");
      	cur=BUFFER.localData.accounts;
      	return {
          	index:pos,
          	row:{
              	name:name,
              	login:cur.login[pos],
              	password:cur.password[pos],
          		ftp:cur.ftp[pos],
          		urlPhp:cur.urlPhp[pos],
          		urlFtp:cur.urlFtp[pos],
              	portFtp:cur.portFtp[pos]
            }
        };
    },
    setAccount=function (name,ftp, log, pass, urlPhp, urlFtp, portFtp){
      	UI.closeAll();
      	if(name.constructor===Object)
      		for(var k in name){
              	ACCOUNT[k]=name[k];
            }
        else	
          	ACCOUNT.ftp=ftp,
        	ACCOUNT.login=log,
        	ACCOUNT.password=pass,
        	ACCOUNT.urlPhp=urlPhp,
        	ACCOUNT.urlFtp=urlFtp,
        	ACCOUNT.name=name,
      		ACCOUNT.portFtp=portFtp;
      	localToBUFFER();
      	UI.parseTree();
      	UI.openDir(false,false,"stay");
    },
    objWalk=function(obj,path,inc,woutend){
	  	var cur=obj;
	  	path.all(function(p,ind){
	      	if(cur===undefined||!(p in cur)){
	          	cur=undefined;
	          	return "break";
	        }
	        cur=cur[p];
          	if(inc&&(woutend?ind!==(path.length-1):true))
              	cur=objWalk(cur,inc);
	    },"break");
	  	return cur;
	},
    applySettings=function(){
      	var data=BUFFER.localData.settings;
       	"body".opt(data.I);
    },
    b64toBlob=function (b64Data, contentType, sliceSize) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, {
				type: contentType
			});
		return blob;
	},
	BlobToB64=function(blob){
		return A.start(function(obj){
			var reader = new FileReader();
 			reader.onloadend = function() {
				obj.value=reader.result;                	
 			}
			reader.readAsDataURL(blob);
		});
	},
	getFile=function(content, name, mime){
		var tt=Object.__typeOf__(content),
			blobUrl,
			a;
		switch(tt){
			case "undefined":
				return false;
				break;
			case "String":
				blobUrl = window.URL.createObjectURL(new Blob([content],{type:mime}));
				break;
			case "Blob":
				blobUrl = window.URL.createObjectURL(content);
				break;
			default:
				blobUrl = window.URL.createObjectURL(new Blob(content,{type:mime}));
		}
		a = "body".addElem("a",{
		    href:blobUrl,
		    download:name
		});
		a.click();
		setTimeout(function() {
		    a.remElem();
		    window.URL.revokeObjectURL(blobUrl);  
		}, 0);
		return true;
	},
	queryFiles=(function(){
		var tmp,
			clbc,
			lis=function(){
				clbc(tmp.files);
				tmp.removeEventListener("input",lis);
				tmp.remove&&tmp.remove();
			};
		return function(callback, multiple, accept){
			tmp&&tmp.removeEventListener("input",lis);
			tmp&&tmp.remove&&tmp.remove();
			tmp=A.createElem('input',{
				type:"file",
				accept:accept||"",
				multiple:multiple?"true":""
			});
			clbc=callback;
			tmp.addEventListener("input",lis);
			tmp.click();
		};
	})(),
	pendTo=function(fn){
		var tmp;
		return A.start(function(obj){
			(function interval(){
				if(!(tmp=fn()))
					return setTimeout(interval,0);
				obj.value=tmp;
			})();
		},true);
	};
  	
/*SET localStorage AND BUFFER localData*/
(function(){
var tmp;
if (!localStorage.getItem(PRCON_LOCAL_STORAGE_NAME)||A.isEmpty(tmp=A.json(localStorage.getItem(PRCON_LOCAL_STORAGE_NAME)))||(VERSION>0?tmp.version!==VERSION:false))
	localStorage.setItem(PRCON_LOCAL_STORAGE_NAME, A.json(new N_LOCAL()));
localToBUFFER();
})();
/*END*/

/*BACK AND FORWARD*/
if(window.history&&BUFFER.localData.settings.enableUseBrowserBFBtns)
  	history.pushState("back", document.title, location.href),
    history.pushState("stay", document.title, location.href),
    history.pushState("forward", document.title, location.href),
    history.back(),
    window.addEventListener('popstate', function (e){
      	if(e.state==="back")
          	history.forward(),
            UI.goBack();
        else if(e.state==="forward")
          	history.back(),
            UI.goForward();
	});
/*END*/

/*HASH CHECK*/
(function(){
	window.addEventListener("hashchange",function(){
		BUFFER.loadprocess.setHash = BUFFER.loadprocess.setHash.wait(function(v,o){
			if(v==="setJS")
				return (o.value=true);
			console.log(33);
			pendTo(function(){
				return window.UI.openDir;
			}).wait(function(f){
				f(false,window.location.hash.substr(1));
				o.value=true;
			});
		},true);
	});
})();
/*END*/

/*ON PAGE UNLOAD*/
window.addEventListener("unload", BUFFERToLocal,false);
window.addEventListener("beforeunload", BUFFERToLocal,false);
window.addEventListener("unload",function(){
      	window.UI.closeAll();
    },false);
/*END*/