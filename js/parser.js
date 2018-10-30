window.Preprocess=function(commands,punctuation,txt){
	var req={
      		start:-1,
      		commandStart:-1,
      		commandEnd:-1,
      		bodyStart:-1,
      		bodyEnd:-1,
      		end:-1,
      		body:"",
      		command:"",
      		full:""
    	},
    	starts=0,
        ends=0,
        splittxt=txt.split(""),
        pn={
          	commandStart:punctuation.commandStart.split(""),
          	bodyStart:punctuation.bodyStart.split(""),
          	end:punctuation.end?punctuation.end.split(""):undefined
        };
  
  	root:for(var i=0,len=splittxt.length,s;(s=splittxt[i],i<len);i++){
      	if(pn.end&&s===pn.end[0]&&req.bodyStart>-1)
          	for(var i2=0,len2=pn.end.length-1,s2;(s2=pn.end[i2],i2<=len2);i2++){
              	if(s2!==splittxt[i+i2])
                  	break;
              	if(i2===len2){
                  	req.bodyEnd=i-1,
                  	req.end=i+i2;
                  	ends++;
                  	i+=i2;
                  	continue root;
                }
            }
      	if(s===pn.bodyStart[0]&&req.commandStart>-1)
          	for(var i2=0,len2=pn.bodyStart.length-1,s2;(s2=pn.bodyStart[i2],i2<=len2);i2++){
              	if(s2!==splittxt[i+i2])
                  	break;
              	if(i2===len2){
                  	req.bodyStart<0&&(
                      	req.commandEnd=i-1,
                      	req.bodyStart=i+i2+1);
                  	!pn.end&&(req.end=i+i2);
                  	starts++;
                  	i+=i2;
                  	continue root;
                }
            }
      	if(s===pn.commandStart[0]&&req.bodyStart<0)
          	for(var i2=0,len2=pn.commandStart.length-1,s2;(s2=pn.commandStart[i2],i2<=len2);i2++){
              	if(s2!==splittxt[i+i2])
                  	break;
              	if(i2===len2){
                  	req.commandStart=i+i2+1;
                  	req.start=i;
                  	i+=i2;
                  	continue root;
                }
            }
      	if(ends===starts&&ends>0)
          	break;
    };
  	
  	if(req.start<0)
      	return txt;
  	
  	for(var i=req.start,len=req.end,s;(s=splittxt[i],i<=len);i++){
    	req.full+=s;
      	if(i>=req.commandStart&&i<=req.commandEnd)
          	req.command+=s;
      	if(i>=req.bodyStart&&i<=req.bodyEnd)
          	req.body+=s;
    }
  	return Preprocess(commands,punctuation,txt.replace(req.full,commands[(pn.end?req.command.trim():"command")](pn.end?Preprocess(commands,punctuation,req.body):req.command)));
};