For testing purpose :
  1. clone or download this repository
  2. cd geocrowd
  3. ionic platform add android
  4. ionic platform add ios (for mac user only)
  5. ionic run android
  

History :
  1. style some ui (main map, radar modal, capture view <partialy>)
  2. add leaflet-angular-directive
  3. create camera overlay interface (partially>using Moonware's cordova-cameraserver plugin) <removed>
  4. add another ui (setting, report) 
  5. add cordova plugin (camera, sms, orientation, geolocation, network info) but still partially implemented
  6. add turf.js library
  7. add service for creating buffer but still not implemented yet


Note:
  unfortunately, my beloved phone's RAM (Xiaomi redmi 2) cant handle running cordova application plus native camera application. Every time i touch a button that connected to cordova-camera-plugin, the main app is destroyed. So for the camera, i think i'll left it as is until i find alternative plugin

PS. I'm trying to imrove my english here, any corrections are welcomed (duh)
