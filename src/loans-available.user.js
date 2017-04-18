// ==UserScript==
// @name         Loans Available
// @namespace    https://github.com/bbonanno/
// @version      0.1
// @author       Bruno Bonanno
// @match        https://lendy.co.uk/loans/available
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

    // add parser through the tablesorter addParser method
    $.tablesorter.addParser({
        // set a unique id
        id: 'days',
        is: function () {
            // return false so this parser is not auto detected
            return false;
        },
        format: function (s) {
            // format your data for normalization
            if (s.trim().length > 0)
                return numberOfDays(s);
            else
                return Number.MAX_SAFE_INTEGER;
        },
        // set type, either numeric or text
        type: 'numeric'
    });

    var table = $("table");

    table.tablesorter({
        headers: {
            6: {
                sorter: 'days'
            }
        },
        sortList: [[4, 1], [7, 0], [6, 1], [8, 1]]
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
            return numberOfDays($(tds[6]).text()) >= parseInt($("#remainingDays").val(), 10);
        }
        return true;
    }

    function filterInvestedAmount(tds) {
        if ($('#investedAmountEnabled:checked').length > 0) {
            return money($(tds[7]).text()) <= parseInt($("#investedAmount").val(), 10);
        }
        return true;
    }

    function filterAvailableAmount(tds) {
        if ($('#availableAmountEnabled:checked').length > 0) {
            return money($(tds[8]).text()) >= parseInt($("#availableAmount").val(), 10);
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
                    return percentage($($(this).find('td')[4]).text()) % 2 === 0;
                }).css('font-weight', 'bold');

        updateTotal();
    }

    $(".filter").change(filter);

    filter();

})();