'use strict';

/* Directives */
angular.module('acmeMsg.directives', []).
directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}])
.directive('validDate', function (dateFilter) {
    return {
        restrict: 'A',
        require:'ngModel',
        scope: {
            msg: '=myMsg'
        },
        link:function (scope, elm, attrs, ngModel) {
            var dateFormat = attrs['valid-date'] || "yyyy-MM-dd";

            ngModel.$parsers.unshift(function (viewValue) {
                var milli = Date.parse(viewValue);
                if (milli > 0) {
                    //Make sure the birth date is in the past
                    var now = (new Date()).getTime();
                    if (milli >= 0 && milli <= now) {
                        ngModel.$setValidity('isValid', true);
                        return milli;
                    }
                }

                ngModel.$setValidity('isValid', false);
                return milli;
            });

            ngModel.$formatters.unshift(function (modelValue) {
                return dateFilter(modelValue, dateFormat);
            });
        }
    };
})
/**
 * This directive validates the name entered into the textbox
 * against the server's name api. An improvement to this simple check
 * would be to have an autocomplete api (mocked up as complete in the
 * Name service) that would take in the partial name and return a list
 * of the matching names to select from a list. This could be dropped in
 * to replace the current simple validity check and would be far more
 * user friendly. Would require a working API to test against since the
 * response would have to by dynamic. Because we're using an Element 
 * directive here, it could be done simply my altering the directive.
 */
.directive('validName', ['Name','$timeout', function(Name, $timeout) {
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        template: '<input type="text"' + 
                        'ng-invalid="BadText"'+
                        'class="vn-text" />',
        link: function postLink(scope, elem, attr, ngModel) {
            scope.$watch(
                function(){ return ngModel.$viewValue },
                function(value){
                    if(value){
                        Name.valid({name: value},function(rsp){
                            ngModel.$setValidity('invalidName', rsp.isValid);
                        });
                    }
            });
        }
    };
}])
.directive('mustHaveText', ['Name', function(Name) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            msg: '=myMsg',
            mustHave: '@mustHaveText'
        },
        link: function(scope, elem, attr, ngModel) {
            attr.$observe('must-have-text', function(value){
                if(value){
                    ngModel.$setValidity('hasRequiredText', checkForText(ngModel.$viewValue));
                }
            });

            ngModel.$parsers.unshift(function(value) {
                ngModel.$setValidity('hasRequiredText', checkForText(value));
                
                return value;
            });

            function checkForText(val) {
                if(scope.mustHave){
                    var musts = scope.mustHave.split(',');
                    for(var i = 0; i < musts.length; i++){
                        if(val.indexOf(musts[i]) === -1){
                            return false;
                        }
                    }
                    return true;
                }
            }

        }
    };
}]);
