'use strict';

/* Services */
angular.module('acmeMsg.services', ['ngResource']).
value('version', '0.1').
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
                    deferred.resolve(messages[id]);
                }else {
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
                        messages[id].sentDate = (new Date()).getTime();
                        //messages[id].$save();
                        deferred.resolve("Message Sent and Saved");
                    }).
                    error(function(data, status, headers, config){
                        deferred.reject(status);
                    });

                return deferred.promise;
            },
            getGifts : function(){
                return gifts;
            },
            getTypes : function(){
                return types;
            }
        }
    }
]).
factory('User', ['$http', '$rootScope', '$window', '$q',
    function($http, $rootScope, $window, $q) {
        var User = {};
        if($window.sessionStorage.User){
            try{
                User = JSON.parse($window.sessionStorage.User);
            }catch(e){
                User = {};
            }
        }

        return {
            logIn : function(creds) {
                var deferred = $q.defer();

                $http.post('api/auth/login', creds).
                success(function(data, status) {
                    User = data;
                    if(User.auth === true){
                        User.auth = true;
                        $window.sessionStorage.User = JSON.stringify(User);
                        $rootScope.$broadcast('event:loggedIn');
                        deferred.resolve(User);
                    }else {
                        $window.sessionStorage.User = "";
                        User.auth = false;

                        deferred.reject({
                            status: status,
                            message: 'Bad Username or Password'
                        });
                    }
                }).
                error(function(data, status){
                    $rootScope.$broadcast('event:loginFailed');
                    deferred.reject({
                        status: status,
                        message: data
                    });
                });

                return deferred.promise;
            },
            logOut : function() {
                $window.sessionStorage.User = "";
                User.auth = false;
            },
            getUser : function() {
                return User || {};
            },
            isLoggedIn : function() {
                return User.auth || false;
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
        query: {method:'GET', params:{typeId:'types'}, isArray:true}
    });
}]).
factory('Name', ['$resource', function($resource){
    return $resource('api/name/:verb', {}, {
        valid: {method:'POST', params:{verb:'valid'}},
        complete: {method: 'POST', params:{verb: 'complete'}}
    });
}]);
