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

    $scope.back = function() {
        window.history.back();
    };

    $scope.logout = function() {
        User.logOut();
        $rootScope.$broadcast('event:loggedOut');
    };

    /**
     * Login Event Handlers
     */
    $scope.$on('event:loggedIn', function() {
        $scope.loggedIn = true;
        $scope.user = User.getUser();
        $location.path('/inbox/');
    });

    $scope.$on('event:loggedOut', function() {
        $scope.loggedIn = false;
        $location.path('/login/');
    });

    $scope.$on('event:loginRequired', function() {
        //Save Current Location

        //Log the user out and ask for authentication
        User.logOut();
        $scope.loggedIn = false;
        $location.path('/login/');
    });
    
    $scope.$on('event:hideUser', function() {
        $scope.loggedIn = false;
    });
}
/**
 * Protects the AngularJS injection process when the js code
 * is run through a minifier, makes sure injection is not destroyed
 */
MenuCtrl.$inject = ['$scope', '$rootScope', '$location', 'User'];

/**
 * Controller for Splash Page Animation
 */
function SplashCtrl($scope, $location, $timeout) {
    $scope.skip = function() {
        $timeout.cancel(animTimeout);
        $location.path('/login/');
    };

    var animTimeout = $timeout( $scope.skip, 1000 );
}
SplashCtrl.$inject = ['$scope', '$location', '$timeout'];

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
        User.logIn();
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
    if($scope.messages[0]){
        console.log($scope.messages[0]);
        console.log($scope.messages[0].sent);
    }
}
InboxCtrl.$inject = ['$scope', 'Data'];

/**
 * Message Controller
 */
function MsgCtrl($scope, $routeParams, $location, Data) {
    var promise = Data.getMessage($routeParams.messageId);

    promise.then(function(message) {
        $scope.msg = message;
        $scope.isGift = ($scope.msg.type.id === 0);
        $scope.isBaby = ($scope.msg.type.id === 1);

        $scope.msg.fullname = $scope.msg.getName();
        $scope.msg.text = $scope.msg.type.msg;
        $scope.msg.requiredText = $scope.msg.getRequiredText();
        console.log($scope.msg.text);
        $scope.birthdate = $scope.msg.getBirthdate("yyyy-MM-dd");

        $scope.gifts = Data.getGifts();
        $scope.names = [];
    });

    $scope.giftChanged = function(){
        $scope.msg.gift = Data.getGift($scope.msg.gift.id);
    };

    $scope.dateChanged = function(){
        $scope.msg.setBirthdate($scope.birthdate);
    };

    $scope.send = function() {
        var promise = Data.sendMessage($scope.msg.id);

        promise.then(function(response){
            console.log(typeof $scope.msg.sent);
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

/** 
 * About Controller
 * Info about how the app was contructed
 */
function AboutCtrl($scope){
    $scope.list = [
        { name: "Author", value: "Chris Gladd" },
        { name: "OS", value: "Ubuntu 12.04" },
        { name: "Editor", value: "gVim" },
        { name: "Browser", value: "Chrome" },
        { name: "Framework", value: "AngularJS 1.0.3" },
        { name: "CSS", value: "Sass using Compass" },
        { name: "Tested On", value: "Chrome (Desktop, iPhone), Safari (iPad, iPhone)" }
    ];
}
AboutCtrl.$inject = ['$scope'];