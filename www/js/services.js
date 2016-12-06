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
  var generateBuffer = function(source, distance) {
    var unit = 'kilometers'
    var buffered = turf.buffer(source, distance, unit);
    return buffered
  }

  var createPoint = function(coord) {
    var pt = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [coord.lat, coord.lng]
      }
    }
    return pt
  }
  return {
    createBuffer: function(coord, distance) {
      var source = createPoint(coord)
      var result = generateBuffer(source, distance)
      return result
    }
  }
})
