// ==UserScript==
// @name           Saving-Stream-Enhancer => my-loans/live
// @version        0.16.7
// @timestamp      2017-07-30T21:03:15.653Z
// @author         Bruno Bonanno
// @match          https://lendy.co.uk/my-loans/live
// @homepageURL    https://github.com/bbonanno/saving-stream-enhancer
// @downloadURL    https://raw.githubusercontent.com/bbonanno/saving-stream-enhancer/master/dist/lendy/my-loans/live.user.js
// @require        http://code.jquery.com/jquery-latest.min.js
// @require        https://raw.githubusercontent.com/christianbach/tablesorter/master/jquery.tablesorter.min.js
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _util = require('../../util.js');

(function () {

    var table = $("table");
    var tbody = table.find('tbody');
    var footerRow = tbody.find('tr:last-child');
    footerRow.remove();
    table.append('<tfoot></tfoot>');
    table.find('tfoot').append(footerRow);
    footerRow.css({ 'font-weight': 'bold', 'font-size': '16pt' });

    $.tablesorter.addParser(_util.moneyParser);
    $.tablesorter.addParser(_util.daysParser);

    var REMAINING_TERM = 2,
        INVESTED_AMOUNT = 3,
        ASCENDING = 0;

    var headers = {};
    headers[REMAINING_TERM] = new _util.Header(_util.daysParser.id);
    headers[INVESTED_AMOUNT] = new _util.Header(_util.moneyParser.id);

    table.tablesorter({
        headers: headers,
        sortList: [[REMAINING_TERM, ASCENDING]]
    });

    var additions = '<label for="sell">Sell: </label> ' + '<input class="filter"  id="sell" type="number" value="60"/> ' + '<label for="caution">Caution: </label> ' + '<input class="filter"  id="caution" type="number" value="90"/> ' + '<label id="totalLoans"></label>' + '<p style="font-weight: bold;" id="balancedInterest"></p>';

    table.before(additions);

    function filter() {
        var caution = parseInt($("#caution").val(), 10);
        var sell = parseInt($("#sell").val(), 10);

        table.find("tbody tr.js-loan-parts-table").css({ 'color': 'green', 'font-weight': 'bold' }).filter(function () {
            return (0, _util.numberOfDays)($($(this).find('td')[REMAINING_TERM]).text()) <= caution;
        }).css({ 'color': 'orange' }).filter(function () {
            return (0, _util.numberOfDays)($($(this).find('td')[REMAINING_TERM]).text()) <= sell;
        }).css({ 'color': 'red' });

        $('#totalLoans').text("Holding " + table.find("tbody tr.js-loan-parts-table").length + " Loans");
    }

    $(".filter").change(filter);

    filter();

    $.fn.reduce = [].reduce;
    $.get('https://lendy.co.uk/_fragments/Loan/UserLoanParts', function (data) {
        var rows = $(data).find('tbody tr');
        var interest = rows.map(function (i, r) {
            var columns = $(r).find('td');
            return (0, _util.money)($(columns[3]).text()) * (0, _util.percentage)($(columns[5]).text()) / 100;
        }).reduce(function (acc, cur) {
            return acc + cur;
        }, 0);

        var total = rows.map(function (i, r) {
            var columns = $(r).find('td');
            return (0, _util.money)($(columns[3]).text());
        }).reduce(function (acc, cur) {
            return acc + cur;
        }, 0);

        $('#balancedInterest').text('Balanced interest: ' + Math.round(interest / total * 10000) / 100 + '%');
    });
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
