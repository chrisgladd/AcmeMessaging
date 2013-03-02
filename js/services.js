'use strict';

/* Services */
angular.module('acmeMsg.services', ['ngResource']).
factory('Data', ['$http', '$q', 'Message','Gift','Type', 
    function($http, $q, Message, Gift, Type){
        var messages = [];
        var gifts = [];
        var types = [];

        Message.query(function(data) {
            for(var i = 0; i < data.length; i++){
                var msg = data[i];
                messages[msg.id] = msg;
            }
        });
        Gift.query(function(data) {
            for(var i = 0; i < data.length; i++){
                var gift = data[i];
                gifts[gift.id] = gift;
            }
        });
        Type.query(function(data) {
            for(var i = 0; i < data.length; i++){
                var type = data[i];
                types[type.id] = type;
            }
        });

        return {
            getMessages : function() {
                return messages;
            },
            getMessage : function(id){
                var deferred = $q.defer();

                if(typeof messages[id] !== "undefined"){
                    console.log("Cached Message");
                    deferred.resolve(messages[id]);
                }else {
                    console.log("Fetching Message");
                    Message.get({messageId: id}, function(data){
                        deferred.resolve(data);
                    });
                }

                return deferred.promise;
            },
            sendMessage : function(id){
                messages[id].message = messages[id].buildMessage();
                var deferred = $q.defer();

                $http.post('api/message/send',JSON.stringify(messages[id])).
                    success(function(data, status, headers, config) {
                        messages[id].sent = true;
                        //messages[id].$save();
                        deferred.resolve("Message Send and Saved");
                    }).
                    error(function(data, status, headers, config){
                        deferred.reject(status);
                    });

                return deferred.promise;
            },
            getGifts : function(){
                return gifts;
            },
            getGift : function(id){
                return gifts[id];
            },
            getTypes : function(){
                return types;
            },
            getType : function(id){
                return types[id];
            }
        }
    }
]).
factory('User', ['$http', '$rootScope', '$window',
    function($http, $rootScope, $window) {
        var User = {};
        if($window.sessionStorage.User){
            try{
                User = JSON.parse($window.sessionStorage.User);
            }catch(e){
                User = {};
            }
        }

        return {
            logIn : function() {
                $http.post('api/auth/login').success(function(data) {
                    User = data;
                    if(User.auth === true){
                        User.auth = true;
                        $window.sessionStorage.User = JSON.stringify(User);
                        $rootScope.$broadcast('event:loggedIn');
                    }else {
                        $window.sessionStorage.User = "";
                        User.auth = false;
                    }
                });
            },
            logOut : function() {
                $window.sessionStorage.User = "";
                User.auth = false;
            },
            getUser : function() {
                return User;
            },
            isLoggedIn : function() {
                return User.auth;
            }
        }
    }
]).
factory('Message', ['$resource', '$filter', 'Gift', function($resource, $filter, Gift){
    var Message =  $resource('api/message/:messageId', {}, {
        query: {method:'GET', params:{messageId:'messages'}, isArray:true}
    });

    Message.prototype.getName = function(){
        return this.firstName + " " + this.lastName;
    };

    Message.prototype.getFullBabyname = function() {
        return this.babyname + " " + this.lastName;
    };

    Message.prototype.getBirthdate = function(dateFormat) {
        return $filter('date')(this.birthdate, dateFormat || 'mediumDate');
    };

    Message.prototype.setBirthdate = function(date) {
        this.birthdate = Date.parse(date);
    };

    Message.prototype.getRequiredText = function(){
        if(this.type && this.text){
            switch(this.type.id){
                case 0:
                    return "[gift]";
                case 1:
                    return "[babyname],[birthdate]";
                default:
                    return "";
                    break;
            }
        }
    };
    Message.prototype.buildMessage = function(){
        if(this.type && this.text){
            switch(this.type.id){
                case 0:
                    return this.text.replace("[gift]", this.gift.name);
                case 1:
                    var retMsg = this.text.replace("[babyname]", this.getFullBabyname());
                    return retMsg.replace("[birthdate]", this.getBirthdate());
                default:
                    return this.type.msg;
                    break;
            }
        }
    };

    return Message;
}]).
factory('Gift', ['$resource', function($resource){
    return $resource('api/gift/:giftId', {}, {
        query: {method:'GET', params:{giftId:'gifts'}, isArray:true}
    });
}]).
factory('Type', ['$resource', function($resource){
    return $resource('api/type/:typeId', {}, {
        query: {method:'GET', params:{giftId:'types'}, isArray:true}
    });
}]).
factory('Name', ['$resource', function($resource){
    return $resource('api/name/:verb', {}, {
        valid: {method:'GET', params:{verb:'valid'}},
        complete: {method: 'GET', params:{verb: 'complete'}}
    });
}]);
