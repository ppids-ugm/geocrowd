For testing purpose :
  1. clone or download this repository
  2. cd geocrowd
  3. ionic platform add android
  4. ionic platform add ios (for mac user only)
  5. cordova plugin add https://github.com/Moonware/cordova-cameraserver
  6. ionic run android
  

History :
  1. style some ui (main map, radar modal, capture view <partialy>)
  2. add leaflet-angular-directive
  3. create camera overlay interface (partially>using Moonware's cordova-cameraserver plugin)
  
Note:
   Moonware's cordova-cameraserver plugin create something like local server to serve image from the camera activity in background. It capture image on demand when a HTTP request arrives. So, to achive real time image preview from camera (or at least identical to it) i place recursive function in http request promise. I don't know whether it will squeeze a lot of resources or not. But at least it is working. I guess sticking into it is a reasonable decision for now :V

PS. I'm trying to imrove my english here, any corrections are welcomed (duh)
