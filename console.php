<?php
define("PASS", "111");
$error  = array();
$req    = array();
$data   = json_decode(file_get_contents("php://input"), true);
$acc    = $data["acc"];
$ftpcon = false;

if (!isset($acc["password"]))
    $error[] = "no password";

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
        ftp_pasv($ftpcon, true);
    if (!$ftplog)
        $error[] = "ftp login err";
    
}

if (!isset($data["funcs"]))
    $error[] = "no funcs";

$FTP = $acc["ftp"];

class FN
{
    public static function login()
    {
        return 1;
    }
    
    public static function gUrl($args, $FTP)
    {
        if (is_string($args))
            return $args;
        else
            return $args["url"];
    }
    public static function normUrl($url, $FTP)
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
    public static function shortUrl($url, $FTP)
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
    public static function isParentOf($args, $FTP)
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
    public static function dotListFilter($list, $FTP)
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
    public static function arrUrl($url, $FTP)
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
    public static function isDir($url, $FTP)
    {
        if ($FTP !== false) {
            global $FTP;
        }
        global $ftpcon;
        $url = self::normUrl($url, $FTP);
        return $FTP ? ftp_size($ftpcon, $url) < 0 : is_dir($url);
    }
    public static function getList($url, $FTP)
    {
        if ($FTP !== false) {
            global $FTP;
        }
        global $ftpcon;
        
        $r   = array();
        $url = self::normUrl($url, $FTP);
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
            $r[] = array(
                "type" => (self::isDir($url . "/" . $item, $FTP) ? "dir" : "file"),
                "url" => self::shortUrl($url . "/" . $item, $FTP),
                "name" => $item
            );
        }
        return $r;
    }
    public static function delete($url, $FTP)
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
    public static function createZip($args, $FTP)
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
                    unlink($fd);
                }
            }
            ;
            if ($FTP) {
                $tmpName_zip = sys_get_temp_dir() . uniqid("PRCON_TMP", true) . $name . ".zip";
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
                            $tmpName_file = sys_get_temp_dir() . uniqid("PRCON_TMP", true) . $nname;
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
    public static function deleteList($args, $FTP)
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
    public static function createPath($url, $FTP)
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
    public static function getBlob($url, $FTP)
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
        if (self::isDir($url, $FTP)) {
            $commonError["info"] = "obj is dir";
            return $commonError;
        }
        $r;
        if ($FTP) {
            $tmpName = sys_get_temp_dir() . uniqid("PRCON_TMP", true) . $name;
            if (ftp_get($ftpcon, $tmpName, $url, FTP_BINARY) !== false) {
                return $commonError;
            }
            ;
            $data = file_get_contents($tmpName);
            $r    = 'data:' . mime_content_type($tmpName) . ';base64,' . base64_encode($data);
            unlink($tmpName);
        } else {
            $r = 'data:' . mime_content_type($url) . ';base64,' . base64_encode(file_get_contents($url));
        }
        
        return array(
            "type" => "ok",
            "funcName" => $FN,
            "url" => self::shortUrl($url, $FTP),
            "content" => $r
        );
    }
    public static function create($args, $FTP)
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
    public static function copyTo($args, $FTP)
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
                $tmpName = sys_get_temp_dir() . uniqid("PRCON_TMP", true) . $name;
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
    public static function copyListTo($args, $FTP)
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
    public static function getContent($url, $FTP)
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
            $tmp = sys_get_temp_dir() . uniqid("PRCON_TMP", true) . $name;
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
    public static function extractZip($args, $FTP)
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
            $tmpName_ext = sys_get_temp_dir() . uniqid("PRCON_TMP", true) . "_ext";
            $tmpName_zip = ($FTP ? sys_get_temp_dir() . uniqid("PRCON_TMP", true) . ".zip" : $url);
            
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
    public static function setContent($args, $FTP)
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
    public static function sizeOf($url, $FTP)
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
    public static function isAvailable($url, $FTP)
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
    public static function getInfo($url, $FTP)
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
    public static function ifEqual($args, $FTP)
    {
        if ($FTP !== false) {
            global $FTP;
        }
        global $ftpcon;
        $FN = "ifEqual";
        
        $if      = $args["if"];
        $then    = $args["then"];
        $else    = $args["else"];
        $cond    = true;
        $globRet = array();
        
        foreach ($if as $c) {
            $ret = self::$c["name"]($c["args"], $FTP);
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
        
        if ($cond && $then) {
            foreach ($then as $t) {
                $globRet[] = self::$t["name"]($t["args"], $FTP);
            }
        } elseif ($else) {
            foreach ($else as $e) {
                $globRet[] = self::$e["name"]($e["args"], $FTP);
            }
        }
        
        return array(
            "type" => $cond ? "then" : "else",
            "return" => $globRet,
            "funcName" => $FN
        );
    }
}
;

$F = new FN();
if (count($error) == 0) {
    for ($i = 0; $i < count($data["funcs"]); $i++)
        $req[] = $F->$data["funcs"][$i]["name"]($data["funcs"][$i]["args"]);
}

if ($FTP)
    ftp_close($ftpcon);

echo json_encode(array(
    "error" => $error,
    "req" => $req
));
?>
