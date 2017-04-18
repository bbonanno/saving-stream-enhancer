// ==UserScript==
// @name         Loan Portfolio
// @namespace    https://github.com/bbonanno/
// @version      0.2
// @author       Bruno Bonanno
// @match        https://lendy.co.uk/my-loans/live
// @match        https://lendy.co.uk/loans/live
// @downloadURL  https://github.com/bbonanno/saving-stream-enhancer/raw/master/src/loan-portfolio.user.js
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
        };
    }

    $.tablesorter.addParser(new NumericParser('days', numberOfDays));
    $.tablesorter.addParser(new NumericParser('money', money));

    var table = $("table");

    var
        ASSET_DETAILS = 0,
        DRAWNDOWN = 1,
        REMAINING_TERM = 2,
        INVESTED_AMOUNT = 7,
        INTEREST = 8,
        DETAILS = 9,
        ASCENDING = 0,
        DESCENDING = 1
    ;

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

    var additions = '<label for="sell">Sell: </label> ' +
        '<input class="filter"  id="sell" type="number" value="60"/> ' +
        '<label for="caution">Caution: </label> ' +
        '<input class="filter"  id="caution" type="number" value="90"/> ' +
        '<label id="totalLoans"></label>';

    table.before(additions);

    function updateTotal() {
        $('#totalLoans').text("Holding " + table.find("tbody tr.js-loan-parts-table").length + " Loans");
    }

    function filter() {
        table.find("tbody tr")
            .css({'color': 'green', 'font-weight': 'bold'})
            .filter(
                function () {
                    return numberOfDays($($(this).find('td')[REMAINING_TERM]).text()) <= parseInt($("#caution").val(), 10);
                }).css({'color': 'orange'})
            .filter(
                function () {
                    return numberOfDays($($(this).find('td')[REMAINING_TERM]).text()) <= parseInt($("#sell").val(), 10);
                }).css({'color': 'red'});

        updateTotal();
    }

    $(".filter").change(filter);

    filter();
})();