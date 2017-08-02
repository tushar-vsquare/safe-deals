angular.module("safedeals.states.builder_portal", [])
        .config(function ($stateProvider, templateRoot) {
            $stateProvider.state('admin.builder_portal', {
                'url': '/builder_portal/:userId/:companyName',
                'templateUrl': templateRoot + '/builderanddeveloper/builder_menu.html',
                'controller': 'BuilderPortalController'
            });
        })

        .controller('BuilderPortalController', function ($scope, $stateparams) {
            console.log("Hello Into builder Portal");
            console.log("Are we getting stateparams here?? :%O", $stateparams);
        });



