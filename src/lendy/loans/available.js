import {moneyParser, daysParser, numberOfDays, money, percentage, Header} from '../../util.js';

(function () {

    $.tablesorter.addParser(moneyParser);
    $.tablesorter.addParser(daysParser);

    const table = $("table");

    const
        ANNUAL_RETURN = 4,
        REMAINING_TERM = 7,
        INVESTED_AMOUNT = 8,
        AVAILABLE_TO_BUY = 9,
        ASCENDING = 0,
        DESCENDING = 1
    ;

    const headers = {};
    headers[REMAINING_TERM] = new Header(daysParser.id);
    headers[INVESTED_AMOUNT] = new Header(moneyParser.id);
    headers[AVAILABLE_TO_BUY] = new Header(moneyParser.id);

    table.tablesorter({
        headers: headers,
        sortList: [[ANNUAL_RETURN, DESCENDING], [REMAINING_TERM, DESCENDING], [AVAILABLE_TO_BUY, ASCENDING]]
    });

    const additions = '<label for="remainingDaysEnabled">Remaining Days: </label> ' +
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

    const filterNumberOfDays = (tds) => {
        if ($('#remainingDaysEnabled:checked').length > 0) {
            return numberOfDays($(tds[REMAINING_TERM]).text()) >= parseInt($("#remainingDays").val(), 10);
        }
        return true;
    };

    const filterInvestedAmount = (tds) => {
        if ($('#investedAmountEnabled:checked').length > 0) {
            return money($(tds[INVESTED_AMOUNT]).text()) <= parseInt($("#investedAmount").val(), 10);
        }
        return true;
    };

    const filterAvailableAmount = (tds) => {
        if ($('#availableAmountEnabled:checked').length > 0) {
            return money($(tds[AVAILABLE_TO_BUY]).text()) >= parseInt($("#availableAmount").val(), 10);
        }
        return true;
    };

    function filter() {
        table.find("tbody tr")
            .hide()
            .filter(function () {
                const tds = $(this).find("td");
                return filterNumberOfDays(tds) && filterInvestedAmount(tds) && filterAvailableAmount(tds);
            })
            .show()
            .filter(function () {
                return percentage($($(this).find('td')[ANNUAL_RETURN]).text()) % 2 === 0
            })
            .css('font-weight', 'bold');

        $('#totalLoans').text("Available: " + table.find("tbody tr:visible").length + " of " + table.find("tbody tr").length + " Loans");
    }

    $(".filter").change(filter);

    filter();

})();
