from json import loads as json_decode, dumps as json_encode
import os
from struct import pack as str_pack
from io import BytesIO
from django.http import QueryDict
from ftplib import FTP as FTP_, error_perm as FTP_er_perm,  all_errors as FTP_er_all
from django.conf import settings
from magic import from_buffer as magic_from_buffer, from_file as magic_from_file
from base64 import b64encode
B_DIR = settings.BASE_DIR.replace("\\","/")

class reader():
	def __init__(self):
		self.data = ""
	def __call__(self,s):
		self.data += s.decode("utf-8")

def req(request):
	if not (request.is_ajax() or request.method == 'POST'):
		return "{}"

	PASS    = "111"

	error   = []
	req     = []
	ftpcon  = False
	FTP     = False
	data    = json_decode(request.POST.get("query","{}"))
	acc     = data.get("acc",{})
	files   = QueryDict("", mutable=True)
	files.update(request.FILES)
	files   = files.get("files",[])
	
	def _echo ():
		return json_encode({
			"req":req,
			"error":error
		})
	
	def du(d):
		return d if isinstance(d, dict) else {
			"url" : d
		}

	if not "password" in acc:
		error.append("no password")
		return _echo()
	
	if acc.get("ftp",False):
		FTP = True
	elif acc["password"] != PASS:
		error.append("wrong password")
		return _echo()

	if acc.get("urlFtp",False) and FTP:
		if not acc.get("login", False):
			error.append("no ftp login")
			return _echo()

		port=int(acc.get("portFtp",21))

		ftpcon = FTP_()
		ftpcon.connect(acc["urlFtp"],port)

		#if (!$ftpcon)
		#	$error[] = "ftp con err";
		
		ftpcon.login(acc["login"], acc["password"])
		ftpcon.encoding = 'utf-8'
		ftpcon.set_pasv(True)
		ftpcon.cwd("/")

	if not data.get("funcs",False):
		error.append("no funcs")
		return _echo()

	class FNS:
		def login (self, args):
			return 1
		def gUrl(self, args):
			if isinstance(args, str):
				return args
			else:
				return du(args).get("url","")

		def fixBSlash(self, args):
			return self.gUrl(args).replace("\\","/")

		def normUrl(self, args, fftp = False):
			lftp = False if fftp else FTP

			url = self.gUrl(args).replace("@ROOT:", "" if lftp else B_DIR)
			if len(url)>0 and url[len(url) - 1] == "/":
				url = url[0:-1]
				
			return url

		def shortUrl(self, args, fftp = False):
			lftp = False if fftp else FTP
			
			url = self.gUrl(args)
			if not lftp:
				url = url.replace(B_DIR, "")
				url = "@ROOT:" + (url if url[0] == "/" else "/" + url)
			else:
				url = "@ROOT:" + (url if url[0] == "/" else "/" + url)
			return url

		def isParentOf(self, args, fftp = False):
			args = du(args)

			url   = self.arrUrl(self.normUrl(args, fftp), fftp)
			child = self.arrUrl(self.normUrl(args.get("child",""), fftp), fftp)
			i     = 0
			clen  = len(child)
			ulen  = len(url)

			while i < clen:
				if child[i] != url[i]:
					return False
				if i == ulen-1:
					return True
				i+=1
			return False

		def dotListFilter(self, args):
			r = []
			i = 0
			l = len(args)

			while i < l:
				au = args[i]["name"]
				if au != ".." and au != ".":
					r.append(args[i])
				i+=1
			return r

		def arrUrl(self, args):
			url = self.gUrl(args)
			tmp = []
			arr = url.split("/")

			for p in arr:
				if p != "":
					tmp.append(p)
			return tmp

		def getMLST(self, args):
			url  = self.normUrl(args)
			try:
				mlst = ftpcon.sendcmd('MLST ' + url).split("\n")[1].strip().split(";")
			except FTP_er_perm:
				return None
			r    = {}
			mlst.pop()
			while len(mlst):
				tmp = mlst.pop().split("=")
				r[tmp[0]]=tmp[1]
			return r

		def isDir(self, args, fftp = False):
			lftp = False if fftp else FTP
			
			url  = self.normUrl(args, fftp)
			if lftp:
				return self.getMLST(url).get("type",None) == "dir"
			else:
				return os.path.isdir(url)
		
		def getList(self, args, fftp = False):
			lftp = False if fftp else FTP
			args = du(args)

			r   = []
			url = self.normUrl(args, fftp)
			gs  = args.get("getSize",False)
			ls  = []
			if lftp:
				try:
					ls = ftpcon.nlst(url)
				except FTP_er_perm:
					ls = []				
			else:
				ls = os.listdir(url)
			for item in ls:
				if lftp:
					item = self.arrUrl(item)
					item = item[-1]

				itemUrl = url+"/"+item
				itemIsDir = self.getMLST(itemUrl).get("type",None) == "dir" if lftp else os.path.isdir(itemUrl) 
				itemR = {
					"type":"dir" if itemIsDir else "file",
					"url": self.shortUrl(itemUrl,fftp),
					"name": item
				}
				if gs and not itemIsDir:
					itemR["size"]=self.sizeOf(itemUrl,fftp)
				r.append(itemR)
			return r

		def rename(self, args, fftp = False):
			lftp = False if fftp else FTP
			args = du(args)
			FN = "rename"
			
			url       = self.normUrl(args, fftp)
			oldNames  = args.get("oldNames",[])
			newNames  = args.get("newNames",[])
			staticExt = args.get("staticExtension", False)
			onlyStr   = args.get("onlyStr", False)
			
			ls      = args.get("list",[]) if onlyStr else self.getList(url, fftp)
			names   = []
			types   = []
			renames = []
			mods    = {}
		
			for item in ls:
				names.append(item["name"])
				types.append(item["type"])

			for nm in newNames:
				mods[nm]=-1
		
			while len(oldNames):
				oldName = oldNames.pop()
				newName = newNames.pop()
				if(oldName==newName):
					continue
				newDiv = self.divNameExt(newName)
				oldDiv = self.divNameExt(oldName)
				mod=-1	
				newExt = ("."+(oldDiv[1] if staticExt else newDiv[1])) if len(oldDiv if staticExt else newDiv)>1 else ""
			
				tp=types[names.index(oldName)]
				
				oldUrl = url + "/" + oldName
				newUrl=""
				
				def umod():
					tmod="" if mod<0 else ("_" + mod)
					if tp=="file":
						newUrl = newDiv[0] + tmod + newExt
					else:
						newUrl = newName + tmod
					mod+=1
				umod()

				while True:
					try:
						names.index(newUrl)
						umod()
					except ValueError:
						break
				
				newName=newUrl
				newUrl=url + "/" + newUrl
				
				ok = True
				if lftp and not onlyStr:
					try:
						ftpcon.rename(oldUrl,newUrl)
					except:
						ok = False
				elif not onlyStr:
					try:
						os.rename(oldUrl,newUrl)
					except:
						ok = False
				if ok:
					renames.append([
						self.shortUrl(oldUrl,fftp),
						self.shortUrl(newUrl,fftp)
					])
					names[names.index(oldName)]=newName
				
				mods[newName]=mod
			return {
				"type": "ok",
				"renames": renames,
				"funcName": FN
			}

		def delete(self, args, fftp = False):
			lftp = False if fftp else FTP
			args = du(args)
			FN = "delete"
			
			url = self.normUrl(args, fftp)
			try:
				if self.isDir(url, fftp):
					ls = self.dotListFilter(self.getList(url, fftp))
					for item in ls:
						if item["type"] == "dir":
							self.delete(item["url"], fftp)
						else:
							tmpUrl = self.normUrl(item["url"], fftp)
							if lftp:
								ftpcon.delete(tmpUrl)
							else: 
								os.remove(tmpUrl)
					if lftp:
						ftpcon.rmd(url)
					else: 
						os.rmdir(url)
				else:
					if lftp:
						ftpcon.delete(url)
					else: 
						os.remove(url)
			except:
				pass
			return {
				"type": "ok" if not self.isAvailable(url, fftp) else "error",
				"objUrl": self.shortUrl(url, fftp),
				"funcName": FN
			}

		def deleteList(self, args, fftp = False):
			lftp = False if fftp else FTP
			args = du(args)
			FN = "deleteList"
			
			r = []

			while len(args["list"]):
				r.append(self.delete(args["list"].pop(), fftp))
			return {
				"type": "ok",
				"objList": r,
				"funcName": FN
			}

		def create(self, args, fftp = False):
			lftp = False if fftp else FTP
			args = du(args)
			FN = "create"
			
			type    = args.get("type","dir")
			name    = args.get("name")
			replace = args.get("replace",False)
			url     = self.normUrl(args, fftp)
			dest    = url + "/" + name
			if self.isAvailable(dest, fftp) and not replace:
				return {
					"type": "requery",
					"info": "obj exists",
					"objName": name,
					"objType": ("dir" if self.isDir(dest, fftp) else "file"),
					"funcName": FN,
					"requeryData": [
						{
							"name": FN,
							"args": {
								"url": self.shortUrl(url, fftp),
								"name": name,
								"type": type
							}
						}
					]
				}
			if replace:
				self.delete(dest, fftp)

			r = True
			try:
				if lftp:
					if type == "file":
						ftpcon.storbinary("STOR "+dest, BytesIO(b''))
					else:
						ftpcon.mkd(dest)
				else:
					if type == "file":
						with open(dest, 'a'):
							os.utime(dest, None)
					else:
						os.makedirs(dest)
			except:
				r = False
			return {
				"type": "ok" if r else "error",
				"funcName": FN
			}

		def getBase64(self, args, fftp = False):
			lftp = False if fftp else FTP
			args = du(args)
			FN   = "getBase64"
			
			url         = self.normUrl(args, fftp)
			commonError = {
				"type": "error",
				"info": "getting failed",
				"url": self.shortUrl(url, fftp),
				"funcName": FN
			}
			success={
				"type":"ok",
				"funcName":FN,
				"url":self.shortUrl(url, fftp),
				"content":""
			}
			chunkSize = 3*8
	
			if self.isDir(url, fftp):
				commonError["info"] = "obj is dir"
				return commonError
			if lftp:
				try:
					bio = BytesIO()
					bio.seek(0)
					def add_binary(data):
						bio.write(data)
					ftpcon.retrbinary('RETR ' + url, add_binary)
					bio.seek(0)
					success["mime"]=magic_from_buffer(bio.read(), mime=True)
					bio.seek(0)
					tmp = bio.read(chunkSize)
					while tmp:
						success["content"]+=b64encode(tmp).decode("utf-8")
						tmp = bio.read(chunkSize)
				except:
					return commonError
			else:
				try:
					with open(url,"rb") as f:
						f.seek(0)
						tmp = f.read(chunkSize)
						while tmp:
							success["content"]+=b64encode(tmp).decode("utf-8")
							tmp = f.read(chunkSize)
						f.seek(0)
						success["mime"]=magic_from_buffer(f.read(), mime=True)
				except:
					return commonError
			return success

		def setContent(self, args, fftp = False):
			lftp = False if fftp else FTP
			args = du(args)
			FN = "setContent"
			
			url         = self.normUrl(args, fftp)
			content     = args.get("content", None)
			commonError = {
				"type": "error",
				"info": "obj is dir",
				"url": self.shortUrl(url, fftp),
				"funcName": FN
			}
			if self.isDir(url, fftp):
				return commonError
			
			if content is None:
				commonError["info"] = "not content"
				return commonError

			req = True
			if lftp:
				try:
					bio = BytesIO(content.encode('utf-8'))
					ftpcon.storbinary('STOR '+url, bio)
				except FTP_er_all:
					req = False
			else:
				try:
					with open(url,'w') as f:
						f.write(content)
				except:
					req = False
			if req == False:
				commonError["info"] = "file writing error"
				return commonError

			return {
				"type": "ok",
				"url": self.shortUrl(url, fftp),
				"funcName": FN
			}

		def getContent(self, args, fftp = False):
			lftp = False if fftp else FTP
			
			FN = "getContent"
			
			url         = self.normUrl(args, fftp)
			commonError = {
				"type" : "error",
				"info" : "obj is dir",
				"url" : self.shortUrl(url, fftp),
				"funcName" : FN
			}
			if self.isDir(url, fftp):
				return commonError
			content = None
			if lftp:
				r = reader()
				ftpcon.retrbinary('RETR ' + url, r)
				content = r.data
			else:
				with open(url) as f:
					content = f.read()
			
			if content is None:
				commonError["info"] = "file reeding error"
				commonError["ret"]  = url
				return commonError

			return {
				"type": "ok",
				"url": self.shortUrl(url, fftp),
				"funcName": FN,
				"content": content
			}

		def sizeOf(self, args, fftp = False):
			lftp = False if fftp else FTP
			args = du(args)

			flushing = args.get("chunked",False)
			
			r = []
			
			size = 0
			stack=[
				[self.normUrl(args, fftp),self.isDir(args, fftp)]
			]
			while len(stack):
				stackItem=stack.pop()
				if stackItem[1]:
					ls = self.dotListFilter(self.getList(stackItem[0], fftp))
					for item in ls:
						stack.append([
							item["url"],
							item["type"] == "dir"
						])
				else:
					tmp_url=self.normUrl(stackItem[0],fftp)
					if flushing:
						r.append(int(self.getMLST(tmp_url).get("size",0) if lftp else os.path.getsize(tmp_url)))
						
					else:
						size+=int(self.getMLST(tmp_url).get("size",0) if lftp else os.path.getsize(tmp_url))
			
			return r if flushing else size

		def isAvailable(self, args, fftp = False):
			lftp = False if fftp else FTP
			
			url = self.normUrl(args, fftp)
			if self.shortUrl(url, fftp) == "@ROOT:":
				return True

			if lftp :
				return not self.getMLST(url) is None 
			return os.path.exists(url)

		def ifEqual(self, args, fftp = False):
			lftp = False if fftp else FTP
			FN = "ifEqual"
			args = du(args)

			if_     = args.get("if",[])
			then    = args.get("then",False)
			else_   = args.get("else",False)
			cond    = True
			globRet = {
				"return":[]
			}

			for if_fnData in if_:
				if_fnArgs  = if_fnData.get("args",{})
				if_fnName  = if_fnData.get("name","")
				returnDec  = if_fnData.get("return",{})
				returnType = returnDec.get("type",None)
				equal      = if_fnData.get("equal",None)

				ret = getattr(fns, if_fnName)(if_fnArgs)
				
				if returnType == "property":
					ret = ret.get(returnDec.get("name",""),None)
				
				if ret != equal:
					cond = False
					break

			globRet["type"] = "then" if cond else "else"

			if cond and then != False:
				for then_fnData in then:
					then_fnArgs = then_fnData.get("args",{})
					then_fnName = then_fnData.get("name","")
					globRet["return"].append(getattr(fns, then_fnName)(then_fnArgs))

			elif else_ != False:
				for else_fnData in else_:
					else_fnArgs = else_fnData.get("args",{})
					else_fnName = else_fnData.get("name","")
					globRet["return"].append(getattr(fns, else_fnName)(else_fnArgs))

			return globRet
	
	fns = FNS()
	for fnData in data["funcs"]:
		fnArgs = fnData.get("args",{})
		fnName = fnData.get("name","")

		req.append(getattr(fns, fnName)(fnArgs))

	return _echo()