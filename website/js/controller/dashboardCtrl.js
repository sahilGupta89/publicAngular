app.controller('dashboardCtrl', ['$scope', '$window', '$rootScope', 'UserService', '$state', function($scope, $window, $rootScope, UserService, $state) {

    /*Check object*/
    if (Object.getOwnPropertyNames($rootScope.globals).length === 2) {
        /*Get current user detail*/
        $scope.user = {
            id: $rootScope.globals.currentUser.data._id
        }
    }

    $scope.data = {};

    /**
     *Get Dashboard
     */
    $scope.dashboard = function() {
        $scope.isLoading = true;
        UserService.dashboard()
            .then(function(res) {
                $scope.isLoading = false;
                if (res.data.statusCode == 200) {

                    /**
                     *Initialize getLicense function
                     */
                    $scope.getLicense(res.data.license.allocatedLicense, res.data.license.usedLicense);

                    /**
                     *agent data
                     */
                    $scope.agents = res.data.childData;
                    if ($scope.agents.length > 0) {
                        $scope.data.agent = $scope.agents[0]._id;
                        $scope.data.enganged = $scope.agents[0]._id;
                    }

                    /**
                     *customer data
                     */
                    $scope.customers = res.data.customers;
                    $scope.customerPieChart($scope.customers);


                }

            });
    }


    /**
     *initialize dashboard function
     */
    $scope.dashboard();


    /**
     *get license data
     *@param total = allocatedLicense
     *@param used = usedLicense
     */
    $scope.getLicense = function(total, used) {
        $scope.totalLicense = total;
        $scope.usedLicense = used;
        $scope.license = total - used;
        $scope.licenseGraph($scope.license, $scope.totalLicense);
    }

    /**
     *License Graph
     *@param license = $scope.license 
     *@param max = $scope.totalLicense
     */
    $scope.licenseGraph = function(license, max) {
        Highcharts.chart('licenseGraph', {
            chart: {
                type: 'solidgauge',
                marginTop: 0,
            },
            title: {
                text: null
            },

            tooltip: {
                enabled: false,
                borderWidth: 0,
                backgroundColor: 'none',
                shadow: false,
                style: {
                    fontSize: '16px'
                },
                pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                positioner: function(labelWidth) {
                    return {
                        x: 100 - labelWidth / 2,
                        y: 52
                    };
                }
            },
            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{
                    outerRadius: '115%',
                    innerRadius: '85%',
                    backgroundColor: '#f2f2f2',
                    borderWidth: 0
                }]
            },

            yAxis: {
                min: 0,
                max: max,
                lineWidth: 1,
                tickPositions: [],
                lineColor: '#ccc',
            },

            plotOptions: {
                solidgauge: {
                    borderWidth: '10px',
                    dataLabels: {
                        enabled: false
                    },
                    linecap: 'round',
                    stickyTracking: false,
                },
            },

            series: [{
                name: 'License',
                borderColor: '#4CAF50',
                data: [{
                    color: '#4CAF50',
                    radius: '100%',
                    innerRadius: '100%',
                    y: license
                }]
            }]
        });
    }


    $scope.customerPieChart = function(data) {
        Highcharts.chart('customerPieChart', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                marginTop: 0
            },
            title: {
                text: null
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<small>{point.key}</small>:',
                pointFormat: '<span style="color:{point.color}">{point.y}</span> ({point.percentage:.1f}%)',
                style: {
                    fontSize: '16px'
                }
            },
            plotOptions: {
                pie: {
                    /*innerSize: 50,*/
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: false,
                        format: '{point.percentage:.1f} %',
                    },
                    showInLegend: false,
                    point: {
                        events: {
                            legendItemClick: function(e) {
                                e.preventDefault();
                            }
                        }
                    }

                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Student',
                    y: data.students,
                    color: '#DC5149'
                }, {
                    name: 'Teacher',
                    y: data.teachers,
                    color: '#30A5FF'
                }, {
                    name: 'Sub Agent',
                    y: data.sub_agent,
                    color: '#44B5B3'
                }, {
                    name: 'School',
                    y: data.school,
                    color: '#F38630'
                }]
            }]
        });
    }






    /**
     *Change Agent's customers data
     */
    $scope.$watch('data.agent', function(oldValue, newValue) {
        if (oldValue != newValue) {
            angular.forEach($scope.agents, function(value, key) {
                if (value._id == $scope.data.agent) {
                    $scope.agentDataGraph(value);
                }
            });
        }
    });


    /**
     *Agent Data Graph
     */
    $scope.agentDataGraph = function(data) {
        Highcharts.chart('agentDataGraph', {
            chart: {
                type: 'column'
            },
            title: {
                text: data.emailId,
                style: {
                    fontSize: '14px'
                }
            },
            xAxis: {
                categories: [
                    'Student',
                    'Teacher',
                    'Sub Agent',
                    'School'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                }
            },
            tooltip: {
                headerFormat: '<table><tr><td style="color:{point.color};padding:0">{point.key}&nbsp;:&nbsp;</td>',
                pointFormat: '<td style="padding:0"><b>{point.y}</b></td>',
                footerFormat: '</tr></table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    showInLegend: false
                }
            },
            series: [{
                data: [{ y: data.studentCount, color: '#F56A62' }, { y: data.teacherCount, color: '#30A5FF' }, { y: data.sub_agentCount, color: '#44B5B3' }, { y: data.schoolCount, color: '#F38630' }]

            }]
        });
    }


    /**
     *Change Agent's customers's engegement hours data
     */
    $scope.$watch('data.enganged', function(oldValue, newValue) {
        if (oldValue != newValue) {
            angular.forEach($scope.agents, function(value, key) {
                if (value._id == $scope.data.enganged) {
                    $scope.engangedTimeGraph(value);
                }
            });
        }
    });

    /**
     *Get Enganged Time for agent's customer
     */
    $scope.engangedTimeGraph = function(data) {
        Highcharts.chart('engangedTimeGraph', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: data.emailId,
                style: {
                    fontSize: '14px'
                }
            },
            tooltip: {
                headerFormat: '<table><tr>',
                pointFormat: '<td style="color:{point.color};padding:0">{point.name}&nbsp;:&nbsp;</td><td style="padding:0"><b>{point.y}</b></td>',
                footerFormat: '</tr></table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Student',
                    color: '#F56A62',
                    y: parseFloat(((data.engangedTimeStudent) / 60 / 60).toFixed(2))
                }, {
                    name: 'Teacher',
                    color: '#30A5FF',
                    y: parseFloat(((data.engangedTimeTeacher) / 60 / 60).toFixed(2))
                }]
            }]
        });
    }



    /**
     *Set page height
     */
    angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 47)) + 'px' });
    angular.element($window).bind('resize', function() {
        angular.element('.page-wrapper').css({ 'minHeight': ($window.innerHeight - (parseInt(angular.element('header.navbar').outerHeight()) + 47)) + 'px' });
    });


}]);
