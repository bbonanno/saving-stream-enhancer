module.exports = {

    numberOfDays: s => parseInt(s.toLowerCase().replace('days', '').replace('day', '').trim()),

    money: s => parseFloat(s.replace('£', '').replace(',', '').trim()),

    percentage: s => parseInt(s.replace('%', '').trim()),

    NumericParser: (id, parser) => ({
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
    })
};
