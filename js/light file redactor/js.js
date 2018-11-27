var OP=window.opener;
window.Ainit({
	BUFFER:function get(){
      	return OP.BUFFER;
    },
  	OPUI:function get(){
      	return OP.UI;
    }
});
