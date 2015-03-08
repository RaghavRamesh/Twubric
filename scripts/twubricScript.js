angular.module('TwubricModule', [])
    .controller('TwubricController', ['$scope', 'jsonLoader', function($scope, jsonLoader) {
        jsonLoader.loadData('values.json')
            .success(function(data) {
                $scope.values = data;
            });
    }])
    .directive('twubricDirective', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                twitterAccountsInfo: '=info'
            },
            templateUrl: 'card.html',
            link: function(scope, element, attrs) {
                var options = {
                    layoutMode: 'fitRows',
                    itemSelector: '.card-item',
                    resizesContainer: true,
                    getSortData: {
                        total: '.total parseInt',
                        friends: '.friends parseInt',
                        influence: '.influence parseInt',
                        chirpiness: '.chirpiness parseInt'
                    }
                };

                element.isotope(options);
                
                scope.$watch('twitterAccountsInfo', function(newVal, oldVal) {
                    $timeout(function(){
                        element.isotope('reloadItems').isotope({ sortBy: 'original-order' }); 
                        // init datepicker
                        $('#startDateField').datepicker("setDate", "Jan 1, 1970");
                        $('#endDateField').datepicker("setDate", "Jan 31, 1970");
                        $('#endDateField').datepicker({ 
                            dateFormat: 'M d, yy', 
                            changeMonth: true, 
                            changeYear: true, 
                            minDate: new Date('15 Dec, 1969'), 
                            maxDate: new Date('15 Feb, 1970'),
                            onSelect: function() {
                                element.isotope({ filter: filterByDate });
                            } 
                        });
                        $('#startDateField').datepicker({ 
                            dateFormat: 'M d, yy', 
                            changeMonth: true, 
                            changeYear: true, 
                            minDate: new Date('15 Dec, 1969'), 
                            maxDate: new Date('15 Feb, 1970'),
                            onSelect: function(dateText, inst) {
                                element.isotope({ filter: filterByDate });
                                // var date = $.datepicker.parseDate($.datepicker._defaults.dateFormat, dateText);
                                // $("#endDateField").datepicker("option", "minDate", date);
                            } 
                        });
                    });
                }, true); 

                $('#sorts').on('click', 'button', function() {
                    var sortByValue = $(this).attr('data-sort-by');
                    element.isotope({ sortBy: sortByValue });
                });

                element.on('click', '#removeCard', function() {
                    element.isotope('remove', $(this).parents('.card-item'));
                    element.isotope('layout');
                });

                var filterByDate = function() {        
                    var startDate = $('#startDateField').val();
                    var endDate = $('#endDateField').val();
                    var date = $(this).find('.joinDate').text();

                    if (startDate !== undefined && endDate !== undefined && date !== undefined) {
                        date = new Date(date);
                        startDate = new Date(startDate);
                        endDate = new Date(endDate);
                    }
                    
                    return date >= startDate && date <= endDate;
                };
            }
        }
    })
    .factory('jsonLoader', function($http) {
        var jsonLoader = {};
        jsonLoader.loadData = function(url) {
            return $http.get(url);
        };
        return jsonLoader;
    });
