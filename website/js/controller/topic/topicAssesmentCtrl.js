app.controller('topicAssesmentCtrl', ['$scope', '$state', 'UserService', '$sce', function($scope, $state, UserService, $sce) {

    $scope.getAssessmentsUrl = function(data) {
        if (data) {
            if ($scope.assessmentsUrl != data.assesmentUrl) {
                $scope.isAssessment = true;
            }
            $scope.assessmentsUrl = $sce.trustAsResourceUrl(data.assesmentUrl);
            $scope.assessmentsName = $sce.trustAsResourceUrl(data.name);
        }
    }

    $scope.loadAssessment = function(id, data) {
        $scope.$parent.categoryColors(id);
        $scope.getAssessmentsUrl(data[0]);
    }

    $scope.fullScreenAssessment = function($event) {
        angular.element('html').toggleClass('fullScreenAssessment');
        if (angular.element('html').hasClass('fullScreenAssessment')) {
            $scope.isFullScreen = true;
        } else {
            $scope.isFullScreen = false;
        }
    }

    $scope.AssessmentiframeCallBack = function() {
        $scope.isAssessment = false;
        $scope.$apply();
    }


    $scope.$on('$locationChangeStart', function(event, next, current) {
        if ($scope.isFullScreen) {
            event.preventDefault();
            $('html').removeClass('fullScreenAssessment');
            $scope.isFullScreen = false;
        }
    });


}]);
