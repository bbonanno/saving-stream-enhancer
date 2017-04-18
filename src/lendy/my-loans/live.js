(function () {
    'use strict';

    const util = require('../../util.js');

    $.tablesorter.addParser(new util.NumericParser('days', numberOfDays));
    $.tablesorter.addParser(new util.NumericParser('money', money));

    const table = $("table");

    const
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

    const additions = '<label for="sell">Sell: </label> ' +
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
                    return util.numberOfDays($($(this).find('td')[REMAINING_TERM]).text()) <= parseInt($("#caution").val(), 10);
                }).css({'color': 'orange'})
            .filter(
                function () {
                    return util.numberOfDays($($(this).find('td')[REMAINING_TERM]).text()) <= parseInt($("#sell").val(), 10);
                }).css({'color': 'red'});

        updateTotal();
    }

    $(".filter").change(filter);

    filter();
})();