'use strict';

var directives = angular.module('directives', []);

directives.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
    	  
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$parent.file = file;
        scope.$apply();
      });
    }
  };
});



directives.directive('filethumbnail', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
    	  
        var files = event.target.files;
        var file_thumbnail = files[0];
        scope.file_thumbnail = file_thumbnail;
        scope.$parent.file_thumbnail = file_thumbnail;
        scope.$apply();
      });
    }
  };
});


