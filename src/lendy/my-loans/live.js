import {moneyParser, daysParser, numberOfDays, Header} from '../../util.js';

(function () {

    const table = $("table");
    const tbody =  table.find('tbody');
    const footerRow = tbody.find('tr:last-child');
    footerRow.remove();
    table.append('<tfoot></tfoot>');
    table.find('tfoot').append(footerRow);

    $.tablesorter.addParser(moneyParser);
    $.tablesorter.addParser(daysParser);

    const
        REMAINING_TERM = 2,
        INVESTED_AMOUNT = 3,
        ASCENDING = 0;

    const headers = {};
    headers[REMAINING_TERM] = new Header(daysParser.id);
    headers[INVESTED_AMOUNT] = new Header(moneyParser.id);

    table.tablesorter({
        headers: headers,
        sortList: [[REMAINING_TERM, ASCENDING]]
    });

    const additions = '<label for="sell">Sell: </label> ' +
        '<input class="filter"  id="sell" type="number" value="60"/> ' +
        '<label for="caution">Caution: </label> ' +
        '<input class="filter"  id="caution" type="number" value="90"/> ' +
        '<label id="totalLoans"></label>';

    table.before(additions);

    function filter() {
        let caution = parseInt($("#caution").val(), 10);
        let sell = parseInt($("#sell").val(), 10);

        table.find("tbody tr")
            .css({'color': 'green', 'font-weight': 'bold'})
            .filter(function () {
                return numberOfDays($($(this).find('td')[REMAINING_TERM]).text()) <= caution
            })
            .css({'color': 'orange'})
            .filter(function () {
                return numberOfDays($($(this).find('td')[REMAINING_TERM]).text()) <= sell
            })
            .css({'color': 'red'});

        $('#totalLoans').text("Holding " + table.find("tbody tr.js-loan-parts-table").length + " Loans");
    }

    $(".filter").change(filter);

    filter();

})();
