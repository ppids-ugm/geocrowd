angular.module('starter.controller.camera', [])
.controller('cameraController', function(
  $rootScope,
  $scope,
  $ionicPlatform,
  $http
) {
  $rootScope.hasFooter = false;
  $scope.verticalSlider = {
    value: 0,
    options: {
      floor: 0,
      ceil: 10,
      vertical: true
    }
  };

  $ionicPlatform.ready(function() {
    cordova.plugins.CameraServer.startServer({
        'www_root' : '/',
        'port' : 8080,
        'localhost_only' : false,
        'json_info': []
    }, function( url ){
        // if server is up, it will return the url of http://<server ip>:port/
        // the ip is the active network connection
        // if no wifi or no cell, "127.0.0.1" will be returned.
        console.log('CameraServer Started @ ' + url);
    }, function( error ){
        console.log('CameraServer Start failed: ' + error);
    });

    cordova.plugins.CameraServer.startCamera(function(){
        console.log('Capture Started');
    },function( error ){
        console.log('CameraServer StartCapture failed: ' + error);
    });

    var localImg = 'http://localhost:8080/live.jpg';

    // reqursive = function() {
    //   $http({
    //     method: 'GET',
    //     url: localImg,
    //     responseType: 'arraybuffer'
    //   }).then(function(response) {
    //     var str = _arrayBufferToBase64(response.data);
    //     $scope.imgDat =str;
    //     reqursive()
    //     // str is base64 encoded.
    //   }, function(response) {
    //     console.error('error in getting static img.');
    //   });
    // }
    //
    // reqursive()

    function _arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  })
})
