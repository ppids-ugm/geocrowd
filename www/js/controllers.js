angular.module('starter.controllers', [])
.controller('mainController', function(
  $scope,
  $rootScope,
  $ionicHistory,
  $cordovaNetwork,
  $ionicPlatform,
  $ionicLoading,
  $ionicPopup,
  networkService,
  radarService,
  mapService,
  pengaturanService,
  $cordovaGeolocation
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
          startGPS()
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
    $rootScope.$broadcast('gps:tracking', {lat:position.coords.latitude, lng:position.coords.longitude})
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

   var watchOptions = {
     timeout : 3000,
     enableHighAccuracy: false // may cause errors if true
   };

   var startGPS =function() {
     var watch = $cordovaGeolocation.watchPosition(watchOptions);
     watch.then(
       null,
       function(err) {
         gpsFailed(err)
       },
       function(position) {
         $rootScope
         gpsSuccess(position)
     });
   }

  // Main
  $ionicPlatform.ready(function() {
    $ionicLoading.show({
      template: 'Locking GPS Position...'
    }).then(function(){
      startGPS()
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
          fillOpacity: 0.3
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
  userService,
  $cordovaToast,
  statusService
) {
  // Login modal
  $scope.loginShow = function() {
    console.log(statusService.isLoggedIn())
    if(statusService.isLoggedIn()==='true') {
      $state.go('app.profil')
    } else {
      $state.go('app.login')
    }
  };

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
      $cordovaToast.show('You must login to access this feature!', 'long', 'center')
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
  $cordovaToast,
  loginService
) {
  $rootScope.hasFooter = false
  $scope.loginHide = function() {
    $state.go('app.main')
  };
  $scope.account = {}
  $scope.login = function() {
    console.log(loginService.login($scope.account.email, $scope.account.pass))
  }
  $rootScope.$on('login:success', function() {
    $state.go('app.main')
  })
  $rootScope.$on('login:error', function(err) {
    $cordovaToast.show('Error, '+err.error, 'long', 'center')
  })
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
  $rootScope,
  smsService,
  uploadService
) {
  $rootScope.hasFooter = false
  $scope.report = {
    tingkatKerusakan: 6,
    isSms: true,
    pos: {
      lat:'',
      lng:''
    }
  }
  $scope.incident = [
    {id:1, label:'Kebakaran Hutan'},
    {id:2, label:'Pembangunan Kanal'},
    {id:3, label:'Penebangan Liar'},
    {id:4, label:'Lainnya'}
  ]
  $rootScope.$on('gps:tracking', function(evt, args) {
    $scope.report.pos.lat = args.lat
    $scope.report.pos.lng = args.lng
  })
  $scope.report.incident = $scope.incident[0]
  $scope.incidentUpdate = function() {
    if($scope.report.incident.id == 4) {
      $scope.showAlt = true
    } else {
      $scope.showAlt = false
      $scope.report.altIncident = ''
    }
  }
  // navigate to camera view
  $scope.startCamera = function() {
    $ionicPlatform.ready(function () {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.NATIVE_URI,
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
        document.getElementById('prevPic').src = imageURI
        $scope.takePic = true;
        uploadService.upload(imageURI)
      }, function(err) {
        console.log(err)
      });
    }, false);
  }

  $scope.slider = {
    options: {
      floor: 0,
      ceil: 12,
      showSelectionBar: true,
      getSelectionBarColor: function(value) {
        if (value <= 3)
          return 'lightgreen';
        if (value <= 6)
          return 'yellow';
        if (value <= 9)
          return 'orange';
        return 'red';
      },
      getPointerColor: function(value) {
        if (value <= 3)
          return 'lightgreen';
        if (value <= 6)
          return 'yellow';
        if (value <= 9)
          return 'orange';
        return 'red';
      },
      translate: function(value, sliderId, label) {
        switch (label) {
          case 'model':
            if(value <= 3) {
              return 'Tidak Parah'
            } else if (value <= 6) {
              return 'Parah'
            } else {
              return 'Sangat Parah'
            }

          default:
            return ''
        }
      }
    }
  }

  $scope.reportHide = function() {
    $state.go('app.main')
  }
  $scope.online = true;
  $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
    console.log('offline');
    $scope.report.isSms = true;
    $scope.online = false;
  })
  $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
    console.log('online');
    $scope.online = true;
  })

  $scope.laporkan = function() {
    if($scope.report.isSms) {
      smsService.sendSms($scope.report)
    }
  }
})

.controller('socialController', function() {

})

.controller('profilController', function(
  $rootScope,
  userService,
  $scope,
  $state,
  loginService
) {
  var user = userService.getUser()
  $scope.user = user
  $rootScope.hasFooter = false

  $scope.logout = function() {
    loginService.logout()
    $state.go('app.main')
  }
})

.controller('verifyController', function(
  $scope,
  $state,
  $stateParams
) {
  $scope.verify = {}
  $scope.backToMain = function() {
    $state.go('app.main')
  }
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
        $scope.verify.previewPic = imageURI;
        $scope.verify.takePic = true;
      }, function(err) {
        console.log(err)
      });
    }, false);
  }
})
