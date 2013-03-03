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
                    //Make sure the birth data is in the past
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
 * of the matching names to select from a list. This would require a
 * restrict: 'E' directive but wouldn't be too hard to drop in to 
 * replace the current simple validity check and would be far more
 * user friendly. Would require a working API to test against since the
 * response would have to by dynamic.
 */
.directive('validName', ['Name', function(Name) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {
            Name.valid({name: ngModel.$viewValue},function(rsp){
                ngModel.$setValidity('isBabyName', rsp.isValid);
            });
            
            ngModel.$parsers.unshift(function(value) {
                Name.valid({name: value},function(rsp){
                    ngModel.$setValidity('isBabyName', rsp.isValid);
                });
                
                return value;
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
