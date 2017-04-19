// ==UserScript==
// @name           Saving-Stream-Enhancer => loans/available
// @version        0.15
// @timestamp      2017-04-19T09:31:00.827Z
// @author         Bruno Bonanno
// @match          https://lendy.co.uk/loans/available
// @homepageURL    https://github.com/bbonanno/saving-stream-enhancer
// @downloadURL    https://raw.githubusercontent.com/bbonanno/saving-stream-enhancer/master/dist/lendy/loans/available.user.js
// @require        http://code.jquery.com/jquery-latest.min.js
// @require        https://raw.githubusercontent.com/christianbach/tablesorter/master/jquery.tablesorter.min.js
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _util = require('../../util.js');

(function () {

    $.tablesorter.addParser(_util.moneyParser);
    $.tablesorter.addParser(_util.daysParser);

    var table = $("table");

    var ANNUAL_RETURN = 4,
        REMAINING_TERM = 6,
        INVESTED_AMOUNT = 7,
        AVAILABLE_TO_BUY = 8,
        ASCENDING = 0,
        DESCENDING = 1;

    var headers = {};
    headers[REMAINING_TERM] = new _util.Header(_util.daysParser.id);
    headers[INVESTED_AMOUNT] = new _util.Header(_util.moneyParser.id);
    headers[AVAILABLE_TO_BUY] = new _util.Header(_util.moneyParser.id);

    table.tablesorter({
        headers: headers,
        sortList: [[ANNUAL_RETURN, DESCENDING], [REMAINING_TERM, DESCENDING], [AVAILABLE_TO_BUY, ASCENDING]]
    });

    var additions = '<label for="remainingDaysEnabled">Remaining Days: </label> ' + '<input class="filter"  id="remainingDaysEnabled" type="checkbox" checked/> ' + '<input class="filter"  id="remainingDays" type="number" value="90"/> ' + '<label for="investedAmountEnabled">Invested Amount: </label> ' + '<input class="filter"  id="investedAmountEnabled" type="checkbox" checked/> ' + '<input class="filter"  id="investedAmount" type="number" value="0"/> ' + '<label for="availableAmountEnabled">Available Amount: </label> ' + '<input class="filter"  id="availableAmountEnabled" type="checkbox" checked/> ' + '<input class="filter"  id="availableAmount" type="number" value="50"/> ' + '<label id="totalLoans"></label>';

    table.before(additions);

    var filterNumberOfDays = function filterNumberOfDays(tds) {
        if ($('#remainingDaysEnabled:checked').length > 0) {
            return (0, _util.numberOfDays)($(tds[REMAINING_TERM]).text()) >= parseInt($("#remainingDays").val(), 10);
        }
        return true;
    };

    var filterInvestedAmount = function filterInvestedAmount(tds) {
        if ($('#investedAmountEnabled:checked').length > 0) {
            return (0, _util.money)($(tds[INVESTED_AMOUNT]).text()) <= parseInt($("#investedAmount").val(), 10);
        }
        return true;
    };

    var filterAvailableAmount = function filterAvailableAmount(tds) {
        if ($('#availableAmountEnabled:checked').length > 0) {
            return (0, _util.money)($(tds[AVAILABLE_TO_BUY]).text()) >= parseInt($("#availableAmount").val(), 10);
        }
        return true;
    };

    function filter() {
        table.find("tbody tr").hide().filter(function () {
            var tds = $(this).find("td");
            return filterNumberOfDays(tds) && filterInvestedAmount(tds) && filterAvailableAmount(tds);
        }).show().filter(function () {
            return (0, _util.percentage)($($(this).find('td')[ANNUAL_RETURN]).text()) % 2 === 0;
        }).css('font-weight', 'bold');

        $('#totalLoans').text("Available: " + table.find("tbody tr:visible").length + " of " + table.find("tbody tr").length + " Loans");
    }

    $(".filter").change(filter);

    filter();
})();

},{"../../util.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var NumericParser = function NumericParser(id, parser) {
    return {
        id: id,
        is: function is() {
            return false;
        },
        format: function format(s) {
            if (s.trim().length > 0) return parser(s);else return Number.MAX_SAFE_INTEGER;
        },
        type: 'numeric'
    };
};

var numberOfDays = exports.numberOfDays = function numberOfDays(s) {
    return parseInt(s.toLowerCase().replace('days', '').replace('day', '').trim());
};

var money = exports.money = function money(s) {
    return parseFloat(s.replace('£', '').replace(',', '').trim());
};

var percentage = exports.percentage = function percentage(s) {
    return parseInt(s.replace('%', '').trim());
};

var moneyParser = exports.moneyParser = new NumericParser('money', money);

var daysParser = exports.daysParser = new NumericParser('days', numberOfDays);

var Header = exports.Header = function Header(sorterId) {
    return { sorter: sorterId };
};

},{}]},{},[1]);
