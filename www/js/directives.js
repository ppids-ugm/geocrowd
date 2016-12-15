angular.module('starter.directives', [])
.directive('compassRotate', function (
  $cordovaDeviceOrientation,
  $ionicPlatform
) {
  return {
    scope: true,
    restrict: 'A',
    link: function (scope, element, attrs) {
      $ionicPlatform.ready(function() {
        var options = {
          frequency: 200
        }

        var watch = $cordovaDeviceOrientation.watchHeading(options).then(
          null, function(error) {
            console.log(error)
          }, function(result) {
            var r = 'rotate(' + -result.trueHeading + 'deg)';
            element.css({
              '-moz-transform': r,
              '-webkit-transform': r,
              '-o-transform': r,
              '-ms-transform': r
            });
          }
        );
      })
    }
  }
})

.directive('imageonload', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('load', function () {
      //call the function that was passed
        scope.$apply(attrs.imageonload);
      });
    }
  };
})

.directive('cameraCanvas', function (
  $http,
  cameraService,
  $rootScope
) {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      var capture = false
      var status = cameraService.getStatus()
      console.log(status)
      if(!status.isOnline) {
          cameraService.startServer().then(function(server) {
            console.log(server)
            cameraService.startCamera(server.url)
          }).catch(function(err) {
            console.log(err)
            cameraService.stopServer().then(function(server) {
              console.log(server)
              cameraService.startServer().then(function(server) {
                cameraService.startCamera(server.url)
              })
            })
          })
      } else {
        cameraService.startCamera(status.url)
      }

      var bin2base64 = function(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      }

      var getPreview = function(url) {
        var url = url
        $http({
          method: 'GET',
          url: url,
          responseType: 'arraybuffer'
        }).then(function(response) {
          var base64 = bin2base64(response.data);
          scope.imageData = base64
          if(!capture) {
            getPreview(url)
          }
        }, function(response) {
          console.error('error in getting static img.' + response);
        });
      }

      $rootScope.$on('camera:started', function(evt, arg) {
        var localImg = arg.url+'/live.jpg';
        console.log(localImg)
        getPreview(localImg)
        // scope.imagePrev = localImg
      })

      scope.capture = function() {
        console.log('captured')
        capture = true
      }
    },
    template: '\
    <img ng-src="data:image/jpg;base64,{{imageData}}" width="100%" height="100%" /> \
    <button style="position:absolute;z-index:999999999;bottom:0px;padding:0px;background:transparent;border:none;margin:auto;left:0px;right:0px;width:7.5em" ng-click="capture"><img src="img/capture.svg" width="100%"></button>\
    '
  };
})
