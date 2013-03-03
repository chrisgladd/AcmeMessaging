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


    it('should create "user" model with user fetched from  successful authentication', 
        function() {
            expect(scope.user).toEqual({});

            scope.login();
            $httpBackend.flush();

            expect(scope.user).toEqualData(userData());
        }
    );

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

    it('should sort the inbox by added date', function() {
        expect(scope.inboxOrder).toBe('added');
    });

    it('should sort the processed list by sent date', function() {
        expect(scope.procOrder).toBe('sentDate');
    });

  });

    describe('MsgCtrl', function(){
        var scope, ctrl, $httpBackend,
            msgData = function(){
                return {
                    "id" : 0,
                    "type" : {
                        "id" : 0,
                        "name" : "Birthday Wish",
                        "msg" : "Mate, Happy Birthday. To celebrate this once a year occasion we have picked the following gift: [gift]. Enjoy."
                    },
                    "firstName" : "John",
                    "lastName" : "Smith",
                    "gift" : {
                        "id" : 0,
                        "name" : "A Tie"
                    },
                    "message" : "",
                    "added" : 1359900200000,
                }
            };

        beforeEach(inject(
            function(_$httpBackend_, $rootScope, $controller, $routeParams) {
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET('api/message/messages').respond([msgData()]);
                $httpBackend.expectGET('api/gift/gifts').respond([]);
                $httpBackend.expectGET('api/type/types').respond([]);

                $httpBackend.expectGET('api/message/0').respond(msgData());

                $routeParams.messageId = '0';
                scope = $rootScope.$new();
                ctrl = $controller(MsgCtrl, {$scope: scope});
            }));

        it('should create "msg" model with message fetched api', 
            function() {
                expect(scope.msg).toEqual(undefined);
                $httpBackend.flush();

                var msg = msgData();
                msg.fullname = 'John Smith';
                msg.text = 'Mate, Happy Birthday. To celebrate this once a year occasion we have picked the following gift: [gift]. Enjoy.';
                msg.requiredText = '[gift]';

                expect(scope.msg).toEqualData(msg);
        });

        it('should create "gifts" model from api', 
            function() {
                expect(scope.gifts).toEqual(undefined);
                $httpBackend.flush();

                expect(scope.gifts).toEqualData([]);
        });

        it('should create "returnValue" model from api', 
            function() {
                expect(scope.returnValue).toEqual(undefined);
                $httpBackend.flush();

                expect(scope.returnValue).toEqualData("Cancel");
        });
    });
});
