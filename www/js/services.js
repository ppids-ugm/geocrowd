angular.module('starter.services', [])
.factory('mapService', function() {
  var baselayers = {
    'mapbox-dark': {
      name: 'Mapbox Dark',
      url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2FtZW92ZXIiLCJhIjoicWFLdlBoYyJ9.EmU-s7wtfdTpVAX0SegFaw',
      type: 'xyz',
      layerOptions: {
        showOnSelector: false
      }
    },
    'openstreetmap': {
      name: 'OpenStreetMap',
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      type: 'xyz',
      layerOptions: {
        showOnSelector: false
      }
    }
  }
  var sampleMarker = {
    outside1: {
      lat: -7.9752864,
      lng: 110.4320685,
      options: {
        'rId': '1',
        'reportType' : 'hotspot',
        'Level of danger' : 'Imminent',
        'Updated' : '6 hours ago'
      },
      icon: {
        iconUrl: './img/hotU.png',
        color: '#00f',
        iconSize: [34,34],
        iconAnchor: [19, 50],
        labelAnchor: [0, 8]
      }
    },
    outside2: {
      lat: -7.8852864,
      lng: 110.3420685,
      options: {
        'rId': '2',
        'ReportType' : 'user',
        'Source' : 'Twitter',
        'Status' : '#gambutapi terdeteksi pada...',
        'Level of danger' : 'Imminent',
        'Updated' : '1 hours ago'
      },
      icon: {
        iconUrl: './img/userRU.png',
        color: '#00f',
        iconSize: [34,34],
        iconAnchor: [17, 17],
        labelAnchor: [0, 8]
      }
    },
    inside1: {
      lat: -7.7649758,
      lng: 110.3736175,
      options: {
        'rId': '3',
        'ReportType' : 'hotspot',
        'Level of danger' : 'Imminent',
        'Updated' : '1 hours ago'
      },
      icon: {
        iconUrl: './img/hotU.png',
        color: '#00f',
        iconSize: [34,34],
        iconAnchor: [17, 17],
        labelAnchor: [0, 8]
      }
    },
    inside2: {
      lat: -7.7659758,
      lng: 110.3746175,
      options: {
        'rId': '4',
        'ReportType' : 'user',
        'Source' : 'Twitter',
        'Status' : '#gambutapi terdeteksi pada...',
        'Updated' : '2 hours ago'
      },
      icon: {
        iconUrl: './img/userRU.png',
        color: '#00f',
        iconSize: [34,34],
        iconAnchor: [17, 17],
        labelAnchor: [0, 8]
      }
    },
    kebakaran: {
      lat: 1.148897,
      lng: 102.408260,
      options: {
        'rId': '5',
        'ReportType' : 'user',
        'Source' : 'Twitter',
        'Status' : '#gambutapi terdeteksi pada...',
        'Updated' : '2 hours ago'
      },
      icon: {
        iconUrl: './img/userRU.png',
        color: '#00f',
        iconSize: [34,34],
        iconAnchor: [17, 17],
        labelAnchor: [0, 8]
      }
    },
    titik_api: {
      lat: 1.137897,
      lng: 102.407260,
      options: {
        'rId': '6',
        'ReportType' : 'hotspot',
        'Source' : 'Twitter',
        'Status' : '#gambutapi terdeteksi pada...',
        'Updated' : '2 hours ago'
      },
      icon: {
        iconUrl: './img/hotU.png',
        color: '#00f',
        iconSize: [34,34],
        iconAnchor: [17, 17],
        labelAnchor: [0, 8]
      }
    },
    sampel3: {
      lat: 1.109897,
      lng: 102.419260,
      options: {
        'rId': '7',
        'ReportType' : 'user',
        'Source' : 'Twitter',
        'Status' : '#gambutapi terdeteksi pada...',
        'Updated' : '2 hours ago'
      },
      icon: {
        iconUrl: './img/userRU.png',
        color: '#00f',
        iconSize: [34,34],
        iconAnchor: [17, 17],
        labelAnchor: [0, 8]
      }
    },
    sampel1: {
      lat: 1.148897,
      lng: 102.418260,
      options: {
        'rId': '8',
        'ReportType' : 'user',
        'Source' : 'Twitter',
        'Status' : '#gambutapi terdeteksi pada...',
        'Updated' : '2 hours ago'
      },
      icon: {
        iconUrl: './img/userRU.png',
        color: '#00f',
        iconSize: [34,34],
        iconAnchor: [17, 17],
        labelAnchor: [0, 8]
      }
    }
  }
  return {
    getLayers: function(key) {
      return baselayers[key];
    },
    getMarkers: function() {
      return sampleMarker
    },
    getMarkerInfo: function(markers) {
      var result = []
      for (i=0; i<markers.length; i++) {
        var res = sampleMarker[markers[i]].options
        res.id = markers[i]
        result.push(res)
      }
      return (result)
    }
  }
})
.factory('networkService', function(
  $ionicPlatform,
  $cordovaNetwork,
  $rootScope,
  statusService
) {
  return{
    getStatus: function() {
      $ionicPlatform.ready(function() {
        var netStatus = {type: $cordovaNetwork.getNetwork(), isOnline: $cordovaNetwork.isOnline()}
        statusService.set('network', netStatus)
        return netStatus
      })
    },
    getOnlineStatus: function(online, offline) {
      $ionicPlatform.ready(function() {
        isOnline = $cordovaNetwork.isOnline
        switch (isOnline) {
          case true:
            online
            break;
          case false:
            offline
            break;
        }
      })
    },
    watchStatus: function() {
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        statusService.set('isOnline', false)
      })

      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        console.log('online')
        statusService.set('isOnline', true)
      })
    }
  }
})
.factory('radarService', function() {
  // create buffer
  var generateBuffer = function(source, distance) {
    var unit = 'kilometers'
    var buffered = turf.buffer(source, distance, unit);
    return buffered
  }

  // create feature collection geojson
  var createFeatureCollection = function(feature) {
    var featureCollection = {}
    featureCollection.type = 'FeatureCollection'
    featureCollection.features = [feature]
    return featureCollection
  }

  // extract feature from feature collection
  var getFeature = function(features) {
    return features.features[0]
  }

  // check is there any marker inside buffer
  var pointWithin = function(markers, buffer) {
    var result = []
    var poly = getFeature(buffer)
    for(key in markers) {
      if(key != 'myPos') {
        var coord = getCoord(markers[key])
        var point = createPoint(coord)
        if(turf.inside(point, poly)) {
          result.push(key)
        }
      }
    }
    return result
  }

  // extract coordinate from marker
  var getCoord = function(marker) {
    var lat = marker.lat
    var lng = marker.lng
    return {lng:lng, lat:lat}
  }

  var createPoint = function(coord) {
    var pt = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [coord.lng, coord.lat]
      }
    }
    return pt
  }
  return {
    createBuffer: function(coord, distance) {
      var source = createPoint(coord)
      var buffered = generateBuffer(source, distance)
      var result = createFeatureCollection(buffered)
      return result
    },
    getPointWithin: function(markers, buffer) {
      return pointWithin(markers, buffer)
    }
  }
})
.factory('cameraService', function(
  $ionicPlatform,
  $rootScope,
  $q
) {
  var server = {isOnline : false}
  var instance = {
    getStatus: function () {
      return server
    },
    startServer: function() {
      var defer = $q.defer()
      $ionicPlatform.ready(function() {
        cordova.plugins.CameraServer.startServer({
          'www_root' : '/',
          'port' : 8080,
          'localhost_only' : false,
          'json_info': []
        }, function(url){
          console.log('startServer success')
          server = {isOnline : true, url: url}
          defer.resolve(server)
          // instance.startCamera(url)
        }, function(error){
          defer.reject(error)
        });
      })
      return defer.promise;
    },
    restartServer: function() {
      console.log('restarting')
      cordova.plugins.CameraServer.stopServer(instance.startServer(), function() {console.log('restart server error')})
    },
    stopServer: function() {
      var defer = $q.defer()
      cordova.plugins.CameraServer.stopServer(function() {
        server = {isOnline : false, url: ''}
        defer.resolve(server)
      }, function() {
        defer.reject(server)
      })
      return defer.promise
    },
    startCamera: function(url) {
      var url = url
      $ionicPlatform.ready(function() {
        cordova.plugins.CameraServer.startCamera(function(){
          $rootScope.$broadcast('camera:started', {url:url});
          console.log('Capture Started');
        },function( error ){
          console.log('CameraServer StartCapture failed: ' + error);
        });
      })
    }
  }
  return instance
})
.factory('pengaturanService', function(
  $window
) {
  var key = 'setting';
  var defaultSetting = {
    basemap: 'mapbox-dark',
    radarRange: 3000
  }
  var instance = {
    setSetting: function(val) {
      $window.localStorage[key] = angular.toJson(val);
    },
    getSetting: function() {
      return angular.fromJson($window.localStorage[key]) || defaultSetting
    }
  }
  return instance
})
.factory('statusService', function(
  $window
) {
  var instance = {
    isLoggedIn: function() {
      return instance.getStatus('isLoggedIn')
    },
    setStatus: function(key, val) {
      $window.localStorage[key] = val;
    },
    getStatus: function(key) {
      return $window.localStorage[key];
    }
  }
  return instance
})
.factory('userService', function(
  $window
) {
  return {
    setUser: function(val) {
      $window.localStorage['user'] = angular.toJson(val);
    },
    getUser: function() {
      return angular.fromJson($window.localStorage['user']);
    },
    delUser: function() {
      $window.localStorage.removeItem('user');
    }
  }
})
.factory('loginService', function(
  $http,
  userService,
  statusService,
  $rootScope,
  $ionicLoading,
  $cordovaToast
) {
  return {
    login: function(email, pass) {
      $ionicLoading.show({
        template: 'Mengecek Akun...'
      })
      $http.get('http://dashboard-geoinsight.esy.es/login-app.php', {
        params: {
          email: email,
          pass: pass
        }
      }).success(function(data, status) {
        $ionicLoading.hide()
        if (data.status == 'success') {
          console.log(data)
          userService.setUser(data.user)
          statusService.setStatus('isLoggedIn', true)
          $rootScope.$broadcast('login:success');
        } else {
          $cordovaToast.show(data.status, 'long', 'center')
          $rootScope.$broadcast('login:error', {error: data.status});
        }
      }).error(function(data, status) {
        $ionicLoading.hide()
        $cordovaToast.show(status+', '+data, 'long', 'center')
      })
    },
    logout: function() {
      userService.delUser()
      statusService.setStatus('isLoggedIn', false)
    }
  }
})
.factory('smsService',  function(
  $cordovaSms,
  userService,
  $ionicLoading,
  $cordovaToast
) {
  var user = userService.getUser()
  var phonenumber = '+6285799513726'
  var options = {
    replaceLineBreaks: false, // true to replace \n by a new line, false by default
    android: {
      intent: '' // send SMS with the native android SMS messaging
        //intent: '' // send SMS without open any other app
        //intent: 'INTENT' // send SMS inside a default SMS app
    }
  };
  return{
    sendSms: function(val) {
      $ionicLoading.show({
        template: 'Mengirim Laporan...'
      })
      var sms = 'L`U'+user.no_ktp+'`I'+val.incident.label+'`A'+val.azimuth+'`K'+val.keterangan+'`T'+val.tingkatKerusakan+'`L'+val.pos.lat+'`B'+val.pos.lng
      $cordovaSms
      .send(phonenumber, sms, options)
      .then(function() {
        $ionicLoading.hide()
        $cordovaToast.show('Laporan Terkirim', 'long', 'center')
      }, function(error) {
        $ionicLoading.hide()
        $cordovaToast.show('error, '+JSON.stringify(error), 'long', 'center')
      });
    }
  }
})
.factory('uploadService', function(
  $timeout,
  $cordovaFileTransfer,
  $rootScope
) {
  var server = 'http://local.server.com:8080/upload-app.php'
  return {
    upload: function(path) {
      var filename = path.split("/").pop();
      var options = {
        fileKey: "file",
        chunkedMode: false,
        mimeType: "image/jpeg",
      };
      $cordovaFileTransfer.upload(server, path, options)
      .then(function(result) {
        console.log(result)
      }, function(err) {
        console.log(err)
      }, function (progress) {
        $timeout(function () {
          console.log((progress.loaded / progress.total) * 100)
        });
      });
    }
  }
})
