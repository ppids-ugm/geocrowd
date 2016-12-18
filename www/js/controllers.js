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
  mapService,
  pengaturanService
) {
  // Misc Function
  var currentSetting = pengaturanService.getSetting()
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
  var baselayers = {}
  baselayers[currentSetting.basemap] = mapService.getLayers(currentSetting.basemap)
  $scope.$on("$ionicView.beforeEnter", function(event, data){
    if(pengaturanService.getSetting().basemap!=currentSetting.basemap) {
      delete baselayers[currentSetting.basemap]
      baselayers[pengaturanService.getSetting().basemap] = mapService.getLayers(pengaturanService.getSetting().basemap)
      currentSetting.basemap = pengaturanService.getSetting().basemap
      angular.extend($scope, {
        baselayers : baselayers
      })
    }
  });
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
    layers: {
      baselayers: baselayers
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
              iconUrl: './img/myPos.png',
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
    var bufferJson = radarService.createBuffer(pos, pengaturanService.getSetting().radarRange/1000)
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
  $ionicPlatform,
  statusService
) {
  // Login modal
  $scope.loginShow = function() {
    if(statusService.isLoggedIn()=='true') {
      $state.go('app.login')
    } else {

    }
  };

  $scope.showProfil = function() {
    $state.go('app.profil')
  }

  // Radar modal
  $scope.radarShow = function() {
    if($state.current.name != 'app.main') {
      $state.go('app.main').then(function() {
        $rootScope.hasFooter = false;
        $rootScope.stateRadar = true;
        $rootScope.$broadcast('radar:opened');
      })
    } else {
      $rootScope.hasFooter = false;
      $rootScope.stateRadar = true;
      $rootScope.$broadcast('radar:opened');
    }
  }

  // Reporting modal
  $scope.reportShow = function() {
    console.log(statusService.isLoggedIn())
    if(statusService.isLoggedIn() == 'true') {
      $state.go('app.report');
    } else {
      alert('You must login to access this feature!')
    }
  };
  $scope.reportHide = function() {
    $state.go('app.main');
  };

  // navigate to setting view
  $scope.showSetting = function() {
    $state.go('app.setting')
  }

  // navigate to camera view
  $scope.socialShow = function() {
    $state.go('app.social')
  }
})
.controller('loginController', function(
  $state,
  $scope,
  $rootScope,
  statusService
) {
  $rootScope.hasFooter = false
  $scope.loginHide = function() {
    $state.go('app.main')
  };
  $scope.login = function() {
    // statusService.setStatus('isLoggedIn', true)
    // $state.go('app.main')
    alert('Error, your account is not exist in our database!')
  }
})
.controller('radarController', function(
) {
})

.controller('settingController', function(
  $rootScope,
  $state,
  $scope,
  pengaturanService
) {
  var savedSetting = pengaturanService.getSetting()
  $scope.setting = {
    radarRange: savedSetting.radarRange || 300,
    basemap: savedSetting.basemap || mapbox-dark
  }
  $rootScope.hasFooter = false
  $scope.backToMain = function() {
    // if(savedSetting.basemap != pengaturanService.getSetting().basemap) {
    //   $rootScope.$broadcast('map:changed')
    // } else {
    //   $rootScope.$broadcast('map:unchanged')
    // }
    $state.go('app.main')
  }
  $scope.apply = function() {
    pengaturanService.setSetting($scope.setting)
  }
})

.controller('reportController', function(
  $state,
  $scope,
  $ionicPlatform,
  $cordovaCamera,
  $rootScope
) {
  $rootScope.hasFooter = false
  // navigate to camera view
  $scope.startCamera = function() {
    $ionicPlatform.ready(function () {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };
      $cordovaCamera.getPicture(options).then(function(imageURI) {
        console.log(imageURI);
        $scope.previewPic = imageURI;
        $scope.takePic = true;
      }, function(err) {
        console.log(err)
      });
    }, false);
  }

  $scope.reportHide = function() {
    $state.go('app.main')
  }
})
.controller('socialController', function() {

})
.controller('profilController', function(
  $scope
) {
})
