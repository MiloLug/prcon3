var OP=window.opener;
window.Ainit({
	BUFFER:function get(){
      	return OP.BUFFER;
    },
  	OPUI:function get(){
      	return OP.UI;
    },
  	CUR_LANG:function get(){
      	return OP.CUR_LANG;
    },
  	PRCON_LANGUAGE_SAVE_NAME:function get(){
      	return OP.PRCON_LANGUAGE_SAVE_NAME;
    }
});