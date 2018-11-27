var ACCOUNT={
    	login:"",
		password:"",
    	name:"",
      	ftp:false,
      	urlFtp:"",
      	urlPhp:""
    },
    STORAGE_NAME="PRCON_DATA",
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
    N_LOCAL=function(){
      	var t=this;
    	t.accounts= {
     	  	name:[],
     	  	login:[],
     	  	password:[],
    		ftp:[],
    		urlPhp:[],
    		urlFtp:[],
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
		this.redactors = {},
        this.windows= {
			viewInReload: {},
			redactors: {}
		},
      	this.loadprocess={
          	openDir:A.start(),
          	reloadTree:A.start()
        };
    },
	BUFFER = new N_BUFFER(),
	BUFFERToLocal = function () {
      	if(ACCOUNT.name!=="")
        	BUFFER.localData.accounts.data.explorer[ACCOUNT.name]=BUFFER.explorer;
		localStorage.setItem(STORAGE_NAME, A.json(BUFFER.localData));
	},
	localToBUFFER = function () {
		BUFFER.localData = A.json(localStorage.getItem(STORAGE_NAME)),
      	BUFFER.explorer = BUFFER.localData.accounts.data.explorer[ACCOUNT.name]||(new N_BUFFER).explorer;
	},
    clearLocal=function(){
      	localStorage.setItem(STORAGE_NAME, A.json(new N_LOCAL()));
      	localToBUFFER();
      	window.location.reload();
    },
    getAccRow=function(name){
      	var pos=-1;
      	BUFFER.localData.accounts.name.all(function(nm,i){
        	if(nm===name){
            	pos=i;
              	return "break";
            }
        },"break");
      	return {
          	index:pos,
          	row:{
              	name:name,
              	login:BUFFER.localData.accounts.login[pos],
              	password:BUFFER.localData.accounts.password[pos],
          		ftp:BUFFER.localData.accounts.ftp[pos],
          		urlPhp:BUFFER.localData.accounts.urlPhp[pos],
          		urlFtp:BUFFER.localData.accounts.urlFtp[pos]
            }
        };
    },
    setAccount=function (name,ftp, log, pass, urlPhp, urlFtp){
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
        	ACCOUNT.name=name;
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
    };
  	
/*SET localStorage AND BUFFER localData*/
(function(){
var tmp;
if (!localStorage.getItem(STORAGE_NAME)||A.isEmpty(tmp=A.json(localStorage.getItem(STORAGE_NAME)))||(VERSION>0?tmp.version!==VERSION:false))
	localStorage.setItem(STORAGE_NAME, A.json(new N_LOCAL()));
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

/*ON PAGE UNLOAD*/
window.addEventListener("unload", BUFFERToLocal,false);
/*END*/