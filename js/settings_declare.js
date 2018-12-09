var TEMP_SETTINGS_DECLARE=[
      	{
 	      	type:"select",
 	      	options:{
              	_InitClass:function get(){
                  	return window.FILE_REDACTORS_INIT?Object.keys(window.FILE_REDACTORS_INIT):[];
                }
            },
          	group:"file editor".tr,
 	      	realtime:false,
          	compareBy:"value",
 	      	info:"select file editor".tr,
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
 	      	type:"select",
 	      	options:[
				"in new window".tr,
				"in explorer window".tr
			],
          	group:"file editor".tr,
          	compareBy:"selectedIndex",
 	      	realtime:true,
 	      	info:"file editor type".tr,
 	      	param:{
				name:"defaultFileEditorType",
 	          	def:1,
 	          	iteration:false
 	        }
 	    },
 	  	{
 	      	type:"checkbox",
 	      	chctext:"show back and forward buttons".tr,
          	group:"explorer".tr,
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
 	      	chctext:"show path".tr,
 	      	group:"explorer".tr,
 	      	realtime:true,
 	      	info:"show path row".tr,
 	      	param:{
 	          	name:"showPathRow",
 	          	def:true,
 	          	iteration:true
 	        }
 	    },
 	  	{
 	      	type:"checkbox",
 	      	chctext:"show tree".tr,
 	      	group:"explorer".tr,
 	      	realtime:true,
 	      	info:"",
 	      	param:{
 	          	name:"showLeftExplorer",
 	          	def:true,
 	          	iteration:true
 	        }
 	    },
      	{
 	      	type:"checkbox",
 	      	chctext:"always show controls".tr,
 	      	group:"explorer".tr,
 	      	realtime:true,
 	      	info:"show file tree controls".tr,
 	      	param:{
 	          	name:"showLeftExplorerControls",
 	          	def:false,
 	          	iteration:true
 	        }
 	    },
 	  	{
 	      	type:"checkbox",
 	      	chctext:"use browser buttons".tr,
 	      	group:"explorer".tr,
 	      	realtime:false,
 	      	info:"browser control path".tr,
 	      	param:{
 	          	name:"enableUseBrowserBFBtns",
 	          	def:true,
 	          	iteration:false
 	        }
 	    },
 	  	{
 	      	type:"checkbox",
 	      	chctext:"show account save message".tr,
 	      	group:"other".tr,
 	      	realtime:false,
 	      	info:"suggest save account".tr,
 	      	param:{
 	          	name:"showAccountSaveMessage",
 	          	def:true,
 	          	iteration:false
 	        }
 	    },
      	{
 	      	type:"button",
 	      	btntext:"clear local data".tr,
          	funcs:"clearLocal",
          	realtime:true,
 	      	group:"other".tr,
 	      	info:"clear all data".tr,
 	    },
  		{
 	      	type:"button",
 	      	btntext:"change language".tr,
          	funcs:"langSet",
          	realtime:false,
 	      	group:"other".tr,
 	      	info:"",
 	    }
 	];