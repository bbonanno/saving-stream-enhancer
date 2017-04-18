// ==UserScript==
// @name           Saving-Stream-Enhancer => my-loans/live
// @version        0.9
// @timestamp      2017-04-18T16:22:43.742Z
// @author         Bruno Bonanno
// @match          https://lendy.co.uk/my-loans/live
// @homepageURL    https://github.com/bbonanno/saving-stream-enhancer
// @downloadURL    https://github.com/bbonanno/saving-stream-enhancer/raw/master/dist/lendy/my-loans/live.user.js
// @require        http://code.jquery.com/jquery-latest.min.js
// @require        https://raw.githubusercontent.com/christianbach/tablesorter/master/jquery.tablesorter.min.js
// ==/UserScript==

"use strict";

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
            }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        (function () {
            'use strict';

            var util = require('../../util.js');

            $.tablesorter.addParser(new util.MoneyParser());
            $.tablesorter.addParser(new util.DaysParser());

            var table = $("table");

            var ASSET_DETAILS = 0,
                DRAWNDOWN = 1,
                REMAINING_TERM = 2,
                INVESTED_AMOUNT = 7,
                INTEREST = 8,
                DETAILS = 9,
                ASCENDING = 0,
                DESCENDING = 1;

            table.tablesorter({
                headers: {
                    2: {
                        sorter: 'days'
                    },
                    3: {
                        sorter: 'money'
                    }
                },
                sortList: [[REMAINING_TERM, ASCENDING]]
            });

            var additions = '<label for="sell">Sell: </label> ' + '<input class="filter"  id="sell" type="number" value="60"/> ' + '<label for="caution">Caution: </label> ' + '<input class="filter"  id="caution" type="number" value="90"/> ' + '<label id="totalLoans"></label>';

            table.before(additions);

            function updateTotal() {
                $('#totalLoans').text("Holding " + table.find("tbody tr.js-loan-parts-table").length + " Loans");
            }

            function filter() {
                table.find("tbody tr").css({ 'color': 'green', 'font-weight': 'bold' }).filter(function () {
                    return util.numberOfDays($($(this).find('td')[REMAINING_TERM]).text()) <= parseInt($("#caution").val(), 10);
                }).css({ 'color': 'orange' }).filter(function () {
                    return util.numberOfDays($($(this).find('td')[REMAINING_TERM]).text()) <= parseInt($("#sell").val(), 10);
                }).css({ 'color': 'red' });

                updateTotal();
            }

            $(".filter").change(filter);

            filter();
        })();
    }, { "../../util.js": 2 }], 2: [function (require, module, exports) {
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

        var numberOfDays = function numberOfDays(s) {
            return parseInt(s.toLowerCase().replace('days', '').replace('day', '').trim());
        };

        var money = function money(s) {
            return parseFloat(s.replace('£', '').replace(',', '').trim());
        };

        var percentage = function percentage(s) {
            return parseInt(s.replace('%', '').trim());
        };

        module.exports = {

            numberOfDays: numberOfDays,

            money: money,

            percentage: percentage,

            MoneyParser: function MoneyParser() {
                return new NumericParser('money', money);
            },

            DaysParser: function DaysParser() {
                return new NumericParser('days', money);
            }
        };
    }, {}] }, {}, [1]);