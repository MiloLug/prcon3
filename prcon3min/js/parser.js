window.Preprocess=function(t,r,a){for(var n,d,m={commandStart:-1,bodyStart:-1,end:-1},c=a.split(""),S={commandStart:r.start.split(""),bodyStart:r.bodyStart.split(""),end:r.end.split("")},o=function(t,r,a,n){m[n]=t;for(var d,o=1,e=S[n].length;d=S[n][o],o<e;o++){if(d!==c[a=t+o]){m[n]=-1;break}m[n]=a}return a},e=0,l=c.length;(n=c[e],(d=e)<l)&&!(-1<m.commandStart&&-1<m.bodyStart&&-1<m.end);e++)n===S.end[0]&&-1<m.bodyStart?e=o(e,0,d,"end"):n===S.bodyStart[0]&&-1<m.commandStart?e=o(e,0,d,"bodyStart"):n===S.commandStart[0]&&m.bodyStart<0&&(e=o(e,0,d,"commandStart"));return-1<m.commandStart&&-1<m.bodyStart&&-1<m.end?(m.body=c.slice(m.bodyStart+1,m.end+1-S.end.length).join(""),m.command=c.slice(m.commandStart+1,m.bodyStart-S.bodyStart.length+1).join("").trim(),m.full=c.slice(m.commandStart-S.commandStart.length+1,m.end+1).join(""),m.prepr=Preprocess(t,r,m.body),m.return=t[m.command]?t[m.command](m.prepr):m.prepr,m.repl=a.replace(m.full,m.return),Preprocess(t,r,m.repl)):a};