//To access file reader data in controller, variable defined here
var csvFileData;
var csvFileName;
var fileObject;

window.mlaApp.directive('fileReader', function() {
  return {
    scope: {
      fileReader:"=",
      fileContent : "@"
    },
    link: function(scope, element) {
      $(element).on('change', function(changeEvent) {
        var files = changeEvent.target.files;
        csvFileName = files[0].name;
        fileObject = changeEvent.target.files;
        if (files.length) {
          var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;
              scope.$apply(function () {
                scope.fileReader = contents;
                scope.fileContent = contents;
                csvFileData = scope.fileContent;
                csvFileName = files[0].name;
              });
          };
          r.readAsText(files[0]);
        }
      });
    }
  };
});