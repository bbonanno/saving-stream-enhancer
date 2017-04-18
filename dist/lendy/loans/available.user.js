// ==UserScript==
// @name           Saving-Stream-Enhancer => loans/available
// @version        0.6
// @timestamp      2017-04-18T16:13:30.337Z
// @author         Bruno Bonanno
// @match          https://lendy.co.uk/loans/available
// @homepageURL    https://github.com/bbonanno/saving-stream-enhancer
// @downloadURL    https://github.com/bbonanno/saving-stream-enhancer/raw/master/dist/lendy/loans/available.user.js
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

            $.tablesorter.addParser(new util.NumericParser('days', numberOfDays));
            $.tablesorter.addParser(new util.NumericParser('money', money));

            var table = $("table");

            var ASSET_DETAILS = 0,
                DRAWNDOWN = 1,
                ASSET_ALUE = 2,
                LOAN = 3,
                ANNUAL_RETURN = 4,
                LTV = 5,
                REMAINING_TERM = 6,
                INVESTED_AMOUNT = 7,
                AVAILABLE_TO_BUY = 8,
                INTEREST_STATUS = 9,
                ASCENDING = 0,
                DESCENDING = 1;

            table.tablesorter({
                headers: {
                    6: {
                        sorter: 'days'
                    },
                    7: {
                        sorter: 'money'
                    },
                    8: {
                        sorter: 'money'
                    }
                },
                sortList: [[ANNUAL_RETURN, DESCENDING], [REMAINING_TERM, DESCENDING], [AVAILABLE_TO_BUY, ASCENDING]]
            });

            var additions = '<label for="remainingDaysEnabled">Remaining Days: </label> ' + '<input class="filter"  id="remainingDaysEnabled" type="checkbox" checked/> ' + '<input class="filter"  id="remainingDays" type="number" value="90"/> ' + '<label for="investedAmountEnabled">Invested Amount: </label> ' + '<input class="filter"  id="investedAmountEnabled" type="checkbox" checked/> ' + '<input class="filter"  id="investedAmount" type="number" value="0"/> ' + '<label for="availableAmountEnabled">Available Amount: </label> ' + '<input class="filter"  id="availableAmountEnabled" type="checkbox" checked/> ' + '<input class="filter"  id="availableAmount" type="number" value="50"/> ' + '<label id="totalLoans"></label>';

            table.before(additions);

            function updateTotal() {
                $('#totalLoans').text("Available: " + table.find("tbody tr:visible").length + " of " + table.find("tbody tr").length + " Loans");
            }

            function filterNumberOfDays(tds) {
                if ($('#remainingDaysEnabled:checked').length > 0) {
                    return util.numberOfDays($(tds[REMAINING_TERM]).text()) >= parseInt($("#remainingDays").val(), 10);
                }
                return true;
            }

            function filterInvestedAmount(tds) {
                if ($('#investedAmountEnabled:checked').length > 0) {
                    return util.money($(tds[INVESTED_AMOUNT]).text()) <= parseInt($("#investedAmount").val(), 10);
                }
                return true;
            }

            function filterAvailableAmount(tds) {
                if ($('#availableAmountEnabled:checked').length > 0) {
                    return util.money($(tds[AVAILABLE_TO_BUY]).text()) >= parseInt($("#availableAmount").val(), 10);
                }
                return true;
            }

            function filter() {
                table.find("tbody tr").hide().filter(function () {
                    var tds = $(this).find("td");
                    return filterNumberOfDays(tds) && filterInvestedAmount(tds) && filterAvailableAmount(tds);
                }).show().filter(function () {
                    return util.percentage($($(this).find('td')[ANNUAL_RETURN]).text()) % 2 === 0;
                }).css('font-weight', 'bold');

                updateTotal();
            }

            $(".filter").change(filter);

            filter();
        })();
    }, { "../../util.js": 2 }], 2: [function (require, module, exports) {
        module.exports = {

            numberOfDays: function numberOfDays(s) {
                return parseInt(s.toLowerCase().replace('days', '').replace('day', '').trim());
            },

            money: function money(s) {
                return parseFloat(s.replace('£', '').replace(',', '').trim());
            },

            percentage: function percentage(s) {
                return parseInt(s.replace('%', '').trim());
            },

            NumericParser: function NumericParser(id, parser) {
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
            }
        };
    }, {}] }, {}, [1]);