'use strict';

/* jasmine specs for controllers go here */
describe('acmeMsg controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('acmeMsg.services'));

  describe('MenuCtrl', function(){
    var scope, ctrl;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller(MenuCtrl, {$scope: scope});
    }));

    it('should initialize showMenu to false', function() {
      expect(scope.showMenu).toBe(false);
    });


    it('should toggle showMenu to true', function() {
      expect(scope.showMenu).toBe(false);

      scope.toggleMenu();

      expect(scope.showMenu).toBe(true);
    });

    it('should set loggedIn to true', function(){
        scope.eventLoggedOut();
        expect(scope.loggedIn).toBe(false);

        scope.eventLoggedIn();

        expect(scope.loggedIn).toBe(true);
    });

    it('should set loggedIn to false', function(){
        scope.eventLoggedOut();
        expect(scope.loggedIn).toBe(false);
        scope.eventLoggedIn();
        expect(scope.loggedIn).toBe(true);

        scope.eventLoggedOut();
        expect(scope.loggedIn).toBe(false);
    });

    it('should set loggedIn to false', function(){
        scope.eventLoggedOut();
        expect(scope.loggedIn).toBe(false);
        scope.eventLoggedIn();
        expect(scope.loggedIn).toBe(true);

        scope.eventLoginRequired();
        expect(scope.loggedIn).toBe(false);
    });

    it('should set loggedIn to false', function(){
        expect(scope.loggedIn).toBe(false);
        scope.eventLoggedIn();
        expect(scope.loggedIn).toBe(true);

        scope.eventHideUser();
        expect(scope.loggedIn).toBe(false);
    });
  });

  describe('LoginCtrl', function(){
    var scope, ctrl, $httpBackend, 
      userData = function(){
          return {
            "id" : 1,
            "auth" : true,
            "imageURL" : "img/me.jpg",
            "name" : "Chris Gladd"
          };
    };

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectPOST('api/auth/login',{user:"cmg301@gmail.com",pass:"blkajdf"}).respond(200, userData());

      scope = $rootScope.$new();
      ctrl = $controller(LoginCtrl, {$scope: scope});
    }));


    it('should create "user" model with user fetched from login', function() {
      scope.login();
      $httpBackend.flush();
    });

  });

  describe('InboxCtrl', function(){
    var scope, ctrl, $httpBackend, 
        messagesData = function(){
            return [
                {id: 0, type:0},
                {id: 1, type:1},
                {id: 2, type:0}
            ];
        },
        giftData = function(){
            return [
                {id: 0, name:"Gift 1"},
                {id: 1, name:"Gift 2"},
                {id: 2, name:"Gift 3"}
            ];
        },
        typeData = function(){
            return [
                {id: 0, name:"Birthday Wish"},
                {id: 1, name:"Congrats on the birth of your child"},
            ];
        };

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('api/message/messages').respond(messagesData());
      $httpBackend.expectGET('api/gift/gifts').respond(giftData());
      $httpBackend.expectGET('api/type/types').respond(typeData());

      scope = $rootScope.$new();
      ctrl = $controller(InboxCtrl, {$scope: scope});
    }));


    it('should create "messages" model with messages fetched from the api', function() {
        expect(scope.messages).toEqual([]);
        $httpBackend.flush();
        expect(scope.messages).toEqualData(messagesData());
    });

  });


  /*describe('PhoneDetailCtrl', function(){
    var scope, $httpBackend, ctrl,
        xyzPhoneData = function() {
          return {
            name: 'phone xyz',
                images: ['image/url1.png', 'image/url2.png']
          }
        };


    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/xyz.json').respond(xyzPhoneData());

      $routeParams.phoneId = 'xyz';
      scope = $rootScope.$new();
      ctrl = $controller(PhoneDetailCtrl, {$scope: scope});
    }));


    it('should fetch phone detail', function() {
      expect(scope.phone).toEqualData({});
      $httpBackend.flush();

      expect(scope.phone).toEqualData(xyzPhoneData());
    });
  });*/

});
