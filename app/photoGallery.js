'use strict';
var app = angular.module('PhotoGallery', ['ui.bootstrap']);
app.controller('PhotoGalleryController', function($scope, $uibModal) {

  $scope.buildArray = function(pageNumber) {
    $scope.photoArray = [];
    for (var i = $scope.firstPhoto[pageNumber - 1]; i <= $scope.lastPhoto[pageNumber - 1]; i++) {
      var source = $scope.filePrefix + i + $scope.fileSuffix;
      $scope.photoArray.push(source);
    }
  };

  $scope.click = function(pageNumber) {
    $scope.buildArray(pageNumber);
  };

  $scope.init = function() {
    var perPage = Number($scope.perPage);
    var totalPhotos = Number($scope.totalPhotos);
    $scope.photoArray = [];
    $scope.buttons = [];
    // determine the first photo and the last photo to appear on each page/button.
    // the equal division of photos results in the number of buttons needed.
    $scope.firstPhoto = [];
    $scope.lastPhoto = [];
    $scope.go = true;
    $scope.page = 0;

    while ($scope.go) {
      if ($scope.page === 0) {
        $scope.firstPhoto.push(1);
        $scope.lastPhoto.push(perPage);
      } else {
        var nextFirst = $scope.lastPhoto[$scope.page - 1] + 1;
        var nextLast = nextFirst + perPage;
        if (nextLast > totalPhotos) {
          nextLast = totalPhotos;
        }
        $scope.firstPhoto.push(nextFirst);
        $scope.lastPhoto.push(nextLast);
      }

      $scope.buttons.push($scope.page + 1);
      if ($scope.lastPhoto[$scope.page] === totalPhotos) {
        $scope.go = false;
      } else {
        $scope.page++;
      }
    }
    $scope.buildArray(1);
  };

  $scope.clickAction = function($index) {
    $uibModal.open({
      animation: false,
      templateUrl: './photoModal.html',
      controller: 'PhotoGalleryModalController',
      size: 'sm',
      resolve: {
        photo: function() {
          return {
            "index": $index,
            "photoArray": $scope.photoArray
          };
        }
      }
    });
  };

  $scope.init();

});
app.directive('photoGalleryDirective', function() {
  return {
    restrict: 'E',
    scope: {
      perPage: '@',
      totalPhotos: '@',
      filePrefix: '@',
      fileSuffix: '@'
    },
    templateUrl: './photoTemplate.html',
    controller: 'PhotoGalleryController'
  }
});
app.controller('PhotoGalleryModalController', function($scope, $uibModalInstance, photo) {

  $scope.init = function() {
    $scope.photo = photo;
    $scope.photoIndex = Number(photo.index);
    $scope.photoArray = photo.photoArray;
    $scope.showHideButtons();
  };

  $scope.showHideButtons = function() {
    $scope.modalPhoto = $scope.photoArray[$scope.photoIndex];
    if ($scope.photoIndex === 0) {
      $scope.hidePrevious = true;
    } else {
      $scope.hidePrevious = false;
    }
    if ($scope.photoIndex === ($scope.photoArray.length - 1)) {
      $scope.hideNext = true;
    } else {
      $scope.hideNext = false;
    }
  };

  $scope.prev = function() {
    $scope.photoIndex--;
    $scope.showHideButtons();
  };

  $scope.next = function() {
    $scope.photoIndex++;
    $scope.showHideButtons();
  };

  $scope.init();
});
