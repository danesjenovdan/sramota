let app = angular.module('freedom', ['nvd3']);
app.filter
(
    "trust", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }
    ]
)

app.directive('onError', function() {
    return {
        restrict:'A',
        link: function(scope, element, attr) {
            element.on('error', function() {
                element.attr('src', attr.onError);
            })
        }
    }
})