// Script file

var month;
var months;
var monthDays;
var currMonth;
// clock related
var time;
var h;
var m;
var s;

var weatherSituation;
var prevWeather;

var d = new Date();
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


/*
*   Year & Month current being displayed on the calendar
*/
var calYear = d.getFullYear();
var calMonth = d.getMonth();
currMonth = months[calMonth] + ' ' + calYear;

initMonth(calYear, calMonth);
updateClockTime();
updateWeather();

// Angular App object
var dashApp;
dashApp = angular.module("dashApp", ['ngRoute']);
 
dashApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'welcome.html',
            controller: 'WelcomeController'
        })
        .when('/calendar', {
            templateUrl: 'calendar.html',
            controller: 'CalendarController'
        })
        .when('/clock', {
            templateUrl: 'clock.html',
            controller: 'ClockController'
        })
        .when('/weather', {
            templateUrl: 'weather.html',
            controller: 'WeatherController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

dashApp.controller('WelcomeController', ['$scope', function($scope) {
}]);

dashApp.controller('CalendarController', ['$scope', function($scope) {
    $scope.month = month;
    var day = new Date();
    $scope.monthName = currMonth;
    // console.log('CalendarController started.');
}]);


dashApp.controller('ClockController', ['$scope', function($scope) {
    $scope.time = time;
    $scope.h = h;
    $scope.m = m;
    $scope.s = s;
}]);

dashApp.controller('WeatherController', ['$scope', function($scope) {
}]);



function init()
{
	/*
	* Initialize things before Controller that controller needs
	*/
	// initMonth();
}

function initMonth(thisYear, thisMonth)
{
	month = [
		['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		['', '', '', '', '', '', ''],
		['', '', '', '', '', '', ''],
		['', '', '', '', '', '', ''],
		['', '', '', '', '', '', '']
	];

    var week = ['', '', '', '', '', '', ''];

	monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var day = new Date(thisYear, thisMonth, 1);

    // first day number of week of first week of current month
    var prevMonRemDays = new Date(thisYear, thisMonth, 1).getDay();
    
    var weeks = 5;
    // now add current months days
    numDays = monthDays[ thisMonth ];
    if (thisMonth == 1 && thisYear % 4 == 0) // feb of leap year
        numDays = 29;

    for (var i = 0; i < numDays; i++ ) {
    	// week 0 contains day names
    	// week 1's start dates contain some of the dates from previous month
    	monWeek = parseInt( (i+prevMonRemDays) / 7 ) + 1;

        // the first time it becomes 5 (total weeks = 6 i.e. 0-5)
        // add another week
        if (monWeek > 4 && weeks == 5) {
            var newweek = week.slice();
            month.push(newweek);
            weeks = 6;
        }

        // the first time it becomes 6 (total weeks = 7 i.e. 0-6)
        // add another week to have month a total of 7 rows.
        if (monWeek > 5 && weeks == 6) {
            var newweek = week.slice();
            month.push(newweek);
            weeks = 7;
        }

        var weekDayNum = (i + prevMonRemDays) % 7;
        month[monWeek][weekDayNum] = i + 1;
    }

    // console.log(month);
}

function prevMonth()
{
    if (calMonth == 0) // i.e. currently january is displayed
    { 
        calMonth = 11; // december
        calYear--;
    } else {
        calMonth--;
    }

    initMonth(calYear, calMonth);
    // console.log(month);
    currMonth = months[calMonth] + ' ' + calYear;
}

function nextMonth($route)
{
    if (calMonth == 11) // i.e. december
    {
        calMonth = 0;   // january
        calYear++;      // of next year
    } else {
        calMonth++;
    }

    initMonth(calYear, calMonth);
    // console.log(month);
    currMonth = months[calMonth] + ' ' + calYear;
}

/**
* Clock Methods
*/
function updateClockTime() {
    var day = new Date();
    h = makeDoubleDig(day.getHours());
    m = makeDoubleDig(day.getMinutes());
    s = makeDoubleDig(day.getSeconds());
    
    time = h + ":" + m + ":" + s;
    // time = '<span id="h">' + h + '</span id="m">:<span>' + m + '</span>:<span id="s">' + s + '</span>';

    // console.log(time);
    $("#time").text(time);
    if (prevWeather !== weatherSituation)
        $("#temp").text(weatherSituation);
    var t = setTimeout(updateClockTime, 200);
}

function makeDoubleDig(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}


/**
* Weatther Methods
*/
function updateWeather()
{
    $.ajax({
        dataType: 'json',
        url: 'http://api.openweathermap.org/data/2.5/weather?q=Islamabad,pk&appid=2de143494c0b295cca9337e1e96b00e0',
        success: function(result) {
            var desc = result.weather[0].main;
            var temp = Math.round(result.main.temp - 273.16, 3);

            prevWeather = weatherSituation;
            weatherSituation = temp + 'C ' + desc;
        }
    })
}

function hideX() {
    // $("#x").hide();
    $("#x").css('visibility', 'hidden');
    // console.log('hide');
}

function showX() {
    // $("#x").show();
    $("#x").css('visibility', 'visible');
    // console.log('show');
}