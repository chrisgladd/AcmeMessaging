'use strict';

//Development Flag
var D = true;

/**
 * Menu Controller Functionality
 * User Menu, Logo
 */
function MenuCtrl($scope, $rootScope, $location, User) {
    $scope.loggedIn = User.isLoggedIn();
    $scope.user = User.getUser();
    $scope.showMenu = false;

    /**
     * Click Event Handlers
     */
    $scope.toggleMenu = function() {
        $scope.showMenu = !$scope.showMenu;
    };

    $scope.nav = function(path) {
        $location.path('/'+path+'/');
    };

    $scope.logout = function() {
        User.logOut();
        $rootScope.$broadcast('event:loggedOut');
    };

    /**
     * Login Event Handlers
     */
    $scope.eventLoggedIn = function() {
        $scope.loggedIn = true;
        $scope.user = User.getUser();
        $location.path('/inbox/');
    };
    $scope.eventLoggedOut = function() {
        $scope.loggedIn = false;
        $location.path('/login/');
    };
    $scope.eventLoginRequired = function() {
        //Log the user out and ask for authentication
        User.logOut();
        $scope.loggedIn = false;
        $location.path('/login/');
    };
    $scope.eventHideUser = function() {
        $scope.loggedIn = false;
    };

    $scope.$on('event:loggedIn', $scope.eventLoggedIn);
    $scope.$on('event:loggedOut', $scope.eventLoggedOut);
    $scope.$on('event:loginRequired', $scope.eventLoginRequired);
    $scope.$on('event:hideUser', $scope.eventHideUser);
}
/**
 * Protects the AngularJS injection process when the js code
 * is run through a minifier, makes sure injection is not destroyed
 */
MenuCtrl.$inject = ['$scope', '$rootScope', '$location', 'User'];

/**
 * Controller for Splash Page Animation
 */
function SplashCtrl($scope, $location, $timeout, $rootScope) {
    if(D){
        $scope.useTimer = true;
    }else {
        $scope.useTimer = false;
    }

    $scope.skip = function() {
        $timeout.cancel(animTimeout);
        $location.path('/login/');
    };

    var animTimeout = $scope.useTimer ? $timeout( $scope.skip, 1500 ) : null;
    $rootScope.$broadcast('event:hideUser');
}
SplashCtrl.$inject = ['$scope', '$location', '$timeout', '$rootScope'];

/**
 * Login Controller
 * Starts Authentication with the Server
 * Broadcasts event:loggedIn if successful
 */
function LoginCtrl($scope, $location, User, $rootScope) {
    if(D){
        $scope.loginEmail = "cmg301@gmail.com";
        $scope.loginPass = "blkajdf";
    }

    $scope.login = function() {
        //Authentication
        var promise = User.logIn({user: $scope.loginEmail, pass: $scope.loginPass});

        promise.then(function(rsp) {
            if(typeof rsp.error === "undefined"){
                $scope.user = rsp;
            }else{
                $scope.status = rsp.status;
                $scope.error = rsp.message;
            }
        });
    };

    $scope.user = User.getUser();
    $rootScope.$broadcast('event:hideUser');
}
LoginCtrl.$inject = ['$scope', '$location', 'User', '$rootScope'];

/**
 * Inbox Controller
 */
function InboxCtrl($scope, Data) {
    $scope.messages = Data.getMessages();
    $scope.inboxOrder = "added";
    $scope.procOrder = "sentDate";

    $scope.donut = {
        percentage : 50
    };
}
InboxCtrl.$inject = ['$scope', 'Data'];

/**
 * Message Controller
 */
function MsgCtrl($scope, $routeParams, $location, Data) {
    var promise = Data.getMessage($routeParams.messageId);

    promise.then(function(message) {
        $scope.msg = message;

        $scope.msg.fullname = $scope.msg.getName();
        $scope.msg.text = $scope.msg.type.msg;
        $scope.msg.requiredText = $scope.msg.getRequiredText();

        $scope.gifts = Data.getGifts();

        $scope.returnValue = $scope.msg.sent ? "Back" : "Cancel";
    });

    $scope.giftChanged = function(){
        $scope.msg.gift = Data.getGift($scope.msg.gift.id);
    };

    $scope.send = function() {
        var promise = Data.sendMessage($scope.msg.id);

        promise.then(function(response){
            $location.path('/inbox/');
        },
        function(reason){
            //Update UI for failure
        });
    };

    $scope.cancel = function() {
        //Reset the object here?

        //Go back to inbox
        $location.path('/inbox/');
    };
}
MsgCtrl.$inject = ['$scope', '$routeParams', '$location', 'Data'];
