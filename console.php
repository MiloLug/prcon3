<?php
define("PASS", "111");
$error  = array();
$req    = array();
$data   = json_decode(file_get_contents("php://input"), true);
$acc    = $data["acc"];
$ftpcon = false;

if(!isset($acc["password"]))
    $error[] = "no password";

if(!$acc["ftp"]) {
    if($acc["password"] != PASS)
        $error[] = "wrong password";
    
} else {
    
    if(!isset($acc["login"]))
        $error[] = "no ftp login";
    
    $ftpcon = ftp_connect($acc["urlFtp"]);
    if(!$ftpcon)
        $error[] = "ftp con err";
    
    $ftplog = ftp_login($ftpcon, $acc["login"], $acc["password"]);
    if(!$ftplog)
        ftp_pasv($ftpcon, true);
    if(!$ftplog)
        $error[] = "ftp login err";
    
}

if(!isset($data["funcs"]))
    $error[] = "no funcs";

$FTP = $acc["ftp"];

class FN {
    public static function login() {
        return 1;
    }
    
    public static function gUrl($args) {
        if(is_string($args))
            return $args;
        else
            return $args["url"];
    }
    public static function normUrl($url) {
        global $FTP;
        $url = self::gUrl($url);
        $url = str_replace("@ROOT:", $FTP ? "" : $_SERVER['DOCUMENT_ROOT'], $url);
        $tmp = str_split($url);
        if($tmp[count($tmp) - 1] === "/")
            $tmp[count($tmp) - 1] = "";
        return join("", $tmp);
    }
    public static function shortUrl($url) {
        global $FTP;
        $url = self::gUrl($url);
        if(!$FTP)
            $url = str_replace($_SERVER['DOCUMENT_ROOT'], "@ROOT:", $url);
        else
            $url = "@ROOT:" . $url;
        return $url;
    }
  	public static function isParentOf($args){
      	$url=self::arrUrl(self::normUrl($args));
      	$child=self::arrUrl(self::normUrl($args["child"]));
      	
      	for($i=0;$i<count($child);$i++){
          	if($child[$i]!==$url[$i])
            	return false;
          	if($i===(count($url)-1))
              	return true;
        }
      
      	return false;
    }
    public static function dotListFilter($list) {
        $r = array();
        for($i = 0; $i < count($list); $i++) {
            $au = $list[$i]["name"];
            if($au !== ".." && $au !== ".") {
                $r[] = $list[$i];
            }
        }
        return $r;
    }
    public static function arrUrl($url) {
        $url = self::gUrl($url);
        $tmp = array();
        $arr = explode("/", $url);
        foreach($arr as $p) {
            if($p !== "")
                $tmp[] = $p;
        }
        ;
        return $tmp;
    }
    public static function isDir($url) {
        global $ftpcon, $FTP;
        $url = self::normUrl($url);
        return $FTP ? ftp_size($ftpcon, $url) < 0 : is_dir($url);
    }
    public static function getList($url) {
        $r = array();
        global $ftpcon, $FTP;
        
      	$url = self::normUrl($url);
        if($FTP) {
            $list = (array) ftp_nlist($ftpcon, $url);
        } else {
            $list = scandir($url);
        }
        foreach($list as $item) {
          	if($FTP){
            	$item=self::arrUrl($item);
              	$item=$item[count($item)-1];
            }
            $r[] = array(
                "type" => (self::isDir($url . "/" . $item) ? "dir" : "file"),
                "url" => self::shortUrl($url . "/" . $item),
                "name" => $item
            );
        }
        return $r;
    }
    public static function delete($url) {
        global $ftpcon, $FTP;
        $FN = "delete";
        
        $url = self::normUrl($url);
        if(self::isDir($url)) {
            $list = self::dotListFilter(self::getList($url));
            foreach($list as $item) {
                if($item["type"] == "dir") {
                    self::delete($item["url"]);
                    $FTP ? ftp_rmdir($ftpcon, $tmpUrl) : rmdir($tmpUrl);
                } else {
                    $tmpUrl = self::normUrl($item["url"]);
                    $FTP ? ftp_delete($ftpcon, $tmpUrl) : unlink($tmpUrl);
                }
            }
            $FTP ? ftp_rmdir($ftpcon, $url) : rmdir($url);
        } else {
            $FTP ? ftp_delete($ftpcon, $url) : unlink($url);
        }
        return array(
            "type" => !self::isAvailable($url) ? "ok" : "error",
            "objUrl" => self::shortUrl($url),
            "funcName" => $FN
        );
    }
	public static function createZip($args){
		global $ftpcon, $FTP;
	    $FN = "createZip";
		
	    $name        = $args["name"];
	    $replace     = $args["replace"] || false;
	    $url         = self::normUrl($args);
		$dest        = $url . "/" . $name;
		$list        = $args["list"];
	  	$ret         = array();
	    $commonError = array(
	        "type" => "error",
	        "info" => "no extension",
	        "objName" => $name,
	        "url" => self::shortUrl($url),
	        "funcName" => $FN
	    );
		if(self::isAvailable($dest) && !$replace)
	        return array(
	            "type" => "requery",
	            "info" => "obj exists",
	            "objName" => $name,
	            "objType" => (self::isDir($dest) ? "dir" : "file"),
	            "funcName" => $FN,
	            "requeryData" => array(
	                array(
	                    "name" => $FN,
	                    "args" => array(
	                        "url" => self::shortUrl($url),
	                        "name" => $name,
							"list" => $list
	                    )
	                )
	            )
	        );
	  	if(!$list||count($list)<1){
			$commonError["info"] = "no list";
			return $commonError;
		}
	  	foreach($list as $item){
	    	if($url === $item || self::isParentOf(array(
	        	"url"=>$item,
	          	"child"=>$url
	        ))){
	          	$commonError["info"]="url is dest";
	          	return $commonError;
	        }
	    }
	    if (extension_loaded('zip')) {
			$zip = new ZipArchive();
			$stack = array();
			$stack[] = [$list,""];
			if($FTP){
				
			}else{
				if ($zip->open($dest, ZIPARCHIVE::CREATE | ZipArchive::OVERWRITE) !== true) {
					$commonError["info"] = "creation failed";
					return $commonError;
				}
				while(count($stack)>0){
					$tmp=array_shift($stack);
					$_path=$tmp[1];
					foreach ($tmp[0] as $item) {
						$item=self::normUrl($item);
	                  	$nname=self::arrUrl($item);
						$nname=$nname[count($nname)-1];
						if(self::isDir($item)){
							$tmplist=self::dotListFilter(self::getList($item));
							$nlist=array();
							foreach($tmplist as $tmpitem){
								$nlist[]=$tmpitem["url"];
							}
	                      	if(count($nlist)<1)
	                        	$zip->addEmptyDir($_path.$nname);
	                      	else
								$stack[]=array($nlist,$_path.$nname."/");
						}else{
							$zip->addFile($item,$_path.$nname);
						}
					}
				}
				
				$zip->close();
				
			}
	    } else
	        return $commonError;
		return array(
			"type" => "ok",
	        "funcName" => $FN
	    );
	}
    public static function deleteList($args) {
        $FN = "deleteList";
        
        $r = array();
        for($i = 0; $i < count($args["list"]); $i++) {
            $r[] = self::delete($args["list"][$i]);
        }
        return array(
            "type" => "ok",
            "objList" => $r,
            "funcName" => $FN
        );
    }
    public static function create($args) {
        global $ftpcon, $FTP;
        $FN = "create";
        
        $type    = $args["type"];
        $name    = $args["name"];
        $replace = $args["replace"] || false;
        $url     = self::normUrl($args);
        $dest    = $url . "/" . $name;
        if(self::isAvailable($dest) && !$replace)
            return array(
                "type" => "requery",
                "info" => "obj exists",
                "objName" => $name,
                "objType" => (self::isDir($dest) ? "dir" : "file"),
                "funcName" => $FN,
                "requeryData" => array(
                    array(
                        "name" => $FN,
                        "args" => array(
                            "url" => self::shortUrl($url),
                            "name" => $name,
                            "type" => $type
                        )
                    )
                )
            );
        if($replace) {
            self::delete($dest);
        }
        $r = false;
        if($FTP) {
            if($type === "file") {
                $temp = tmpfile();
                $r    = ftp_fput($ftpcon, $dest, $temp, FTP_ASCII);
            } else {
                $r = ftp_mkdir($ftpcon, $dest);
            }
        } else {
            if($type === "file") {
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
    public static function copyTo($args) {
        global $ftpcon, $FTP;
        $FN = "copyTo";
        
        $url           = self::normUrl($args);
        $name          = self::arrUrl($url);
        $name          = $name[count($name) - 1];
        $destination   = self::normUrl($args["destinationDir"]);
        $inDest        = $destination . "/" . $name;
        $replace       = $args["replace"] || false;
      	$commonError   = array(
            "type" => "error",
            "info" => "obj copying error",
            "objName" => $name,
            "url" => self::shortUrl($url),
            "destinationDir" => self::shortUrl($destination),
            "funcName" => $FN
        );
      	$commonRequery = array(
            "type" => "requery",
            "objName" => $name,
            "funcName" => $FN,
          	"url" => self::shortUrl($url),
            "requeryData" => array(
                array(
                    "name" => $FN,
                    "args" => array(
                        "url" => self::shortUrl($url),
                        "destinationDir" => self::shortUrl($destination)
                    )
                )
            )
        );
      	$includes=array();
      
      	if($destination === $url || self::isParentOf(array(
        	"url"=>$url,
          	"child"=>$destination
        ))){
          	$commonRequery["info"]="url is dest";
          	return $commonRequery;
        }
        if(!self::isAvailable($url)){
          	$commonRequery["info"]="url not exists";
          	return $commonRequery;
        }
        if(self::isAvailable($inDest) && !$replace){
          	$commonRequery["info"]="obj exists";
          	return $commonRequery;
        }
        if($replace) {
            self::delete($inDest);
        }
        if(self::isDir($url)) {
            $create = self::create(array(
                "type" => "dir",
                "name" => $name,
                "url" => $destination
            ));
            if($create["type"] != "ok") {
              	$commonError["info"] = "obj create error";
                return $commonError;
            }
            $list=self::dotListFilter(self::getList($url));
          	foreach($list as $item){
              	$req=self::copyTo(array(
                	"url"=>$item["url"],
                  	"destinationDir"=>$inDest
                ));
              	if($req["type"]!=="ok")
                  $includes[]=$req;
            }
        } else {
          	$copied=false;
            if($FTP) {
                $tmpName=sys_get_temp_dir().uniqid("PRCON_TMP",true).$name;
                if(ftp_get($ftpcon, $tmpName, $url, FTP_BINARY) && ftp_put($ftpcon, $inDest, $tmpName, FTP_BINARY)) {
                    $copied=true;
                    unlink($tmpName);
                }
            } else {
                $copied = copy($url, $inDest);
            }
            if(!$copied) {
                return $commonError;
            }
        }
        return array(
            "type" => "ok",
            "objName" => $name,
            "url" => self::shortUrl($url),
            "destinationDir" => self::shortUrl($destination),
            "funcName" => $FN,
          	"includes" => $includes
        );
    }
  	public static function copyListTo($args) {
        $FN = "copyListTo";
 		
        $r = array();
        for($i = 0; $i < count($args["list"]); $i++) {
            $r[] = self::copyTo(array(
            	"url"=>$args["list"][$i],
              	"destinationDir"=>$args["destinationDir"]
            ));
        }
        return array(
            "type" => "ok",
            "objList" => $r,
            "funcName" => $FN
        );
    }
  	public static function getContent($url){
      	global $ftpcon, $FTP;
      	$FN="getContent";
      	
      	$url           = self::normUrl($url);
      	$commonError   = array(
            "type" => "error",
            "info" => "obj is dir",
            "url" => self::shortUrl($url),
            "funcName" => $FN
        );
      	if(self::isDir($url)){
          	return $commonError;
        }
      	$content="";
      	if($FTP){
          	$tmp = fopen('php://temp', 'r+');
			ftp_fget($ftpcon, $tmp, $url, FTP_BINARY, 0);
			$fstats = fstat($tmp);
			fseek($tmp, 0);
			$content = fread($tmp, $fstats['size']);	
			fclose($tmp);
        }else{
          	$content=file_get_contents($url);
        }
      	if($content===false){
          	$commonError["info"]="file reeding error";
          	return $commonError;
        }
      	return array(
            "type" => "ok",
            "url" => self::shortUrl($url),
            "funcName" => $FN,
          	"content" => $content
        );
    }
  	public static function setContent($args){
      	global $ftpcon, $FTP;
      	$FN="setContent";
      	
      	$url           = self::normUrl($args);
      	$content       = $args["content"];
      	$commonError   = array(
            "type" => "error",
            "info" => "obj is dir",
            "url" => self::shortUrl($url),
            "funcName" => $FN
        );
      	if(self::isDir($url)){
          	return $commonError;
        }
      	if(!isset($content)){
        	$commonError["info"]="not content";
          	return $commonError;
        }
      	$req=true;
      	if($FTP){
          	$tmp = fopen('php://temp', 'r+');
			fwrite($tmp, $content);
			fseek($tmp, 0);
			$req=ftp_fput($ftpcon, $url, $tmp, FTP_BINARY);
			fclose($tmp);
        }else{
         	$req=file_put_contents($url,$content);
        }
      	if($req===false){
          	$commonError["info"]="file writing error";
          	return $commonError;
        }
      	return array(
            "type" => "ok",
            "url" => self::shortUrl($url),
            "funcName" => $FN
        );
    }
    public static function sizeOf($url) {
        global $ftpcon, $FTP;
        
      	$url  = self::normUrl($url);
        $size = 0;
        if(self::isDir($url)) {
            $list = self::dotListFilter(self::getList($url));
            foreach($list as $item) {
                if($item["type"] == "dir") {
                    $size += self::sizeOf($item["url"]);
                } else {
                    $tmpUrl = self::normUrl($item["url"]);
                    $size += $FTP ? ftp_size($ftpcon, $tmpUrl) : filesize($tmpUrl);
                }
            }
        } else {
            $size = $FTP ? ftp_size($ftpcon, $url) : filesize($url);
        }
        return $size;
    }
    public static function isAvailable($url) {
        global $ftpcon, $FTP;
        
      	$url = self::normUrl($url);
        if(self::shortUrl($url) === "@ROOT:")
            return true;
        if($FTP) {
            if(ftp_size($ftpcon, $url) > 0)
                return true;
            $pushd = ftp_pwd($ftpcon);
            if($pushd !== false && @ftp_chdir($ftpcon, $url)) {
                ftp_chdir($ftpcon, $pushd);
                return true;
            }
            return false;
        }
        if(!is_dir($url) && !is_file($url))
            return false;
        return true;
    }
    public static function getInfo($url) {
        global $ftpcon, $FTP;
        $url = self::normUrl($url);
        $r   = array(
            "size" => self::sizeOf($url),
            "type" => self::isDir($url) ? "dir" : "file"
        );
        return $r;
    }
  	public static function ifEqual($args) {
        global $ftpcon, $FTP;
      	$FN="ifEqual";
        
      	$if   = $args["if"];
      	$then = $args["then"];
      	$else = $args["else"];
      	$cond = true;
      	$globRet=[];
      	
      	foreach($if as $c){
          	$ret=self::$c["name"]($c["args"]);
          	switch($c["return"]["type"]){
              	case "property":
                	$ret=$ret[$c["return"]["name"]];
                	break;
            }
          	if($ret!==$c["equal"]){
              	$cond=false;
              	break;
            }
        }
      	
      	if($cond&&$then){
          	foreach($then as $t){
              	$globRet[]=self::$t["name"]($t["args"]);
            }
        }elseif($else){
          	foreach($else as $e){
              	$globRet[]=self::$e["name"]($e["args"]);
            }
        }
      	
      	return array(
            "type" => $cond?"then":"else",
            "return" => $globRet,
            "funcName" => $FN
        );
    }
}
;

$F = new FN();
if(count($error) == 0) {
    for($i = 0; $i < count($data["funcs"]); $i++)
        $req[] = $F->$data["funcs"][$i]["name"]($data["funcs"][$i]["args"]);
}

if($FTP)
  ftp_close($ftpcon);

echo json_encode(array(
    "error" => $error,
    "req" => $req
));
?>