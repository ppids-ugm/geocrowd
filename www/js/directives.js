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
});
