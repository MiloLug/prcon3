
# Greetings to all!

## ***Django version now supports next functions for FTP and local using:***
 - viewing directories
 - editing files
 - renaming 
 - deleting
 - creating
 - downloading
 
 ### (python file API methods realization at this moment):
 - login +
 - gUrl +
 - normUrl +
 - shortUrl +
 - isParentOf +
 - dotListFilter +
 - arrUrl +
 - divNameExt +
 - isDir +
 - getList +
  -- *maybe, only for python :(
  --- execCommand 
  --- getPartitions
 - createPath +
 - uploadFile +
 - uploadFiles +
 - rename +
 - delete +
 - deleteList +
 - create +
 - createZip -
 - extractZip -
 - copyTo -
 - copyListTo -
 - getBase64 +
 - setContent +
 - getContent +
 - sizeOf +
 - isAvailable +
 - ifEqual +
 - getInfo +-....WTF??????
## ***- tested on python 3.6.6 w/ Django 2.1.7, base dir for local using (@ROOT:) - BASE_DIR in project settings (django.conf.settings)***


Just want to say that the project was written for myself, and only as a hobby, so I am not eager to tell all the details.

## Immediately short:
This is an online explorer that gives access to files through php or ftp functions.
(Ie, you can upload it to the host and edit files directly through PHP , without the use of FTP).
On phones the site also works great :)
### What can:

 - [x] Access your files through FTP or directly from PHP on the host
 - [x] Upload and download files
 - [x] Create and extract .zip archives
 - [x] Two file editors. The first is light version, second- with code highlighting, linting, searching...
 - [x] delete, cut, copy, paste files
 - [x] easy add new UI languages, redactors

#### highlighting and linting code languages:
Linting:

 - PHP
 - CSS
 - JS
 - HTML
 - JSON
 - Coffee Script

Highlighting:

 - SASS
 - Coffee Script
 - PHP
 - markdown
 - python
 - CSS
 - C like languages (C, C++ etc.)
 - javascript
 - HTML
 - XML

### Setup and using:
1. Download the folder ***prcon3***, upload it to the host.
2. Go to it through the browser ( http(s)://yoursite/prcon3/ )
3. Click on this button 
![enter image description here](https://i.ibb.co/RDGzDhj/image.png)
4. login from php:
![enter image description here](https://i.ibb.co/wr1C97T/image.png)
The password for the console.php is in the console.php file itself.
( prcon3/console.php )
![
](https://i.ibb.co/0VxrBSb/image.png)
Change if you want :)
![
](https://i.ibb.co/7G8gB2t/image.png)
Well, you understand
5. Login from FTP
![
](https://i.ibb.co/KhDsPsH/image.png)
## Sundries
#### @ROOT:
![
](https://i.ibb.co/8BPJW70/image.png)
@ROOT:/ - This is the root folder for php and ftp (for php, this is usually the path from the root of the disk to the host folder)

#### select file editor:
![
](https://i.ibb.co/HrWDNcj/image.png)
