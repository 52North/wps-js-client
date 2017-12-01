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

Installation
----------------------------

Open the command line and navigate to a location, where you want to download the repository.

-	Check out the code: `git clone https://github.com/52North/wps-js-client.git`
- navigate into repository (`cd wps-js-client`)
-	run `npm install` to get/install all dependencies
- run `grunt` or `grunt buildWar` to build the application (see section 'Building options' for more details)
-	Deploy it on a Web server (e.g. content from `dist` folder or as .WAR file as described above)
-	Launch the application and see what you can do.

Basic usage
----------------------------

* First, you might want to change the language in the dropdown menu on the right.

1. Select a WebProcessingService:
![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/WPS_selection.png "WPS selection")
In this example, we select the geoprocessing service.
    
    * Optionally, you can then select Capabilities in the progress bar on the top right to get further information about Identification, Provider and Operations of the selected WebProcessingService.

2. Then go to Processes in the progress bar on the top and select one of the available processes which you want to make use of:
![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/Process_selection.png "Process selection")
In this example, we select the SimpleBufferAlgorithm.

    * The client requests information about the selected process. Optionally, you can select General Information, Inputs, or Outputs to get further information about the selected process.

3. Then go to the Execute progress on the top right and click on "Step 1: Configuration of Inputs".
The number of mandatory Inputs for the selected process is presented. 
    1. Click on the "Select Input" dropdown-menu and select a mandatory Input:
    ![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/Select_input.png "Input selection")
    Input types can be __Complex Data__ (3.ii), __Literal Data__ (3.iii), or __BoundingBox Data__ (3.iv).
    In this example, we select the "data" input, which is mandatory __Complex Data_ input for the SimpleBufferAlgorithm.

    2. In Case of a __Complex Data__ input, select the Format/MimeType:
    ![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/geojson_selection.png "Geojson format selection")
    In this example, we select the application/vnd.geo+json format. The geojson format allows the input in one of four ways. Per default, "Digitalisation (map based specification)" is selected:
    ![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/digitalision_setup.png "Digitalisation setup")
    Note: While "Digitalisation" is selected, the map contains a few buttons on the bottom right indicating geometry objects such as a Polyline, Polygon, Rectangle, Circle, and a marker.

        1. Click on one of the geometry objects to enable drawing mode. After drawing, click finish:
        ![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/polyline_drawing.png "Drawing a Polyline")
        Repeat this step until your desired input data is complete.

        2. Click on "Add Input" to finally create this input. You can still change or remove the added input later.
        * Optionally, you can input complex data as reference, upload a file (*.geojson, *.txt, *.json) containing valid geojson data, or paste valid geojson. 

    3. In case of a __Literal Data__ input, type in the desired value and click on "Add Input":
    ![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/literal_data_input.png "Entering a literal input")
    In this example, we choose a width for the SimpleBufferAlgorithm of 0.005.

    4. In case of a __BoundingBox Data__ input, you need to select a Coordinate Reference System and then specify the bounding box by using the 'Draw a Ractangle'-feature or by specifying the southwestern and northeastern corners:
    ![Alt test](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/BoundingBox_input.png "Input of a BoundingBox")
    In this example, there is no mandatory BoundingBox input required for the SimpleBufferAlgorithm.

4. Then click on "Step 2: Configuration of Outputs".
The number of mandatory Outputs for the selected process is presented.
    1. Click on the "Select Output" dropdown-menu and select a mandatory Output.
    In this example, we select the only available output of the SimpleBufferAlgorithm, "result".

    2. In case of __Complex Data__ output, select the Format/MimeType.
    In this example, we select the "application/vnd.geo+json" to visualize the output on the map after execution.

    3. Select your preferred Transmission Mode. In this example, we selected "value".

    4. Click on "Add Output" to complete the configuration:
    ![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/add_output.png "Adding the output")

    5. Repeat the steps (4.i) - (4.iv) for every mandatory Output.

* Optionally, you can click on "Step 3: Configuration of Execute Parameters" to change the execution mode and response format.

5. Click on "Perform Execute Request". After execution of the process, the response will be visible on the map:
![Alt text](https://github.com/cDanowski/wps-js-client/blob/master/screenshots/Result_presentation.png "presentation of result")
You can now disable/enable the visualization of input or output data on the top right.



Building options
----------------------------

### Get a static files folder which can be added to a web-server

-	with `grunt` all files are collected and build in a `dist` folder. The content of this folder can be deployed on a webserver like Tomcat.

### Build a .WAR file

-	with `grunt buildWar` a .WAR file is generated in the folder `build`. Use the .WAR file to deploy the client on a Web server.

License
-------

wps-js-client is published under Apache License Version 2.0

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
