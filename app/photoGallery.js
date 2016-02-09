'use strict';
angular.module('photoGallery', ['ui.bootstrap.modal'])
  .controller('photoGalleryController', function($scope) {

    $scope.buildArray = function(pageNumber) {
      $scope.photoArray = [];
      for (var i = $scope.firstPhoto[pageNumber - 1]; i <= $scope.lastPhoto[pageNumber - 1]; i++) {
        var source = $scope.galleryConfig.filePrefix + i + $scope.galleryConfig.fileSuffix;
        $scope.photoArray.push(source);
      }
    };

    $scope.click = function(pageNumber) {
      $scope.buildArray(pageNumber);
    };

    $scope.init = function() {
      $scope.galleryConfig = {
        perPage: 5,
        totalPhotos: 5,
        filePrefix: 'images/photo',
        fileSuffix: '.jpg'
      };
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
          $scope.lastPhoto.push($scope.galleryConfig.perPage);
        } else {
          var nextFirst = $scope.lastPhoto[$scope.page - 1] + 1;
          var nextLast = nextFirst + $scope.galleryConfig.perPage;
          if (nextLast > $scope.galleryConfig.totalPhotos) {
            nextLast = $scope.galleryConfig.totalPhotos;
          }
          $scope.firstPhoto.push(nextFirst);
          $scope.lastPhoto.push(nextLast);
        }

        $scope.buttons.push($scope.page + 1);
        if ($scope.lastPhoto[$scope.page] === $scope.galleryConfig.totalPhotos) {
          $scope.go = false;
        } else {
          $scope.page++;
        }
      }
      $scope.buildArray(1);
    };

    $scope.init();

  })
  .directive('photoGalleryDirective', function($uibModal) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        photoArray: '='
      },
      templateUrl: './photoTemplate.html',
      controller: function($scope) {
        $scope.clickAction = function($index) {
          $uibModal.open({
            animation: false,
            templateUrl: 'photoModal.html',
            controller: 'photoGalleryModalController',
            controllerAs: 'modal',
            size: 'lg',
            resolve: {
              photo: function() {
                return {
                  "index": $index,
                  "photoArray": $scope.photoArray
                };
              }
            }
          });
        }
      }
    }
  })
  .controller('photoGalleryModalController', function($scope, $uibModalInstance, photo) {

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
