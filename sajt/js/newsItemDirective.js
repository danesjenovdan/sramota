app.directive("newsItem", function($sce) {
    return {
        restrict: 'EA',
        scope: {
            item: '='
        },
        templateUrl: 'js/views/newsDirective.html',
        link: function (scope, element, attrs) {

            scope.renderHtml = function(html_code) {
                return $sce.trustAsHtml(html_code) ;
            };
        }
    };
});