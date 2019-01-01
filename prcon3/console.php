<?php
define("PASS", "111");
function Main($data, $acc){
	$error  = array();
	$req    = array();
	$ftpcon = false;
	
	//json echo start .req
	//	{
	//		"req":[
	//
	echo '
	{
		"req":[
	';
	flush();
	
	if (!isset($acc["password"]))
		$error[] = "no password";
	
	if(!isset($acc["ftp"]))
		$acc["ftp"]=false;
	if(!isset($acc["urlFtp"]))
		$acc["urlFtp"]=false;
	
	if (!$acc["ftp"]) {
		if ($acc["password"] != PASS)
			$error[] = "wrong password";
	} else {
		
		if (!isset($acc["login"]))
			$error[] = "no ftp login";
		
		$ftpcon = ftp_connect($acc["urlFtp"]);
		if (!$ftpcon)
			$error[] = "ftp con err";
		
		$ftplog = ftp_login($ftpcon, $acc["login"], $acc["password"]);
	
		if (!$ftplog)
			$error[] = "ftp login err";
		
		ftp_pasv($ftpcon, true);
		
	}
	
	if (!isset($data["funcs"]))
		$error[] = "no funcs";
	
	$FTP = $acc["ftp"];
	
	if(count($error)<1&&$FTP){
		if(@ftp_chdir($ftpcon,"/")){
			
		}else{
			$error[]="no root";
		}
	}
	
	function _echo($fn,$args,$arr,$_FTP){
		while(count($fn)>0) {
			$t=array_shift($fn);
			$a=array_shift($args);
			$t=$arr?$t:$t($a,$_FTP);
			if($t!=="__echo_inserted__"){
				echo json_encode($t);
			}
			if(count($fn)>0){
				echo ",";
			}
			flush();
		}
	}
	$nFN;
	class FN
	{
		public function login()
		{
			return 1;
		}
		
		public function gUrl($args)
		{
			if (is_string($args))
				return $args;
			else
				return $args["url"];
		}
		public function normUrl($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			$url = self::gUrl($url);
			$url = str_replace("@ROOT:", $FTP ? "" : $_SERVER['DOCUMENT_ROOT'], $url);
			$tmp = str_split($url);
			if ($tmp[count($tmp) - 1] === "/")
				$tmp[count($tmp) - 1] = "";
			return join("", $tmp);
		}
		public function shortUrl($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			$url = self::gUrl($url, $FTP);
			if (!$FTP)
				$url = str_replace($_SERVER['DOCUMENT_ROOT'], "@ROOT:", $url);
			else
				$url = "@ROOT:" . $url;
			return $url;
		}
		public function isParentOf($args, $FTP)
		{
			$url   = self::arrUrl(self::normUrl($args, $FTP), $FTP);
			$child = self::arrUrl(self::normUrl($args["child"], $FTP), $FTP);
			
			for ($i = 0; $i < count($child); $i++) {
				if ($child[$i] !== $url[$i])
					return false;
				if ($i === (count($url) - 1))
					return true;
			}
			
			return false;
		}
		public function dotListFilter($list, $FTP)
		{
			$r = array();
			for ($i = 0; $i < count($list); $i++) {
				$au = $list[$i]["name"];
				if ($au !== ".." && $au !== ".") {
					$r[] = $list[$i];
				}
			}
			return $r;
		}
		public function arrUrl($url, $FTP)
		{
			$url = self::gUrl($url, $FTP);
			$tmp = array();
			$arr = explode("/", $url);
			foreach ($arr as $p) {
				if ($p !== "")
					$tmp[] = $p;
			}
			;
			return $tmp;
		}
		public function divNameExp($url)
		{
			$url = self::gUrl($url, $FTP);
			$name = array_pop(self::arrUrl($url));
			$name = explode(".",$name);
			$r="";
			$e="";
			if(count($name)<2)
				return $name;
			while(count($name)>0){
				$n=array_shift($name);
				$c=count($name);
				if($c<1){
					$e=$n;
				}else{
					$r.=$n;
					if($c>1)
						$r.=".";
				}
			}
			return array($r,$e);
		}
		public function isDir($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$url = self::normUrl($url, $FTP);
			return $FTP ? ftp_size($ftpcon, $url) < 0 : is_dir($url);
		}
		public function getList($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			
			$r   = array();
			$url = self::normUrl($args, $FTP);
			$gs  = $args["getSize"];
	
			if ($FTP) {
				$list = (array) ftp_nlist($ftpcon, $url);
			} else {
				$list = scandir($url);
			}
			foreach ($list as $item) {
				if ($FTP) {
					$item = self::arrUrl($item, $FTP);
					$item = $item[count($item) - 1];
				}
				$itemUrl=$url . "/" . $item;
				$itemIsDir=self::isDir($itemUrl, $FTP);
				$itemR = array(
					"type" => ($itemIsDir ? "dir" : "file"),
					"url" => self::shortUrl($itemUrl, $FTP),
					"name" => $item
				);
				if($gs && !$itemIsDir)
					$itemR["size"]=self::sizeOf($itemUrl, $FTP);
	
				$r[] = $itemR;
			}
			return $r;
		}
		public function delete($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "delete";
			
			$url = self::normUrl($url, $FTP);
			if (self::isDir($url, $FTP)) {
				$list = self::dotListFilter(self::getList($url, $FTP), $FTP);
				foreach ($list as $item) {
					if ($item["type"] == "dir") {
						self::delete($item["url"], $FTP);
						$FTP ? ftp_rmdir($ftpcon, $tmpUrl) : rmdir($tmpUrl);
					} else {
						$tmpUrl = self::normUrl($item["url"], $FTP);
						$FTP ? ftp_delete($ftpcon, $tmpUrl) : unlink($tmpUrl);
					}
				}
				$FTP ? ftp_rmdir($ftpcon, $url) : rmdir($url);
			} else {
				$FTP ? ftp_delete($ftpcon, $url) : unlink($url);
			}
			return array(
				"type" => !self::isAvailable($url, $FTP) ? "ok" : "error",
				"objUrl" => self::shortUrl($url, $FTP),
				"funcName" => $FN
			);
		}
		public function createZip($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "createZip";
			
			$name        = $args["name"];
			$replace     = $args["replace"] || false;
			$url         = self::normUrl($args, $FTP);
			$dest        = $url . "/" . $name;
			$list        = $args["list"];
			$commonError = array(
				"type" => "error",
				"info" => "creation failed",
				"objName" => $name,
				"url" => self::shortUrl($url, $FTP),
				"funcName" => $FN
			);
			if (self::isAvailable($dest, $FTP) && !$replace)
				return array(
					"type" => "requery",
					"info" => "obj exists",
					"objName" => $name,
					"objType" => (self::isDir($dest, $FTP) ? "dir" : "file"),
					"funcName" => $FN,
					"requeryData" => array(
						array(
							"name" => $FN,
							"args" => array(
								"url" => self::shortUrl($url, $FTP),
								"name" => $name,
								"list" => $list
							)
						)
					)
				);
			if (!$list || count($list) < 1) {
				$commonError["info"] = "no list";
				return $commonError;
			}
			foreach ($list as $item) {
				if ($url === $item || self::isParentOf(array(
					"url" => $item,
					"child" => $url
				), $FTP)) {
					$commonError["info"] = "url is dest";
					return $commonError;
				}
			}
			if (extension_loaded('zip')) {
				$zip       = new ZipArchive();
				$stack     = array();
				$forDelete = array();
				$stack[]   = array(
					$list,
					""
				);
				function d($fd)
				{
					foreach ($fd as $f) {
						unlink($f);
					}
				}
				;
				if ($FTP) {
					$tmpName_zip = sys_get_temp_dir() . "/" . uniqid("PRCON_TMP", true) . $name . ".zip";
					if ($zip->open($tmpName_zip, ZIPARCHIVE::CREATE | ZipArchive::OVERWRITE) !== true) {
						return $commonError;
					}
					$forDelete[] = $tmpName_zip;
					while (count($stack) > 0) {
						$tmp   = array_shift($stack);
						$_path = $tmp[1];
						foreach ($tmp[0] as $item) {
							$item  = self::normUrl($item, $FTP);
							$nname = self::arrUrl($item, $FTP);
							$nname = $nname[count($nname) - 1];
							if (self::isDir($item, $FTP)) {
								$tmplist = self::dotListFilter(self::getList($item, $FTP), $FTP);
								$nlist   = array();
								foreach ($tmplist as $tmpitem) {
									$nlist[] = $tmpitem["url"];
								}
								if (count($nlist) < 1)
									$zip->addEmptyDir($_path . $nname);
								else
									$stack[] = array(
										$nlist,
										$_path . $nname . "/"
									);
							} else {
								$tmpName_file = sys_get_temp_dir() . "/" . uniqid("PRCON_TMP", true) . $nname;
								if (ftp_get($ftpcon, $tmpName_file, $item, FTP_BINARY)) {
									$zip->addFile($tmpName_file, $_path . $nname);
									$forDelete[] = $tmpName_file;
								} else {
									$zip->close();
									d($forDelete);
									return $commonError;
								}
							}
						}
					}
					$zip->close();
					
					if (ftp_put($ftpcon, $dest, $tmpName_zip, FTP_BINARY)) {
						d($forDelete);
					} else {
						d($forDelete);
						return $commonError;
					}
				} else {
					if ($zip->open($dest, ZIPARCHIVE::CREATE | ZipArchive::OVERWRITE) !== true) {
						return $commonError;
					}
					while (count($stack) > 0) {
						$tmp   = array_shift($stack);
						$_path = $tmp[1];
						foreach ($tmp[0] as $item) {
							$item  = self::normUrl($item, $FTP);
							$nname = self::arrUrl($item, $FTP);
							$nname = $nname[count($nname) - 1];
							if (self::isDir($item, $FTP)) {
								$tmplist = self::dotListFilter(self::getList($item, $FTP), $FTP);
								$nlist   = array();
								foreach ($tmplist as $tmpitem) {
									$nlist[] = $tmpitem["url"];
								}
								if (count($nlist) < 1)
									$zip->addEmptyDir($_path . $nname);
								else
									$stack[] = array(
										$nlist,
										$_path . $nname . "/"
									);
							} else {
								$zip->addFile($item, $_path . $nname);
							}
						}
					}
					
					$zip->close();
					
				}
			} else {
				$commonError["info"] = "no extension";
				return $commonError;
			}
			return array(
				"type" => "ok",
				"funcName" => $FN
			);
		}
		public function deleteList($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			$FN = "deleteList";
			
			$r = array();
			for ($i = 0; $i < count($args["list"]); $i++) {
				$r[] = self::delete($args["list"][$i], $FTP);
			}
			return array(
				"type" => "ok",
				"objList" => $r,
				"funcName" => $FN
			);
		}
		public function rename($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "rename";
			
			$url       = self::normUrl($args, $FTP);
			$oldNames  = $args["oldNames"];
			$newNames  = $args["newNames"];
			$staticExt = $args["staticExtension"];
		
			$list    = self::getList($url, $FTP);
			$names   = array();
			$types   = array();
			$renames = array();
		
			foreach($list as $item){
				$names[]=$item["name"];
				$types[]=$item["type"];
			}
			foreach($newNames as $nm){
				$mods[$nm]=-1;
			}
		
			while(count($oldNames)>0){
				$oldName = array_shift($oldNames);
				$newName = array_shift($newNames);
				if($oldName==$newName)
					continue;
				$newDiv = self::divNameExp($newName);
				$oldDiv = self::divNameExp($oldName);
				$mod=-1;	
				$newExt = count($staticExt?$oldDiv:$newDiv)>1?".".($staticExt?$oldDiv[1]:$newDiv[1]):"";
			
				$type=$types[array_search($oldName,$names)];
				
				$oldUrl = $url . "/" . $oldName;
				$newUrl="";
				
				do{
					$tmod=$mod<0?"":"_" . $mod;
					if($type=="file"){
						$newUrl = $newDiv[0] . $tmod . $newExt;
					}else{
						$newUrl = $newName . $tmod;
					}
					$mod++;
				}while(array_search($newUrl,$names)!==false);
				
				$newName=$newUrl;
				$newUrl=$url . "/" . $newUrl;
	
				$ok;
				if($FTP)
					$ok=ftp_rename($ftpcon,$oldUrl,$newUrl);
				else
					$ok=rename($oldUrl,$newUrl);
				
				if($ok){
					$renames[]=array(self::shortUrl($oldUrl,$FTP),self::shortUrl($newUrl,$FTP));
					$names[array_search($oldName,$names)]=$newName;
				}
				
				$mods[$newName]=$mod;
			}
			return array(
				"type" => "ok",
				"renames" => $renames,
				"funcName" => $FN
			);
		}
		public function createPath($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "createPath";
			
			$url    = self::normUrl($url, $FTP);
			$arrUrl = self::arrUrl($url);
			$tmp    = "";
			
			if (!self::isAvailable($url, $FTP)) {
				foreach ($arrUrl as $item) {
					$tmp .= "/" . $item;
					if (!self::isAvailable($tmp)) {
						if ($FTP)
							ftp_mkdir($ftpcon, $tmp);
						else
							mkdir($tmp);
					}
				}
			}
			if (!self::isAvailable($url, $FTP)) {
				return array(
					"type" => "error",
					"info" => "creation error",
					"url" => self::shortUrl($url, $FTP),
					"funcName" => $FN
				);
			}
			return array(
				"type" => "ok",
				"funcName" => $FN
			);
		}
		public function getBase64($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "getBase64";
			
			$url         = self::normUrl($url, $FTP);
			$commonError = array(
				"type" => "error",
				"info" => "getting failed",
				"url" => self::shortUrl($url, $FTP),
				"funcName" => $FN
			);
			$successStr='{
				"type":"ok",
				"funcName":"'.$FN.'",
				"url":"'.self::shortUrl($url, $FTP).'",';
			$chunkSize = 3*8;
	
			if (self::isDir($url, $FTP)) {
				$commonError["info"] = "obj is dir";
				return $commonError;
			}
			$r;
			$m;
			$tmpName = $FTP?sys_get_temp_dir() . "/" . uniqid("PRCON_TMP", true) . $name : $url;
			if ($FTP && ftp_get($ftpcon, $tmpName, $url, FTP_BINARY) === false) {
				return $commonError;
			}
			$file = fopen($tmpName, 'rb');
			$m=mime_content_type($tmpName);
			echo $successStr;
			flush();
			echo '
				"mime":"'.$m.'",
				"content":"';
			flush();
			while (!feof($file))
			{
				$buffer = fread($file, $chunkSize);
				echo base64_encode($buffer);
				flush();
			}
			echo '"}," "';
			flush();
			fclose($file);
			if($FTP)
				unlink($tmpName);
			
			return "__echo_inserted__";
		}
		public function create($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "create";
			
			$type    = $args["type"];
			$name    = $args["name"];
			$replace = $args["replace"] || false;
			$url     = self::normUrl($args, $FTP);
			$dest    = $url . "/" . $name;
			if (self::isAvailable($dest, $FTP) && !$replace)
				return array(
					"type" => "requery",
					"info" => "obj exists",
					"objName" => $name,
					"objType" => (self::isDir($dest, $FTP) ? "dir" : "file"),
					"funcName" => $FN,
					"requeryData" => array(
						array(
							"name" => $FN,
							"args" => array(
								"url" => self::shortUrl($url, $FTP),
								"name" => $name,
								"type" => $type
							)
						)
					)
				);
			if ($replace) {
				self::delete($dest, $FTP);
			}
			$r = false;
			if ($FTP) {
				if ($type === "file") {
					$temp = tmpfile();
					$r    = ftp_fput($ftpcon, $dest, $temp, FTP_ASCII);
				} else {
					$r = ftp_mkdir($ftpcon, $dest);
				}
			} else {
				if ($type === "file") {
					$r = touch($dest);
				} else {
					$r = mkdir($dest);
				}
			}
			return array(
				"type" => $r ? "ok" : "error",
				"funcName" => $FN
			);
		}
		public function copyTo($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "copyTo";
			
			$url           = self::normUrl($args, $FTP);
			$name          = self::arrUrl($url, $FTP);
			$name          = $name[count($name) - 1];
			$destination   = self::normUrl($args["destinationDir"], $FTP);
			$inDest        = $destination . "/" . $name;
			$replace       = $args["replace"] || false;
			$commonError   = array(
				"type" => "error",
				"info" => "obj copying error",
				"objName" => $name,
				"url" => self::shortUrl($url, $FTP),
				"destinationDir" => self::shortUrl($destination, $FTP),
				"funcName" => $FN
			);
			$commonRequery = array(
				"type" => "requery",
				"objName" => $name,
				"funcName" => $FN,
				"url" => self::shortUrl($url, $FTP),
				"requeryData" => array(
					array(
						"name" => $FN,
						"args" => array(
							"url" => self::shortUrl($url, $FTP),
							"destinationDir" => self::shortUrl($destination, $FTP)
						)
					)
				)
			);
			$includes      = array();
			
			if ($destination === $url || self::isParentOf(array(
				"url" => $url,
				"child" => $destination
			), $FTP)) {
				$commonRequery["info"] = "url is dest";
				return $commonRequery;
			}
			if (!self::isAvailable($url, $FTP)) {
				$commonRequery["info"] = "url not exists";
				return $commonRequery;
			}
			if (self::isAvailable($inDest, $FTP) && !$replace) {
				$commonRequery["info"] = "obj exists";
				return $commonRequery;
			}
			if ($replace) {
				self::delete($inDest, $FTP);
			}
			if (self::isDir($url)) {
				$create = self::create(array(
					"type" => "dir",
					"name" => $name,
					"url" => $destination
				), $FTP);
				if ($create["type"] != "ok") {
					$commonError["info"] = "obj create error";
					return $commonError;
				}
				$list = self::dotListFilter(self::getList($url, $FTP), $FTP);
				foreach ($list as $item) {
					$req = self::copyTo(array(
						"url" => $item["url"],
						"destinationDir" => $inDest
					), $FTP);
					if ($req["type"] !== "ok")
						$includes[] = $req;
				}
			} else {
				$copied = false;
				if ($FTP) {
					$tmpName = sys_get_temp_dir() . "/" . uniqid("PRCON_TMP", true) . $name;
					if (ftp_get($ftpcon, $tmpName, $url, FTP_BINARY) && ftp_put($ftpcon, $inDest, $tmpName, FTP_BINARY)) {
						$copied = true;
						unlink($tmpName);
					}
				} else {
					$copied = copy($url, $inDest);
				}
				if (!$copied) {
					return $commonError;
				}
			}
			return array(
				"type" => "ok",
				"objName" => $name,
				"url" => self::shortUrl($url, $FTP),
				"destinationDir" => self::shortUrl($destination, $FTP),
				"funcName" => $FN,
				"includes" => $includes
			);
		}
		public function copyListTo($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			$FN = "copyListTo";
			
			$r = array();
			for ($i = 0; $i < count($args["list"]); $i++) {
				$r[] = self::copyTo(array(
					"url" => $args["list"][$i],
					"destinationDir" => $args["destinationDir"]
				), $FTP);
			}
			return array(
				"type" => "ok",
				"objList" => $r,
				"funcName" => $FN
			);
		}
		public function getContent($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "getContent";
			
			$url         = self::normUrl($url, $FTP);
			$commonError = array(
				"type" => "error",
				"info" => "obj is dir",
				"url" => self::shortUrl($url, $FTP),
				"funcName" => $FN
			);
			if (self::isDir($url, $FTP)) {
				return $commonError;
			}
			$content = "";
			if ($FTP) {
				$tmp = sys_get_temp_dir() . "/" . uniqid("PRCON_TMP", true) . $name;
				ftp_get($ftpcon, $tmp, $url, FTP_BINARY);
				$content = file_get_contents($tmp);
				unlink($tmp);
			} else {
				$content = file_get_contents($url);
			}
			if ($content === false) {
				$commonError["info"] = "file reeding error";
				$commonError["ret"]  = $url;
				return $commonError;
			}
			return array(
				"type" => "ok",
				"url" => self::shortUrl($url, $FTP),
				"funcName" => $FN,
				"content" => $content
			);
		}
		public function extractZip($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "extractZip";
			
			$replace     = $args["replace"] || false;
			$url         = self::normUrl($args, $FTP);
			$dest        = self::normUrl($args["destinationDir"], $FTP);
			$commonError = array(
				"type" => "error",
				"info" => "extraction failed",
				"url" => self::shortUrl($url, $FTP),
				"funcName" => $FN
			);
			if (extension_loaded('zip')) {
				$zip         = new ZipArchive();
				$tmpName_ext = sys_get_temp_dir() . "/" . uniqid("PRCON_TMP", true) . "_ext";
				$tmpName_zip = ($FTP ? sys_get_temp_dir() . "/" . uniqid("PRCON_TMP", true) . ".zip" : $url);
				
				if (!self::isAvailable($dest)) {
					$r = self::createPath($dest);
					if ($r["type"] !== "ok") {
						$commonError["info"] = $r["info"];
						return $commonError;
					}
				}
				
				if ($FTP) {
					if (ftp_get($ftpcon, $tmpName_zip, $url, FTP_BINARY) !== true) {
						return $commonError;
					}
					;
				}
				
				if ($zip->open($tmpName_zip) !== true) {
					if ($FTP)
						unlink($tmpName_zip);
					return $commonError;
				}
				
				mkdir($tmpName_ext);
				if ($zip->extractTo($tmpName_ext) !== true) {
					self::delete($tmpName_ext, false);
					if ($FTP)
						unlink($tmpName_zip);
					return $commonError;
				}
				;
				$zip->close();
				
				$stack = array(
					array(
						self::dotListFilter(self::getList($tmpName_ext, false), false),
						$dest . "/"
					)
				);
				
				foreach ($stack[0][0] as $item) {
					$item = self::normUrl($item["url"], false);
					$name = self::arrUrl($item, false);
					$name = $name[count($name) - 1];
					if (self::isAvailable($dest . "/" . $name)) {
						self::delete($tmpName_ext, false);
						if ($FTP)
							unlink($tmpName_zip);
						return array(
							"type" => "requery",
							"funcName" => $FN,
							"info" => "obj exists",
							"url" => self::shortUrl($url, $FTP),
							"requeryData" => array(
								array(
									"name" => $FN,
									"args" => array(
										"url" => self::shortUrl($url, $FTP),
										"destinationDir" => self::shortUrl($dest, $FTP)
									)
								)
							)
						);
					}
				}
				while (count($stack) > 0) {
					$tmp   = array_shift($stack);
					$_path = $tmp[1];
					foreach ($tmp[0] as $item) {
						$item = self::normUrl($item["url"], false);
						$name = self::arrUrl($item, false);
						$name = $name[count($name) - 1];
						if (self::isDir($item, false)) {
							$list = self::dotListFilter(self::getList($item, false), false);
							if ($FTP)
								ftp_mkdir($ftpcon, $_path . $name);
							else
								mkdir($_path . $name);
							
							if (count($list) > 0)
								$stack[] = array(
									$list,
									$_path . $name . "/"
								);
						} else {
							if ($FTP)
								ftp_put($ftpcon, $_path . $name, $item, FTP_BINARY);
							else
								copy($item, $_path . $name);
						}
					}
				}
				
				self::delete($tmpName_ext, false);
				if ($FTP)
					unlink($tmpName_zip);
				
			} else {
				$commonError["info"] = "no extension";
				return $commonError;
			}
			return array(
				"type" => "ok",
				"funcName" => $FN
			);
		}
		public function setContent($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon, $FTP;
			$FN = "setContent";
			
			$url         = self::normUrl($args, $FTP);
			$content     = $args["content"];
			$commonError = array(
				"type" => "error",
				"info" => "obj is dir",
				"url" => self::shortUrl($url, $FTP),
				"funcName" => $FN
			);
			if (self::isDir($url, $FTP)) {
				return $commonError;
			}
			if (!isset($content)) {
				$commonError["info"] = "not content";
				return $commonError;
			}
			$req = true;
			if ($FTP) {
				$tmp = fopen('php://temp', 'r+');
				fwrite($tmp, $content);
				fseek($tmp, 0);
				$req = ftp_fput($ftpcon, $url, $tmp, FTP_BINARY);
				fclose($tmp);
			} else {
				$req = file_put_contents($url, $content);
			}
			if ($req === false) {
				$commonError["info"] = "file writing error";
				return $commonError;
			}
			return array(
				"type" => "ok",
				"url" => self::shortUrl($url, $FTP),
				"funcName" => $FN
			);
		}
		public function sizeOf($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			
			$url  = self::normUrl($url, $FTP);
			$size = 0;
			if (self::isDir($url, $FTP)) {
				$list = self::dotListFilter(self::getList($url, $FTP), $FTP);
				foreach ($list as $item) {
					if ($item["type"] == "dir") {
						$size += self::sizeOf($item["url"], $FTP);
					} else {
						$tmpUrl = self::normUrl($item["url"], $FTP);
						$size += $FTP ? ftp_size($ftpcon, $tmpUrl) : filesize($tmpUrl);
					}
				}
			} else {
				$size = $FTP ? ftp_size($ftpcon, $url) : filesize($url);
			}
			return $size;
		}
		public function isAvailable($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			
			$url = self::normUrl($url, $FTP);
			if (self::shortUrl($url, $FTP) === "@ROOT:")
				return true;
			if ($FTP) {
				if (ftp_size($ftpcon, $url) > -1)
					return true;
				$pushd = ftp_pwd($ftpcon);
				if ($pushd !== false && @ftp_chdir($ftpcon, $url)) {
					ftp_chdir($ftpcon, $pushd);
					return true;
				}
				return false;
			}
			if (!is_dir($url) && !is_file($url))
				return false;
			return true;
		}
		public function getInfo($url, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$url = self::normUrl($url, $FTP);
			$r   = array(
				"size" => self::sizeOf($url, $FTP),
				"type" => self::isDir($url, $FTP) ? "dir" : "file"
			);
			return $r;
		}
		public function ifEqual($args, $FTP)
		{
			if ($FTP !== false) {
				global $FTP;
			}
			global $ftpcon;
			$FN = "ifEqual";
			$nFN = new self();
			
			$if      = $args["if"];
			$then    = $args["then"];
			$else    = $args["else"];
			$cond    = true;
			$globRet = array();	
		
			foreach ($if as $c) {
				$ret = $nFN->{$c["name"]}($c["args"], $FTP);
				switch ($c["return"]["type"]) {
					case "property":
						$ret = $ret[$c["return"]["name"]];
						break;
				}
				if ($ret !== $c["equal"]) {
					$cond = false;
					break;
				}
			}
			
			echo '{
				"type":"'.($cond ? 'then' : 'else').'",
				"return":[
			';
		
			if ($cond && $then) {
				$funcs=array();
				$args=array();
				foreach($then as $t){
					$funcs[]=array($nFN,$t["name"]);
					$args[]=$t["args"];
				}
				_echo($funcs,$args,null,null);
			} elseif ($else) {
				$funcs=array();
				$args=array();
				foreach($else as $t){
					$funcs[]=array($nFN,$t["name"]);
					$args[]=$t["args"];
				}
				_echo($funcs,$args,null,null);
			}
		
			echo '
				],
				"funcName":"'.$FN.'"}
			';
			
			return "__echo_inserted__";
		}
	}
	;
	$_echoFN=array();
	$_echoArgs=array();
	$nFN=new FN();
	if (count($error) == 0) {
		foreach($data["funcs"] as $t){
			$_echoFN[] = array($nFN,$t["name"]);
			$_echoArgs[]= $t["args"];
		}
	}
	
	//json echo content of .req
	//	{
	//	//	"req":[
	//			content
	_echo($_echoFN,$_echoArgs,null,null);
	
	//json echo end of .req & start .error
	//	{
	//	//	"req":[
	//	//		content
	//		],
	//		"error":[
	//
	echo '
	],
		"error":[
	';
	
	//json echo content of .error
	//	{
	//	//	"req":[
	//	//		content
	//	//	],
	//	//	"error":[
	//			content
	//
	_echo($error,array(),true,null);
	
	//json echo end of .error & echo
	//	{
	//	//	"req":[
	//	//		content
	//	//	],
	//	//	"error":[
	//	//		content
	//		]
	//	}
	echo '
	]}';
	
	if ($FTP)
		ftp_close($ftpcon);
}
$dt=json_decode(file_get_contents("php://input"), true);
@Main($dt,$dt["acc"]);
?>