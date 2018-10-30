var ACCOUNT={
    	login:"",
		password:"",
    	name:"",
      	ftp:false,
      	urlFtp:"",
      	urlPhp:""
    },
    VERSION=3.5,
    SETTINGS_DECLARE=[
 	  	{
 	      	type:"checkbox",
 	      	chctext:"show back and forward buttons",
          	group:"path row",
 	      	realtime:true,
 	      	info:"",
 	      	param:{
 	          	name:"showBFBtns",
 	          	def:true,
 	          	iteration:true
 	        }
 	    },
 	  	{
 	      	type:"checkbox",
 	      	chctext:"show path",
 	      	group:"path row",
 	      	realtime:true,
 	      	info:"show the panel with the path to the folder",
 	      	param:{
 	          	name:"showPathRow",
 	          	def:true,
 	          	iteration:true
 	        }
 	    },
 	  	{
 	      	type:"checkbox",
 	      	chctext:"show left explorer",
 	      	group:"explorer",
 	      	realtime:true,
 	      	info:"show panel with file tree",
 	      	param:{
 	          	name:"showLeftExplorer",
 	          	def:true,
 	          	iteration:true
 	        }
 	    },
 	  	{
 	      	type:"checkbox",
 	      	chctext:"use browser buttons",
 	      	group:"explorer",
 	      	realtime:false,
 	      	info:"use the browser buttons 'forward' and 'back' to control the explorer",
 	      	param:{
 	          	name:"enableUseBrowserBFBtns",
 	          	def:true,
 	          	iteration:false
 	        }
 	    },
 	  	{
 	      	type:"checkbox",
 	      	chctext:"show account save message",
 	      	group:"other",
 	      	realtime:false,
 	      	info:"suggest saving account in local storage",
 	      	param:{
 	          	name:"showAccountSaveMessage",
 	          	def:true,
 	          	iteration:false
 	        }
 	    },
      	{
 	      	type:"button",
 	      	btntext:"clear local data",
          	funcs:"clearLocal",
          	realtime:true,
 	      	group:"local storage",
 	      	info:"clear all data(accounts, settings etc) in local storage",
 	    },
      	{
 	      	type:"input",
 	      	inptext:"zadeklariroval input",
          	inptype:"number",
 	      	group:"gother",
 	      	realtime:false,
 	      	info:"ggvp",
 	      	param:{
 	          	name:"govoracovora",
 	          	def:123,
 	          	iteration:false
 	        }
 	    },
 	],
    N_SETTINGS=function(){
      	var t=this;
      	t.I={};
      	SETTINGS_DECLARE.all(function(dec){
		  	dec=dec.param;
		  	if(!dec)return;
		  	if(dec.iteration)
		    	t.I[dec.name]=dec.def;
		  	else
		      	t[dec.name]=dec.def;
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
        t.version=VERSION;
    },
    N_BUFFER=function(){
      	this.localData= {},
		this.explorer={
          	back:[],
			forward:[],
          	selected:[],
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
	UID = {
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
	},
	BUFFERToLocal = function () {
      	if(ACCOUNT.name!=="")
        	BUFFER.localData.accounts.data.explorer[ACCOUNT.name]=BUFFER.explorer;
		localStorage.setItem("PRCON", A.json(BUFFER.localData));
	},
	localToBUFFER = function () {
		BUFFER.localData = A.json(localStorage.getItem("PRCON")),
      	BUFFER.explorer = BUFFER.localData.accounts.data.explorer[ACCOUNT.name]||(new N_BUFFER).explorer;
	},
    clearLocal=function(){
      	localStorage.setItem("PRCON", A.json(new N_LOCAL()));
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
if (!localStorage.getItem("PRCON")||A.isEmpty(tmp=A.json(localStorage.getItem("PRCON")))||tmp.version!==VERSION)
	localStorage.setItem("PRCON", A.json(new N_LOCAL()));
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