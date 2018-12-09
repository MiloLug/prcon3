window.LANG_LIST=A.ajax({
  	url:"langs.json",
  	async:true,
  	dataType:"json"
}),
window.CUR_LANG=window.CUR_LANG||localStorage.getItem(PRCON_LANGUAGE_SAVE_NAME)||"en.js";
document.write("<script src='js/lang/"+CUR_LANG+"'></script>");