angular.module('starter.controllers', [])
.controller('mainController', function(
  $scope,
  $rootScope,
  $ionicHistory,
  $cordovaNetwork,
  positionService,
  $ionicPlatform,
  $ionicLoading,
  $ionicPopup,
  networkService,
  radarService
) {
  // Misc Function
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.hasFooter = true;
    $ionicHistory.clearHistory()
  });

  // Map definition
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

  // GPS Error Notif
  $scope.showGPSError = function(err) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'GPS Error',
       template: 'Failed to lock coordinates. GPS error message : ' + err.message +'<br/> Try Again?'
     });

     confirmPopup.then(function(res) {
       if(res) {
          positionService.getPosition(gpsSuccess, gpsFailed)
       } else {
         ionic.Platform.exitApp()
       }
     });
   };

  //  GPS Failed
  var gpsFailed = function(err) {
    $ionicLoading.hide()
    $scope.showGPSError(err)
  }

  //  GPS success
  var gpsSuccess = function(position) {
    $ionicLoading.hide()
    angular.extend($scope, {
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 10
      },
      markers: {
        myPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
      }
    })
  }

  // Disconnected Notif
  $scope.showDisconnected = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'No Internet Connection',
       template: 'No Internet Connection. You can still send a report using this application via SMS (without picture)'
     });
   };

  // Connected to internet
  var isOnline = function() {

  }

  // Disconnected from internet
  var isOffline = function() {
    $scope.showDisconnected()
  }

  // Main
  $ionicPlatform.ready(function() {
    $ionicLoading.show({
      template: 'Locking GPS Position...'
    }).then(function(){
      positionService.getPosition(gpsSuccess, gpsFailed)
    }).then(function() {
      networkService.getOnlineStatus(isOnline, isOffline)
    })
  })

  // Radar event listener
  // $scope.$on('radar:opened', function() {
  //    radarService.createBuffer()
  //  });
})

.controller('menuController', function(
  $scope,
  $state,
  $ionicModal,
  $rootScope,
  $ionicPlatform
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
    $rootScope.$broadcast('radar:opened');
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

.controller('radarController', function(
) {
})

.controller('settingController', function() {

})

.controller('reportController', function(
  $scope,
  $ionicPlatform,
  $cordovaCamera
) {
  // navigate to camera view
  $scope.showCamera = function() {
      $ionicPlatform.ready(function () {
        var options = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
        };
        $cordovaCamera.getPicture(options).then(function(imageURI) {
          var image = document.getElementById('myImage');
          image.src = imageURI;
        }, function(err) {
          // error
        });
        $cordovaCamera.cleanup()
      }, false);
  }
})
