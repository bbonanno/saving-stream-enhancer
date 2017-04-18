// ==UserScript==
// @name         Loans Available
// @namespace    https://github.com/bbonanno/
// @version      0.3
// @author       Bruno Bonanno
// @match        https://lendy.co.uk/loans/available
// @downloadURL  https://github.com/bbonanno/saving-stream-enhancer/raw/master/src/loans-available.user.js
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://raw.githubusercontent.com/christianbach/tablesorter/master/jquery.tablesorter.min.js
// ==/UserScript==

(function () {
    'use strict';

    function numberOfDays(s) {
        return parseInt(s.toLowerCase().replace('days', '').replace('day', '').trim());
    }

    function money(s) {
        return parseFloat(s.replace('£', '').replace(',', '').trim());
    }

    function percentage(s) {
        return parseInt(s.replace('%', '').trim());
    }

    function NumericParser(id, parser) {
        return {
            id: id,
            is: function () {
                return false;
            },
            format: function (s) {
                if (s.trim().length > 0)
                    return parser(s);
                else
                    return Number.MAX_SAFE_INTEGER;
            },
            type: 'numeric'
        }
    }

    $.tablesorter.addParser(new NumericParser('days', numberOfDays));
    $.tablesorter.addParser(new NumericParser('money', money));

    var table = $("table");

    var
        ASSET_DETAILS = 0,
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
        DESCENDING = 1
    ;

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

    var additions = '<label for="remainingDaysEnabled">Remaining Days: </label> ' +
        '<input class="filter"  id="remainingDaysEnabled" type="checkbox" checked/> ' +
        '<input class="filter"  id="remainingDays" type="number" value="90"/> ' +
        '<label for="investedAmountEnabled">Invested Amount: </label> ' +
        '<input class="filter"  id="investedAmountEnabled" type="checkbox" checked/> ' +
        '<input class="filter"  id="investedAmount" type="number" value="0"/> ' +
        '<label for="availableAmountEnabled">Available Amount: </label> ' +
        '<input class="filter"  id="availableAmountEnabled" type="checkbox" checked/> ' +
        '<input class="filter"  id="availableAmount" type="number" value="50"/> ' +
        '<label id="totalLoans"></label>';

    table.before(additions);

    function updateTotal() {
        $('#totalLoans').text("Available: " + table.find("tbody tr:visible").length + " of " + table.find("tbody tr").length + " Loans");
    }

    function filterNumberOfDays(tds) {
        if ($('#remainingDaysEnabled:checked').length > 0) {
            return numberOfDays($(tds[REMAINING_TERM]).text()) >= parseInt($("#remainingDays").val(), 10);
        }
        return true;
    }

    function filterInvestedAmount(tds) {
        if ($('#investedAmountEnabled:checked').length > 0) {
            return money($(tds[INVESTED_AMOUNT]).text()) <= parseInt($("#investedAmount").val(), 10);
        }
        return true;
    }

    function filterAvailableAmount(tds) {
        if ($('#availableAmountEnabled:checked').length > 0) {
            return money($(tds[AVAILABLE_TO_BUY]).text()) >= parseInt($("#availableAmount").val(), 10);
        }
        return true;
    }

    function filter() {
        table.find("tbody tr")
            .hide()
            .filter(
                function () {
                    var tds = $(this).find("td");
                    return filterNumberOfDays(tds) &&
                        filterInvestedAmount(tds) &&
                        filterAvailableAmount(tds);
                }).show()
            .filter(
                function () {
                    return percentage($($(this).find('td')[ANNUAL_RETURN]).text()) % 2 === 0;
                }).css('font-weight', 'bold');

        updateTotal();
    }

    $(".filter").change(filter);

    filter();

})();
