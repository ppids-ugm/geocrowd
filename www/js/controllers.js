angular.module('starter.controllers', [])
.controller('mainController', function($scope) {
  angular.extend($scope, {
    defaults: {
      tileLayerOptions: {
        opacity: 0.9,
        detectRetina: true,
        reuseTiles: true,
      },
      zoomControl: false
    }
  })
  $scope.center = {
    lat: -7,
    lng: 110,
    zoom: 8
  }
})

.controller('menuController', function(
  $scope,
  $ionicModal
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
  $ionicModal.fromTemplateUrl('/templates/radar.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalRadar = modal;
  });
  $scope.radarShow = function() {
    $scope.modalRadar.show();
  };
  $scope.radarHide = function() {
    $scope.modalRadar.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modalRadar.remove();
  });
})
