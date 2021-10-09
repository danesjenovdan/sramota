app.directive("newsItem", function() {


    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '='         },
        template: '<div>{{ myVal }}</div>',
        templateUrl: 'mytemplate.html',
        link: function ($scope, element, attrs) {

        }
    };
});