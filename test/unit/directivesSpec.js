'use strict';

/* jasmine specs for unit testing of directives */
describe('Valid Name Directive', function() {

    beforeEach(module('acmeMsg.services'));
    beforeEach(module('acmeMsg.directives'));

    var element,
        controller,
        scope,
        $httpBackend;
    
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $compile) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectPOST('api/name/valid',{name:"Sam"}).respond({
            isValid: true
        });
        scope = $rootScope.$new();
        scope.name = "Sam";

        element = angular.element('<form name="TestForm"><valid-name name="TestValid" ng-model="name"/></form>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('should contain a valid name', function() {
        $httpBackend.flush();
        expect(scope.TestForm.TestValid.$error.invalidName).toBe(false);
    });

});
