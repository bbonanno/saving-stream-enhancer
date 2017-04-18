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
    };
}
