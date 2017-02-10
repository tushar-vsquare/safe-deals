angular.module("safedeals.states.property", [])
        .config(function ($stateProvider, templateRoot) {
            $stateProvider.state('main.property', {
                'url': '/property/?:propertyMinBudget?:propertyMaxBudget?:propertyDetails?:numberOfRooms?:cityId?',
                'params': {locationMinBudget: null, locationMaxBudget: null, propertyDetails: null, numberOfRooms: null, cityId: null},
                'templateUrl': templateRoot + '/property/property.html',
                'controller': 'PropertyController'
            });
//            $stateProvider.state("main.location.location_detail", {
//                'url': '/:locationId/location_detail',
//                'templateUrl': templateRoot + '/location/location_detail.html',
//                'controller': 'LocationDetailController'
//            });
//            $stateProvider.state("main.location.location_comparison", {
//                'url': '/location_comparison',
//                'templateUrl': templateRoot + '/location/location_comparison.html',
//                'controller': 'LocationComparisionController'
//            });
        })

        .controller('PropertyController', function ($scope, $state, $filter, PropertyService, LocationService, $stateParams, MarketPriceService, CityService, StateService) {
            console.log("State Params :%O", $stateParams);

            $scope.validateForm = function (cityName, minBudget, maxBudget, propertySize) {
                console.log("Min Budget :" + minBudget);
                console.log("Max Budget :" + maxBudget);
                var difference = maxBudget - minBudget;
                console.log("Difference :" + difference);
                if (difference < 0) {
                    alert("Minimum budget is more than maximum budget, Select correct value.");
                }
                else {
                    $scope.searchLocationByLocationAndBudget(cityName, minBudget, maxBudget, propertySize);
                }
            };
            $scope.searchLocationByLocationAndBudget = function (cityName, minBudget, maxBudget, propertySize) {
//                console.log("property:" + propertySize);
//                console.log("City Id :" + cityName);
//                console.log("Min Budget :" + minBudget);
//                console.log("Max Budget :" + maxBudget);
//                $scope.cityObject = CityService.findByCityName({
//                    'name': cityName
//                });
//                console.log("City Object :%O", $scope.cityObject);
//                $state.go('main.location', {
//                    locationMinBudget: minBudget / propertySize,
//                    locationMaxBudget: maxBudget / propertySize,
//                    propertyDetails: propertySize,
//                    cityId: $scope.cityId
//                });
            };
            var map;
            var mapContainer = document.getElementById("locationMapContainer");
            var nagpurCoordinate = new google.maps.LatLng(21.1458, 79.0882);
            var mapProp = {
                center: nagpurCoordinate,
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var drawMap = function () {
                console.log("Priop :%O", mapProp);
                map = new google.maps.Map(mapContainer, mapProp);
            };

            $scope.locations = [];
            $scope.searchStates = function (searchTerm) {
                return StateService.findByNameLike({
                    'name': searchTerm
                }).$promise;
            };
            $scope.selectState = function (state) {
                //only change if not same as previously selected state
                $scope.stateName = state.name;
                $scope.stateId = state.id;
                $scope.state = state;
            };


            $scope.searchCities = function (searchTerm) {
                console.log("State Id :%O", $scope.stateId);
                if ($scope.stateId === undefined) {
                    return CityService.findByNameLike({
                        'name': searchTerm
                    }).$promise;
                } else {
                    return CityService.findByNameAndStateId({
                        'name': searchTerm,
                        'stateId': $scope.stateId
                    }).$promise;
                }
            };
            $scope.selectCity = function (city) {
                //only change if not same as previously selected state
                console.log("City :%O", city);
                $scope.cityName = city.name;
                $scope.cityId = city.id;
                $scope.city = city;
            };

            $scope.searchLocations = function (searchTerm) {
                console.log("Search Term :%O", searchTerm);
                console.log("City Id :%O", $scope.cityId);
                if ($scope.cityId === undefined) {
                    console.log("Coming to if ??");
                    return LocationService.findByNameLike({
                        'name': searchTerm
                    }).$promise;
                } else {
                    console.log("Coming to Else ??");
                    return LocationService.findByNameAndCityId({
                        'name': searchTerm,
                        'cityId': $scope.cityId
                    }).$promise;
                }
            };
            $scope.setLocation = function (location) {
                $scope.locationId = location.id;
                $scope.location = location;
                console.log("$scope.location ", $scope.location);
            };
            drawMap();
            console.log("Location Min Budget :%O", $stateParams.locationMinBudget);
            if ($stateParams.locationMinBudget !== null) {
                console.log("StateParams :%O", $stateParams);
                console.log("In If Loop");
                CityService.get({
                    'id': $scope.cityId                   // cityId is hard coded for 1.0 version
                }, function (city) {
                    map.setCenter({
                        lat: city.latitude,
                        lng: city.longitude
                    });
                    map.setZoom(13);
                });
                console.log("City Id :%O", $stateParams.cityId);
                console.log("Min Budget :%O", $stateParams.locationMinBudget);
                console.log("Max Budget :%O", $stateParams.locationMaxBudget);
                MarketPriceService.findByRequirement({
                    'cityId': $stateParams.cityId, // cityId is hard coded for 1.0 version
                    'locationMinBudget': Math.round($stateParams.locationMinBudget),
                    'locationMaxBudget': Math.round($stateParams.locationMaxBudget)
                }, function (mpObjects) {
                    console.log("$scope.mpObjects =  %O", mpObjects);
                    angular.forEach(mpObjects, function (mpObject) {
                        LocationService.get({
                            'id': mpObject.locationId
                        }, function (location) {
                            $scope.locations.push(location);
                            console.log("Locations :%O", location);
                            drawMarker({lat: location.latitude, lng: location.longitude}, location.name, map);
                            var myCity = new google.maps.Circle({
                                center: new google.maps.LatLng(location.latitude, location.longitude),
                                radius: 750,
                                strokeColor: "#87C4C2",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "#C1E6E5",
                                fillOpacity: 0.2,
                                zoom: 13
                            });
                            myCity.setMap(map);
                            myCity.setMap(map);
                            myCity.setMap(map);
                            map.fitBounds(myCity.getBounds());
//                            myCity.setZoom(13);
                        });
                    });
                    $scope.$watch("locations", function (n, o) {
                        $scope.selectedLocationList = $filter("filter")(n, {flag: true});
                        console.log("What is trues :%O", $scope.selectedLocationList);
                        console.log("Trues Length :%O", $scope.selectedLocationList.length);
                        if ($scope.selectedLocationList.length === 0) {
                            $scope.hideCompareButton = true;
                        } else if ($scope.selectedLocationList.length > 0) {
                            $scope.hideCompareButton = false;
                        }
                        if ($scope.selectedLocationList.length === 3) {
                            console.log("Coming to if?");
                            $scope.hideCheckbox = true;
                        }
                    }, true);
                    $scope.removeLocation = function (location) {
                        console.log("You are called with :%O", location);
                        location.flag = false;
                        var index = $scope.selectedLocationList.indexOf(location);
                        console.log("Index :%O", index);
                        $scope.selectedLocationList.splice(index, 1);
//                        $scope.s
//                        $scope.selectedLocationList.splice(location);
                        console.log("After Removing List:%O", $scope.selectedLocationList);
                        if ($scope.selectedLocationList.length < 3) {
                            $scope.hideCheckbox = false;
                        }
                    };
                    $scope.compareLocations = function () {
                        console.log("Coming to compare??");
                    };
                });
            } else {
                console.log("Coming to else??");
                $scope.$watch('state', function (state) {
                    map.setCenter({
                        lat: state.latitude,
                        lng: state.longitude
                    });
                    map.setZoom(6);
                });
                $scope.$watch('city', function (city) {
                    map.setCenter({
                        lat: city.latitude,
                        lng: city.longitude
                    });
                    map.setZoom(13);
                });
                $scope.$watch('location', function (location) {
                    map.setCenter({
                        lat: location.latitude,
                        lng: location.longitude
                    });
                    map.setZoom(14);
                });
            }
            ;
            var drawMarker = function (position, title, map) {
                console.log("Position :%O", position);
                new google.maps.Marker({
                    map: map,
                    position: position,
                    title: title,
                    icon: 'images/icons_svg/dot.png'
                });
            };
        })
        .controller('LocationComparisionController', function ($scope) {
            console.log("Selected List :%O", $scope.$parent.selectedLocationList);
            $scope.compareList = $scope.$parent.selectedLocationList;
//            console.log("$rootScope", $rootScope);
//            console.log("$parent", $parent);
        })
        .controller('LocationDetailController', function ($scope, $filter, AmenityDetailService, HospitalService, AmenityCodeService, AmenityService, LocationService, MallService, CoordinateService, BranchService, SchoolService, PropertyService, ProjectService, $stateParams) {
            var map;
            var map1;
            var map2;
            var map3;
            var mapContainer = document.getElementById("locationDetailMapContainer");
            console.log("$stateparams ID::::::", $stateParams.locationId);
            var drawMap = function (mapProperty) {
                console.log("Coming To Draw Map %O", mapContainer);
                map = new google.maps.Map(mapContainer, mapProperty);
            };
            var drawMap1 = function (mapProperty, mapContainer1) {
                console.log("Coming To Draw Map 1 :" + mapContainer1);
                map1 = new google.maps.Map(mapContainer1, mapProperty);
            };

            var drawMap2 = function (mapProperty, mapContainer2) {
                console.log("Coming To Draw Map 2 :" + mapContainer2);
                map2 = new google.maps.Map(mapContainer2, mapProperty);
            };

            var drawMap3 = function (mapProperty, mapContainer3) {
                console.log("Coming To Draw Map 3 :" + mapContainer3);
                map3 = new google.maps.Map(mapContainer3, mapProperty);
            };
            var drawMarker = function (position, title, map) {
                console.log("Position :%O", position);
                new google.maps.Marker({
                    map: map,
                    position: position,
                    title: title,
                    icon: 'images/icons_svg/dot.png'
                });
            };
            var drawAmenityMarker = function (position, title, map) {
                console.log("Position :%O", position);
                new google.maps.Marker({
                    map: map,
                    position: position,
                    title: title
                });
            };
            var drawWorkplaceMarker = function (position, title, map) {
                console.log("Position 1 :%O", position);
                new google.maps.Marker({
                    map: map1,
                    position: position,
                    title: title
                });
            };
            LocationService.get({
                'id': $stateParams.locationId
            }, function (location) {
                $scope.location = location;
                var nagpurCoordinate = new google.maps.LatLng(location.latitude, location.longitude);
                var mapProp = {
                    center: nagpurCoordinate,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                drawMap(mapProp);
                drawMarker({lat: location.latitude, lng: location.longitude}, location.name, map);
                var myCity = new google.maps.Circle({
                    center: new google.maps.LatLng(location.latitude, location.longitude),
                    radius: 5000,
                    strokeColor: "#87C4C2",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#C1E6E5",
                    fillOpacity: 0.2,
                    zoom: 13
                });
                myCity.setMap(map);
                map.fitBounds(myCity.getBounds());
            });
            $scope.getAmenityDetailByAmenity = function (amenityDetail) {
                $scope.amenityDetailCityFilter = {
                    'amenityId': amenityDetail.id,
                    'cityId': $scope.location.cityId
                };
                $scope.amenityDetailCityFilter.cityId = $scope.location.cityId;
                AmenityDetailService.findByAmenityIdCityId({
                    'amenityId': amenityDetail.id,
                    'cityId': $scope.location.cityId
                }, function (amenityDetailObject) {
                    $scope.amenityDetailsList = amenityDetailObject;
                    angular.forEach(amenityDetailObject, function (amenityDetail) {
                        drawAmenityMarker({lat: amenityDetail.latitude, lng: amenityDetail.longitude}, amenityDetail.name, map);
//                        var infoWindow = new google.maps.InfoWindow({
//                            'content': amenityDetail.name
//                        });
//                        infoWindow.open(map, drawMarker());
                    });
                });
            };
            $scope.getAmenityDetailByAmenityWorkplaces = function (amenityDetail) {
                $scope.amenityDetailCityFilter = {
                    'amenityId': amenityDetail.id,
                    'cityId': $scope.location.cityId
                };
                $scope.amenityDetailCityFilter.cityId = $scope.location.cityId;
                AmenityDetailService.findByAmenityIdCityId({
                    'amenityId': amenityDetail.id,
                    'cityId': $scope.location.cityId
                }, function (amenityDetailObject) {
                    $scope.amenityDetailsList = amenityDetailObject;
                    angular.forEach(amenityDetailObject, function (amenityDetail) {
                        drawWorkplaceMarker({lat: amenityDetail.latitude, lng: amenityDetail.longitude}, amenityDetail.name, map);
                    });
                });
            };
            $scope.toggle = function () {
                $scope.amenities = !$scope.amenities;
            };
            $scope.locationSteps = [
                'Amenities',
                'Work Places',
                'Projects',
                'Properties',
                'Overview'
            ];
            $scope.selection = $scope.locationSteps[0];
            console.log("What is Selection :%O", $scope.selection);

            $scope.$watch('selection', function (newSelection) {
                console.log("Getting the changed selection :%O", newSelection);
                if (newSelection === "Work Places") {
                    $scope.workplaces = AmenityCodeService.findWorkplaces();
                    console.log("Workplaces List :%O", $scope.workplaces);
                } else if (newSelection === "Projects") {

                } else if (newSelection === "Properties") {

                }
            });

            $scope.amenityCodes = AmenityCodeService.findByTabName({
                'name': $scope.selection
            });
            $scope.locations = [];
            $scope.getCurrentStepIndex = function () {
                // Get the index of the current step given selection
                return _.indexOf($scope.locationSteps, $scope.selection);
            };
//            // Go to a defined step index
            $scope.goToStep = function (index) {
                if (!_.isUndefined($scope.locationSteps[index]))
                {
                    $scope.selection = $scope.locationSteps[index];
                }
            };
//            $scope.amenityCodes = AmenityCodeService.query();
            console.log("Amenity Codes :%O", $scope.amenityCodes);
            $scope.getAmenityByAmenityCode = function (amenityCode) {
                console.log("Amenity COde :%O", amenityCode);
                $scope.amenitiesList = AmenityService.findByAmenityCode({
                    'amenityCodeId': amenityCode.id
                });
                console.log("Amenities List :%O", $scope.amenitiesList);
            };
            $scope.getWorkplaceByAmenityCode = function (amenityCode) {
                console.log("Amenity COde :%O", amenityCode);
                $scope.amenitiesWorkplaceList = AmenityService.findByAmenityCode({
                    'amenityCodeId': amenityCode.id
                });
                console.log("Amenities List :%O", $scope.amenitiesWorkplaceList);
            };
            $scope.myValue = true;
            $scope.getLocationStep = function (locationstep) {
                console.log("Location Step :%O", locationstep);
                $scope.selection = locationstep;
                if (locationstep === "Amenities") {
//                    $scope.amenityCodes = AmenityCodeService.findByTabName({
//                       'name' : AMENITIES
//                    });
                    $scope.myValue = true;
                } else if (locationstep === "Work Places") {
                    $scope.myWorkplaces = true;
                    $scope.myValue = false;
                    $scope.myProjects = false;
                    $scope.myProperties = false;
                    LocationService.get({
                        'id': $stateParams.locationId
                    }, function (location) {
                        var mapContainer1 = document.getElementById("locationDetailMapContainerWorkplaces");
                        var locationCoordinate = new google.maps.LatLng(location.latitude, location.longitude);
                        var mapProp = {
                            center: locationCoordinate,
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        drawMap1(mapProp, mapContainer1);
                        var drawMarker1 = new google.maps.Marker({
                            map: map1,
                            position: locationCoordinate,
                            title: location.name,
                            icon: 'images/icons_svg/dot.png'
                        });
                        var myCity1 = new google.maps.Circle({
                            center: new google.maps.LatLng(location.latitude, location.longitude),
                            radius: 5000,
                            strokeColor: "#87C4C2",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: "#C1E6E5",
                            fillOpacity: 0.2,
                            zoom: 13
                        });
                        myCity1.setMap(map1);
                        drawMarker1.setMap(map1);
                        map1.fitBounds(myCity1.getBounds());
                    });
                }
                else if (locationstep === "Projects") {
                    $scope.myProjects = true;
                    $scope.myWorkplaces = false;
                    $scope.myProperties = false;
                    $scope.myValue = false;
                    LocationService.get({
                        'id': $stateParams.locationId
                    }, function (location) {
                        var mapContainer2 = document.getElementById("locationDetailMapContainerProjects");
                        var locationCoordinate = new google.maps.LatLng(location.latitude, location.longitude);
                        var mapProp = {
                            center: locationCoordinate,
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        drawMap2(mapProp, mapContainer2);
                        var drawMarker2 = new google.maps.Marker({
                            map: map2,
                            position: locationCoordinate,
                            title: location.name,
                            icon: 'images/icons_svg/dot.png'
                        });
                        var myCity2 = new google.maps.Circle({
                            center: locationCoordinate,
                            radius: 5000,
                            strokeColor: "#87C4C2",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: "#C1E6E5",
                            fillOpacity: 0.2,
                            zoom: 13
                        });
                        myCity2.setMap(map2);
                        drawMarker2.setMap(map2);
                        map2.fitBounds(myCity2.getBounds());
                    });
                }
                else if (locationstep === "Properties") {
                    $scope.myProperties = true;
                    $scope.myWorkplaces = false;
                    $scope.myProjects = false;
                    $scope.myValue = false;
                    LocationService.get({
                        'id': $stateParams.locationId
                    }, function (location) {
                        var mapContainer3 = document.getElementById("locationDetailMapContainerProperties");
                        var locationCoordinate = new google.maps.LatLng(location.latitude, location.longitude);
                        var mapProp = {
                            center: locationCoordinate,
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        drawMap3(mapProp, mapContainer3);
                        var drawMarker3 = new google.maps.Marker({
                            map: map3,
                            position: locationCoordinate,
                            title: location.name,
                            icon: 'images/icons_svg/dot.png'
                        });
                        var myCity3 = new google.maps.Circle({
                            center: new google.maps.LatLng(location.latitude, location.longitude),
                            radius: 5000,
                            strokeColor: "#87C4C2",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: "#C1E6E5",
                            fillOpacity: 0.2,
                            zoom: 13
                        });
                        myCity3.setMap(map3);
                        drawMarker3.setMap(map3);
                        map3.fitBounds(myCity3.getBounds());
                    });
                } else {
                    $scope.myValue = false;
                    $scope.myWorkplaces = false;
                    $scope.myProjects = false;
                    $scope.myProperties = false;
                }
            };
        });
//
////angular.module("safedeals.states.property", [])
//        .config(function ($stateProvider, templateRoot) {
//            $stateProvider.state("main.property", {
//                'url': '/property',
//                'templateUrl': templateRoot + '/property/property_content.html',
//                'controller': 'PropertyController'
//            });
//            $stateProvider.state("main.property.property_map_container", {
//                'url': '/property_map',
//                'templateUrl': templateRoot + '/property/property_right_sidebar/properties.html',
//                'controller': 'PropertyMapController'
//            });
//            $stateProvider.state("main.property.project_map_container", {
//                'url': '/project_map',
//                'templateUrl': templateRoot + '/property/property_right_sidebar/projects.html',
//                'controller': 'ProjectMapController'
//            });
//            $stateProvider.state("main.property.school_map_container", {
//                'url': '/school_map',
//                'templateUrl': templateRoot + '/property/property_right_sidebar/schools.html',
//                'controller': 'SchoolMapController'
//            });
//        })
//
//
//        .controller('PropertyController', function ($scope, CoordinateService, PropertyService, MapService, templateRoot) {
//            $scope.slabs = [
//                'INR 5Lac',
//                'INR 25Lac',
//                'INR 50Lac',
//                'INR 75Lac'
//            ];
//            $scope.getMinSlabValue = function(slab){
//                console.log(slab);
//            };
//        })
//        .controller('PropertyMapController', function ($scope, CoordinateService, PropertyService, MapService, templateRoot) {
//            $scope.mapData = {
//                'mapContainer': document.getElementById('mapContainer'),
//                'mapCenter': {
//                    'lat': 21.1500,
//                    'lng': 79.0900
//                },
//                'markers': [
//                ]
//            };
//            $scope.properties = PropertyService.findByLocationId({
//                'locationId': 1
//            }, function (properties) {
//                angular.forEach(properties, function (property) {
//                    $scope.mapData.markers.push({
//                        'lat': property.latitude,
//                        'lng': property.longitude,
//                        'title': property.name
//                    });
//                });
//                MapService.drawMap($scope.mapData);
//            });
////            console.log("mapData", $scope.mapData.markers);
//
//
////            var nagpur = new google.maps.LatLng(21.1500, 79.0900);
////            var dhantoliNagpur = new google.maps.LatLng(21.1418, 79.0843);
////            var initialize = function () {
////                var mapContainer = document.getElementById('mapContainer');
////                var mapProp = {
////                    center: nagpur,
////                    zoom: 13,
////                    mapTypeId: google.maps.MapTypeId.ROADMAP
////                };
////
////                var map = new google.maps.Map(mapContainer, mapProp);
////                var myCity = new google.maps.Circle({
////                    center: dhantoliNagpur,
////                    radius: 500,
////                    editable: true,
////                    draggable: true,
////                    strokeColor: "#0000FF",
////                    strokeOpacity: 0.5,
////                    strokeWeight: 2,
////                    fillColor: "#0000FF",
////                    fillOpacity: 0.2
////                });
////                var marker = new google.maps.Marker({
////                    position: dhantoliNagpur,
////                    map: map,
//////                    icon: 'images/map_markers/office-building.png',
////                    title: 'Dhantoli'
////                });
////                var contentString = '<div id="content">' +
////                        '<div id="siteNotice">' +
////                        '</div>' +
////                        '<div id="bodyContent">' +
////                        '<p><b>Himalaya Mansion</b></br>P. S. Road, Dhantoli<hr>Rs.65 lakhs</br>2 bhk Appartment</p>' +
////                        '</div>' +
////                        '</div>';
////
////                var infowindow = new google.maps.InfoWindow({
////                    content: contentString
////                });
////                marker.addListener('mouseover', function () {
////                    infowindow.open(map, marker);
////                });
////                marker.addListener('mouseout', function () {
////                    infowindow.close(map, marker);
////                });
////                myCity.setMap(map);
////            };
//////            google.maps.event.addDomListener(window, 'load', initialize);
////            initialize();
//        })
//        .controller('ProjectMapController', function ($scope, ProjectService, MapService, templateRoot) {
//            $scope.mapData = {
//                'mapContainer': document.getElementById('mapContainer'),
//                'mapCenter': {
//                    'lat': 21.104836,
//                    'lng': 79.003682
//                },
//                'markers': [
//                ]
//            };
//            $scope.projects = ProjectService.findByLocationId({
//                'locationId': 1
//            }, function (projects) {
//                angular.forEach(projects, function (project) {
//                    console.log("project", project);
//                    $scope.mapData.markers.push({
//                        'lat': project.latitude,
//                        'lng': project.longitude,
//                        'title': project.name
//                    });
//                });
//                MapService.drawMap($scope.mapData);
//            });
//        })
//        .controller('SchoolMapController', function ($scope, SchoolService, MapService, templateRoot) {
//            $scope.mapData = {
//                'mapContainer': document.getElementById('mapContainer'),
//                'mapCenter': {
//                    'lat': 21.104836,
//                    'lng': 79.003682
//                },
//                'markers': [
//                ]
//            };
//            $scope.schools = SchoolService.findByLocationId({
//                'locationId': 1
//            }, function (schools) {
//                angular.forEach(schools, function (school) {
//                    console.log("school", school);
//                    $scope.mapData.markers.push({
//                        'lat': school.latitude,
//                        'lng': school.longitude,
//                        'title': school.name
//                    });
//                });
//                MapService.drawMap($scope.mapData);
//            });
//        });