import {moneyParser, daysParser, money, percentage, numberOfDays, Header} from '../../util.js';

(function () {

    const table = $("table");
    const tbody = table.find('tbody');
    const footerRow = tbody.find('tr:last-child');
    footerRow.remove();
    table.append('<tfoot></tfoot>');
    table.find('tfoot').append(footerRow);
    footerRow.css({'font-weight': 'bold', 'font-size': '16pt'});

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
        '<label id="totalLoans"></label>' +
        '<p style="font-weight: bold;" id="balancedInterest"></p>';

    table.before(additions);

    function filter() {
        let caution = parseInt($("#caution").val(), 10);
        let sell = parseInt($("#sell").val(), 10);

        table.find("tbody tr.js-loan-parts-table")
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

    $.fn.reduce = [].reduce;
    $.get('https://lendy.co.uk/_fragments/Loan/UserLoanParts', data => {
        const rows = $(data).find('tbody tr');
        const interest = rows.map((i, r) => {
            const columns = $(r).find('td');
            return money($(columns[3]).text()) * percentage($(columns[5]).text()) / 100
        }).reduce((acc, cur) => acc + cur, 0);

        const total = rows.map((i, r) => {
            const columns = $(r).find('td');
            return money($(columns[3]).text())
        }).reduce((acc, cur) => acc + cur, 0);

        $('#balancedInterest').text(`Balanced interest: ${Math.round((interest / total) * 10000) / 100}%`);
    })

})();
