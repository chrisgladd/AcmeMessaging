'use strict';

/* jasmine specs for services go here */

describe('acmeMsg Services', function() {
    var userData = function(){
      return {
        "id" : 1,
        "auth" : true,
        "imageURL" : "img/me.jpg",
        "name" : "Chris Gladd"
      };
    },messagesData = function(){
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

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    beforeEach(module('acmeMsg.services'));

    describe('Data Service', function() {
        var $httpBackend, data;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
          $httpBackend = _$httpBackend_;

          $httpBackend.whenGET('api/message/messages').respond(messagesData());
          $httpBackend.whenGET('api/gift/gifts').respond(giftData());
          $httpBackend.whenGET('api/type/types').respond(typeData());

          $httpBackend.whenGET('api/message/0').respond({});

          $httpBackend.whenPOST('api/message/send').respond(true);
        }));

        beforeEach(inject(function(Data) {
          data = Data;
        }));

        it('should get "messages" model from Data service', 
            function() {
                expect(data.getMessages()).toEqual([]);
                $httpBackend.flush();
                expect(data.getMessages()).toEqualData(messagesData());
        });

        it('should get a single "message" model from Data service', 
            function() {
                $httpBackend.flush();
                data.getMessage(0).then(function(msg){
                    expect(msg).toEqualData(messagesData()[0]);
                });
        });

        it('should send a single "message" to the Data service', 
            function() {
                $httpBackend.flush();
                data.sendMessage(0).then(function(rsp){
                    expect(rsp).toBe("Message Sent and Saved");
                });
        });

        it('should get "gifts" model from Data service', 
            function() {
                expect(data.getGifts()).toEqual([]);
                $httpBackend.flush();
                expect(data.getGifts()).toEqualData(giftData());
        });

        it('should get "types" model from Data service', 
            function() {
                expect(data.getTypes()).toEqual([]);
                $httpBackend.flush();
                expect(data.getTypes()).toEqualData(typeData());
        });

    })

});
