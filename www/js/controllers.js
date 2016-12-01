angular.module('starter.controllers', [])
.controller('mainController', function(
  $scope,
  $rootScope
) {
  $rootScope.hasFooter = true;
  angular.extend($scope, {
    defaults: {
      tileLayerOptions: {
        opacity: 0.9,
        detectRetina: true,
        reuseTiles: true,
      },
      zoomControl: false
    }
  })
  $scope.center = {
    lat: -7,
    lng: 110,
    zoom: 8
  }
})

.controller('menuController', function(
  $scope,
  $state,
  $ionicModal
) {
  // Login modal
  $ionicModal.fromTemplateUrl('/templates/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalLogin = modal;
  });
  $scope.loginShow = function() {
    $scope.modalLogin.show();
  };
  $scope.loginHide = function() {
    $scope.modalLogin.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modalLogin.remove();
  });

  // Radar modal
  $ionicModal.fromTemplateUrl('/templates/radar.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalRadar = modal;
  });
  $scope.radarShow = function() {
    $scope.modalRadar.show();
  };
  $scope.radarHide = function() {
    $scope.modalRadar.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modalRadar.remove();
  });

  // navigate to camera view
  $scope.showCamera = function() {
    $state.go('app.camera')
  }
})

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

    reqursive = function() {
      $http({
        method: 'GET',
        url: localImg,
        responseType: 'arraybuffer'
      }).then(function(response) {
        var str = _arrayBufferToBase64(response.data);
        $scope.imgDat =str;
        reqursive()
        // str is base64 encoded.
      }, function(response) {
        console.error('error in getting static img.');
      });
    }

    reqursive()

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
