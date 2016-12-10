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
  radarService,
  mapService
) {
  // Misc Function
  $rootScope.stateRadar = false;
  $scope.height= '100%';
  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.hasFooter = true;
    $ionicHistory.clearHistory()
  });

  $scope.radarHide = function() {
    $rootScope.stateRadar = false;
    $rootScope.hasFooter = true;
    $rootScope.$broadcast('radar:closed');
  }

  // Map definition
  var markers = mapService.getMarkers()
  angular.extend($scope, {
    defaults: {
      zoomControl: false
    },
    center: {
      lat: 0,
      lng: 0,
      zoom: 8
    },
    markers: markers,
    geojson: {},
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
    console.log(position.coords.latitude, position.coords.longitude)
    angular.merge($scope, {
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 12
      },
      markers: {
        myPos: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          icon: {
              iconUrl: './assets/pin.png',
              color: '#00f',
              iconSize: [38,50],
              iconAnchor: [19, 50],
              labelAnchor: [0, 8]
            }
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
  $scope.$on('radar:opened', function() {
    $scope.height= '50%';
    var pos = $scope.markers.myPos
    var bufferJson = radarService.createBuffer(pos, 0.5)
    angular.extend($scope, {
      geojson: {
        data: bufferJson,
        style: {
          fillColor: "green",
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 1
        }
      }
    })
    var pointList = radarService.getPointWithin($scope.markers, bufferJson)
    var pointListDesc = mapService.getMarkerInfo(pointList)
    $scope.pointsInside = pointListDesc
  });

  $scope.$on('radar:closed', function() {
    $scope.height= '100%';
    angular.extend($scope, {
      geojson: {}
    })
  })
})

.controller('menuController', function(
  $scope,
  $state,
  $ionicModal,
  $rootScope,
  $ionicPlatform
) {
  // Login modal
  $scope.loginShow = function() {
    $state.go('app.login')
  };

  // Radar modal
  $scope.radarShow = function() {
    $rootScope.hasFooter = false;
    $rootScope.stateRadar = true;
    $rootScope.$broadcast('radar:opened');
  }

  // Reporting modal
  $scope.reportShow = function() {
    $state.go('app.report');
  };
  $scope.reportHide = function() {
    $state.go('app.main');
  };

  // navigate to setting view
  $scope.showSetting = function() {
    $state.go('app.setting')
  }
})
.controller('loginController', function(
  $state,
  $scope,
  $rootScope
) {
  $rootScope.hasFooter = false
  $scope.loginHide = function() {
    $state.go('app.main')
  };
})
.controller('radarController', function(
) {
})

.controller('settingController', function(
  $rootScope,
  $state,
  $scope
) {
  $rootScope.hasFooter = false
  $scope.backToMain = function() {
      $state.go('app.main')
  }
})

.controller('reportController', function(
  $scope,
  $ionicPlatform,
  $cordovaCamera,
  $rootScope
) {
  $rootScope.hasFooter = false
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
