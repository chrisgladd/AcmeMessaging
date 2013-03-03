'use strict';


// Declare app level module which depends on filters, and services
angular.module('acmeMsg', ['acmeMsg.filters', 'acmeMsg.services', 'acmeMsg.directives'])
.config(function($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);

    $routeProvider.when('/', 
        {templateUrl: 'view/splash.html', controller: SplashCtrl});

    $routeProvider.when('/login', 
        {templateUrl: 'view/login.html', controller: LoginCtrl});

    $routeProvider.when('/inbox', 
        {templateUrl: 'view/inbox.html', controller: InboxCtrl});

    $routeProvider.when('/message/:messageId', 
        {templateUrl: 'view/message.html', controller: MsgCtrl});

    $routeProvider.otherwise({redirectTo: '/login'});
})
/**
 * If the user isn't authenticated and tries to access the API
 * this intercepter will broadcast the loginRequired event to ask for login
 */
.config(function($httpProvider) {
    var interceptor = ['$rootScope','$q', function(scope, $q) {
        function success(response) {
            return response;
        }

        function error(response) {
            var status = response.status;

            //Not Authenticated
            if (status == 401) {
                //Save the request configuration and deferred
                //For now, we're not cacheing requests but in a
                //real application we can retry the request on
                //successful authentication then return the user 
                //to the correct view they were trying to access.

                /*var deferred = $q.defer();
                var req = {
                    config: response.config,
                    deferred: deferred
                }
                scope.requests401.push(req);*/

                scope.$broadcast('event:loginRequired');
                //If we're retrying, we keep the promise
                //return deferred.promise;
            }
            // otherwise
            // return $q.reject(response);

        }

        return function(promise) {
            return promise.then(success, error);
        }
    }];
    $httpProvider.responseInterceptors.push(interceptor);
});
