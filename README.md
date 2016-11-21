wps-js-client
=============

Standalone Javascript OGC Web Processing Service (WPS) Client that utilizes the [wps-js](https://github.com/52North/wps-js) JavaScript API to grant access to Web Processing functionality via a user-friendly interface. It is built using JQuery, Boostrap and Angular and offers the following functions:

-	Configure available WPS instances
-	Use an intuitive HTML form-based Interface to build and execute typical request against WPS 1.0.0 and WPS 2.0.0 instances (GetCapabilities, DescribeProcess, Execute, getStatus, getResult)
-	Display of WPS responses via HTML form elements (Capabilities, ProcessDescription, Execute ResponseDocument (WPS 1.0), Execute ResultDocument (WPS 2.0), StatusInfo Document)

Requirements to develop or build the client
-------------------------------------------

-	git
-	[nodejs](https://nodejs.org)
-	[npm](https://www.npmjs.com/)
-	[grunt](http://gruntjs.com/)

Installation and basic usage
----------------------------

Open the command line and navigate to a location, where you want to download the repository.

-	Check out the code: `git clone https://github.com/52North/wps-js-client.git`
- navigate into repository (`cd wps-js-client`)
-	run `npm install` to get/install all dependencies
- run `grunt` or `grunt buildWar` to build the application (see section 'Building options' for more details)
-	Deploy it on a Web server (e.g. content from `dist` folder or as .WAR file as described above)
-	Launch the application and see what you can do.

Building options
----------------------------

### Get a static files folder which can be added to a web-server

-	with `grunt` all files are collected and build in a `dist` folder. The content of this folder can be deployed on a webserver like Tomcat.

### Build a .WAR file

-	with `grunt buildWar` a .WAR file is generated in the folder `build`. Use the .WAR file to deploy the client on a Web server.

License
-------

wps-js-client is published under TODO

The used libraries are:

-	jQuery - MIT License - https://jquery.org/license
-	Angular - MIT License - https://github.com/angular/angular.js/blob/master/LICENSE
-	Bootstrap - MIT License - https://github.com/twbs/bootstrap/blob/master/LICENSE
-	OpenLayers - 2-clause BSD License - (http://openlayers.org/
-	wps-js - Apache Software License, Version 2.0 - (https://github.com/52North/wps-js/blob/dev/LICENSE

Contact / Support
-----------------

To get help in running wps-js-client, please use the Geoprocessing community mailing list and forum: http://geoprocessing.forum.52north.org/

Please leave an issue on GitHub if you have any bug reports or feature requests: https://github.com/52North/wps-js-client/issues

Contact: Benjamin Proß (b.pross@52north.org)
