angular.module('starter.directives', [])
.directive('ionBottomSheet', [function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      controller: [function() {}],
      template: '<div class="modal-wrapper" ng-transclude></div>'
    };
  }])
.directive('ionBottomSheetView', function() {
  return {
    restrict: 'E',
    compile: function(element) {
      element.addClass('bottom-sheet modal');
    }
  };
})
.directive('reportModal', function() {
  return {
        restrict: 'E',
        scope: {
          show: '=',
        },
        controller: function ($scope, $rootScope) {
          $scope.radarHide = function() {
            $rootScope.stateRadar = false;
            $rootScope.hasFooter = true;
            $rootScope.$broadcast('radar:closed');
          }
        },
        templateUrl: '/templates/radar-modal.html',
        compile: function(element) {
          element.css('position','absolute');
          element.css('width','100%');
          element.css('z-index','99999');
          element.css('bottom','0');
          element.css('min-height','initial');
          element.css('top','initial');
          element.css('height','50%');
          element.css('overflow-y','auto');
        }
    }
})
