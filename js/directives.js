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
}])
.directive('wconDonutChart', [function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        replace: false,
        scope: {
            data: '=ngModel',
            bgColor: '@',
            fgColor: '@',
            size: '@',
            donutWidth: '@',
            textSize: '@'
        },
template: "<canvas width='{{size}}' height='{{size}}' style='position:absolute;left:0;top:0;'></canvas>"+
                  "<div style='width:100%;position:absolute;top:0;left:0;line-height:{{size}}px;font-family:Arial,sans-serif;font-size:{{textSize}};font-weight:bold;text-align:center;'>{{percentText}}</div>",
        link: function(scope, element, attrs) {
            console.log(scope.donutWidth);
            scope.data.percentage = scope.data.percentage || 50;
            scope.bgColor = scope.bgColor || "transparent";
            scope.fgColor = scope.fgColor || "#f80";
            scope.size = scope.size || "160";
            scope.donutWidth = scope.donutWidth || "20";
            scope.textSize = scope.textSize || "3em";
            console.log(scope.donutWidth);

            element.css('position', 'relative');
            element.css('width', scope.size+"px");
            element.css('height', scope.size+"px");

            scope.canvas = element.children("canvas")[0];
            scope.ctx = scope.canvas.getContext('2d');

            scope.getSettings = function() {
                return {
                    bgColor : scope.bgColor,
                    fgColor : scope.fgColor,
                    size : scope.size,
                    donutwidth : scope.donutWidth,
                    textSize : scope.textSize,
                };
            };

            scope.drawBg = function(settings) {
                console.log("DRAWING BACKGROUND");
                console.log(settings);
                scope.ctx.clearRect(0,0,settings.size,settings.size);
                scope.ctx.beginPath();
                scope.ctx.fillStyle = settings.bgColor;
                scope.ctx.arc(settings.size/2,settings.size/2,settings.size/2,0,2*Math.PI,false);
                scope.ctx.arc(settings.size/2,settings.size/2,settings.size/2-settings.donutwidth,0,2*Math.PI,true);
                scope.ctx.fill();
            };

            scope.drawFg = function(settings, percent){
                console.log("DRAWING FOREGROUND");
                console.log(settings);
                var ratio = percent/100 * 360;
                var startAngle = Math.PI*-90/180;
                var endAngle = Math.PI*(-90+ratio)/180;

                scope.ctx.beginPath();
                scope.ctx.fillStyle = settings.fgColor;
                scope.ctx.arc(settings.size/2,settings.size/2,settings.size/2,startAngle,endAngle,false);
                scope.ctx.arc(settings.size/2,settings.size/2,settings.size/2-settings.donutwidth,endAngle,startAngle,true);
                scope.ctx.fill();
            };

            scope.animate = function() {
                scope.$apply(function(){
                    scope.current++;
                    scope.percentText = scope.current+"%";
                });

                scope.drawBg(scope.getSettings());
                scope.drawFg(scope.getSettings(), scope.current);
                if (scope.current >= scope.data.percentage) {
                    clearInterval(scope.animInterval);
                }
            };

            scope.startAnimate = function(){
                scope.current = 0;
                scope.percentText = scope.current+"%";
                scope.ctx = scope.canvas.getContext('2d');
                scope.animInterval = setInterval(scope.animate,20); 
            };

            scope.startAnimate();
        }
    };
}]);
