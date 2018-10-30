<?php
define("PASS","111");
$error=array();
$req=array();
$data=json_decode(file_get_contents("php://input"),true);
$acc=$data["acc"];
$ftpcon=false;

if(!isset($acc["password"]))
    $error[]="no password";

if(!$acc["ftp"]){
  if($acc["password"]!=PASS)
    $error[]="wrong password";

}else{
  
  if(!isset($acc["login"]))
    $error[]="no ftp login";
  
  $ftpcon = ftp_connect($acc["urlFtp"]);
  if(!$ftpcon)
    $error[]="ftp con err";
  
  $ftplog=ftp_login($ftpcon, $acc["login"], $acc["password"]);
  if(!$ftplog)
  	ftp_pasv($ftpcon, true);
  if(!$ftplog)
  	$error[]="ftp login err";
  
}

if(!isset($data["funcs"]))
  $error[]="no funcs";

$FTP=$acc["ftp"];
class FN {
  public static function login(){
    return 1;
  }
  
  public static function gUrl($args){
    if(is_string($args))
      return $args;
    else 
      return $args["url"];
  }
  public static function normUrl($url){
    global $FTP;
    $url=self::gUrl($url);
    $url=str_replace("@ROOT:",$FTP?"":$_SERVER['DOCUMENT_ROOT'],$url);
    $tmp=str_split($url);
    if($tmp[count($tmp)-1]==="/")
      $tmp[count($tmp)-1]="";
    return join("",$tmp);
  }
  public static function shortUrl($url){
    global $FTP;
    $url=self::gUrl($url);
    if(!$FTP)
      $url=str_replace($_SERVER['DOCUMENT_ROOT'],"@ROOT:",$url);
    else
      $url="@ROOT:".$url;
    return $url;
  }
  public static function dotListFilter($list){
    $r=array();
    for($i=0;$i<count($list);$i++){
      $au=$list[$i]["name"];
      if($au!==".."&&$au!=="."){
      	$r[]=$list[$i];
      }
    }
    return $r;
  }
  public static function arrUrl($url){
  	$url=self::gUrl($url);
    $tmp=array();
    $arr=explode("/",$url);
    foreach($arr as $p){
      if($p!=="")
        $tmp[]=$p;
    };
    return $tmp;
  }
  public static function isDir($url){
    global $ftpcon, $FTP;
    $url=self::normUrl($url);
    return $FTP?ftp_size($ftpcon,$url)<0:is_dir($url);
  }
  public static function getList($url){
  	$r=array();
    global $ftpcon, $FTP;
    $url=self::normUrl($url);
    if($FTP){
      $list = (array)ftp_nlist($ftpcon, $url);
    }else{
      $list = scandir($url); 
    }
    foreach ($list as $item){
	  $r[] = array(
        "type"=>(self::isDir($url."/".$item)?"dir":"file"),
        "url"=>self::shortUrl($url."/".$item),
        "name"=>$item
      );
	}
    return $r;
  }
  public static function delete($url){
    global $ftpcon, $FTP;
    $FN="delete";
    
    $url=self::normUrl($url);
    if(self::isDir($url)){
      $list=self::dotListFilter(self::getList($url));
      foreach($list as $item){
        if($item["type"]=="dir"){
          self::delete($item["url"]);
          $FTP?ftp_rmdir($ftpcon,$tmpUrl):rmdir($tmpUrl);
        }else{
          $tmpUrl=self::normUrl($item["url"]);
          $FTP?ftp_delete($ftpcon,$tmpUrl):unlink($tmpUrl);
        }
      }
      $FTP?ftp_rmdir($ftpcon,$url):rmdir($url);
    }else{
      $FTP?ftp_delete($ftpcon,$url):unlink($url);
    }
    return array(
    	"type"=>!self::isAvailable($url)?"ok":"error",
      	"objUrl"=>self::shortUrl($url),
      	"funcName"=>$FN
    );
  }
  public static function deleteList($args){
    $FN="deleteList";
    
    $r=array();
    for($i=0;$i<count($args["list"]);$i++){
      $r[]=self::delete($args["list"][$i]);
    }
    return array(
    	"type"=>"ok",
      	"objList"=>$r,
      	"funcName"=>$FN
    );
  }
  public static function create($args){
    global $ftpcon, $FTP;
    $FN="create";
    
    $type=$args["type"];
    $name=$args["name"];
    $replace=$args["replace"]||false;
    $url=self::normUrl($args);
    $dest=$url."/".$name;
    if(self::isAvailable($dest)&&!$replace)
    	return array(
      		"type"=>"requery",
      		"info"=>"obj exists",
      		"objName"=>$name,
      		"objType"=>(self::isDir($dest)?"dir":"file"),
      		"funcName"=>$FN,
      		"requeryData"=>array(
            	array(
                	"name"=>$FN,
                  	"args"=>array(
                    	"url"=>self::shortUrl($url),
                      	"name"=>$name,
                      	"type"=>$type
                    )
                )
            ));
    if($replace){
      self::delete($dest);
    }
    $r=false;
    if($FTP){
      if($type==="file"){
    	$temp = tmpfile();
 		$r=ftp_fput($ftpcon, $dest, $temp, FTP_ASCII);
      }
      else{
        $r=ftp_mkdir($ftpcon,$dest);
      }
    }else{
      if($type==="file"){
    	$r=touch($dest);
      }
      else{
        $r=mkdir($dest);
      }
    }
    return array(
    	"type"=>$r?"ok":"error",
      	"funcName"=>$FN
    );
  }
  public static function copyTo($args){
    global $ftpcon, $FTP;
    $FN="copyTo";
    
    $url=self::normUrl($args);
    $name=self::arrUrl($url);
    $name=$name[count($name)-1];
    $destination=self::normUrl($args["destinationDir"]);
    $inDest=$destination."/".$name;
    $replace=$args["replace"]||false;
    if(self::isAvailable($inDest)&&!$replace)
    	return array(
      		"type"=>"requery",
      		"info"=>"obj exists",
      		"objName"=>$name,
      		"objType"=>(self::isDir($url)?"dir":"file"),
      		"funcName"=>$FN,
      		"requeryData"=>array(
            	array(
                	"name"=>$FN,
                  	"args"=>array(
                    	"url"=>self::shortUrl($url),
                      	"destinationDir"=>self::shortUrl($destination)
                    )
                )
            ));
    if($replace){
      self::delete($inDest);
    }
    if(self::isDir($url)){
      $create=self::create(array(
      	"type"=>"dir",
        "name"=>$name,
        "url"=>$destination
      ));
      if($create["type"]!="ok"){
        return array(
    		"type"=>"error",
      		"objName"=>$name,
    	  	"objType"=>(self::isDir($url)?"dir":"file"),
      		"funcName"=>$FN
    	);
      }
      
    }else{
      
    }
    return array(
    	"type"=>"ok",
    	"objName"=>$name,
      	"objType"=>(self::isDir($url)?"dir":"file"),
    	"funcName"=>$FN
    );
  }
  public static function sizeOf($url){
    global $ftpcon, $FTP;
    $url=self::normUrl($url);
    $size=0;
    if(self::isDir($url)){
      $list=self::dotListFilter(self::getList($url));
      foreach($list as $item){
        if($item["type"]=="dir"){
          $size+=self::sizeOf($item["url"]);
        }else{
          $tmpUrl=self::normUrl($item["url"]);
          $size+=$FTP?ftp_size($ftpcon,$tmpUrl):filesize($tmpUrl);
        }
      }
    }else{
      $size=$FTP?ftp_size($ftpcon,$url):filesize($url);
    }
    return $size;
  }
  public static function isAvailable($url){
    global $ftpcon, $FTP;
    $url=self::normUrl($url);
    if(self::shortUrl($url)==="@ROOT:")
      return true;
    if($FTP){
      if(ftp_size($ftpcon,$url)>0)
        return true;
      $pushd = ftp_pwd($ftpcon);
      if ($pushd !== false && @ftp_chdir($ftpcon, $url)){
        ftp_chdir($ftpcon, $pushd);   
    	return true;
      }
      return false;
    }
    if(!is_dir($url)&&!is_file($url))
      return false;
    return true;
  }
  public static function getInfo($url){
    global $ftpcon, $FTP;
    $url=self::normUrl($url);
    $r=array(
      "size"=>self::sizeOf($url),
      "type"=>self::isDir($url)?"dir":"file"
    );
    return $r;
  }
};

$F=new FN();
if(count($error)==0){
  for($i=0;$i<count($data["funcs"]);$i++)
    $req[]=$F->$data["funcs"][$i]["name"]($data["funcs"][$i]["args"]);
}

echo json_encode(array("error"=>$error,"req"=>$req));
?>