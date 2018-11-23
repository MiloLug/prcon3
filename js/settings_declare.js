var TEMP_SETTINGS_DECLARE=[
      	{
 	      	type:"select",
 	      	options:{
              	_InitClass:function get(){
                  	return window.FILE_REDACTORS_INIT?Object.keys(window.FILE_REDACTORS_INIT):[];
                }
            },
          	group:"file editor",
 	      	realtime:false,
 	      	info:"select file editor",
 	      	param:{
 	          	_InitClass:function get(){
                  	return {
                      	name:"fileEditor",
 	          			def:window.FILE_REDACTORS_INIT?Object.keys(window.FILE_REDACTORS_INIT)[0]:"",
 	          			iteration:false
                    }
                }
 	        }
 	    },
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
 	      	chctext:"always show controls",
 	      	group:"explorer",
 	      	realtime:true,
 	      	info:"always show arrows and other buttons in left explorer (in file tree)",
 	      	param:{
 	          	name:"showLeftExplorerControls",
 	          	def:false,
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
 	    }
 	];