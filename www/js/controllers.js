angular.module('starter.controllers', [])
.controller('mainController', function(
  $scope,
  $rootScope,
  $ionicHistory
) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.hasFooter = true;
    $ionicHistory.clearHistory()
  });
  angular.extend($scope, {
    defaults: {
      zoomControl: false
    },
    center: {
      lat: -7,
      lng: 110,
      zoom: 8
    },
    tiles: {
      url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2FtZW92ZXIiLCJhIjoicWFLdlBoYyJ9.EmU-s7wtfdTpVAX0SegFaw',
      type: 'xyz'
    }
  })
})

.controller('menuController', function(
  $scope,
  $state,
  $ionicModal,
  $rootScope
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
  $scope.radarShow = function() {
    $rootScope.hasFooter = false;
    $rootScope.stateRadar = true;
  }

  // Reporting modal
  $ionicModal.fromTemplateUrl('/templates/reporting.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalReport = modal;
  });
  $scope.reportShow = function() {
    $scope.modalReport.show();
  };
  $scope.reportHide = function() {
    $scope.modalReport.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modalReport.remove();
  });

  // navigate to setting view
  $scope.showSetting = function() {
    $state.go('app.setting')
  }
})

.controller('settingController', function() {

})

.controller('reportController', function(
  $scope,
  $ionicPlatform
) {
  // navigate to camera view
  $scope.showCamera = function() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    $ionicPlatform.ready(function() {
      navigator.camera.getPicture(function cameraSuccess(imageUri) {
        console.log('success')
      }, function cameraError(error) {
          console.debug("Unable to obtain picture: " + error, "app");
      }, options);
    })
  }
})
