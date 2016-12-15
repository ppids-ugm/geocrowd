angular.module('starter.services', [])
.factory('statusService', function() {
  var currentStatus = {}
  var instance = {
    setTime: function() {
      return Date.now()
    },
    set: function(key, val) {
      var timestamp = instance.setTime()
      var val = {'update' : timestamp, 'value': val}
      currentStatus[key] = val
    },
    get: function(key) {
      return currentStatus[key]
    }
  }
  return instance
})
.factory('mapService', function() {
  var sampleMarker = {
    outside1: {
      lat: -7.9752864,
      lng: 110.4320685,
      options: {
        'reportType' : 'hotspot',
        'Level of danger' : 'Imminent',
        'Updated' : '6 hours ago'
      }
    },
    outside2: {
      lat: -7.8852864,
      lng: 110.3420685,
      options: {
        'ReportType' : 'user',
        'Source' : 'Twitter',
        'Status' : '#gambutapi terdeteksi pada...',
        'Level of danger' : 'Imminent',
        'Updated' : '1 hours ago'
      }
    },
    inside1: {
      lat: -7.7649758,
      lng: 110.3736175,
      options: {
        'ReportType' : 'hotspot',
        'Level of danger' : 'Imminent',
        'Updated' : '1 hours ago'
      }
    },
    inside2: {
      lat: -7.7659758,
      lng: 110.3746175,
      options: {
        'ReportType' : 'user',
        'Source' : 'Twitter',
        'Status' : '#gambutapi terdeteksi pada...',
        'Updated' : '2 hours ago'
      }
    }
  }
  return {
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

.factory('positionService', function(
  $cordovaGeolocation,
  $ionicLoading
) {
  return{
    getPosition: function(success, failure) {
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(
        success
      )
      .catch(
        failure
      )
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
