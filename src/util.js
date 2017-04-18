const NumericParser = (id, parser) => ({
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
});

const numberOfDays = s => parseInt(s.toLowerCase().replace('days', '').replace('day', '').trim());

const money = s => parseFloat(s.replace('£', '').replace(',', '').trim());

const percentage = s => parseInt(s.replace('%', '').trim());

module.exports = {

    numberOfDays: numberOfDays,

    money: money,

    percentage: percentage,

    MoneyParser: () => new NumericParser('money', money),

    DaysParser: () => new NumericParser('days', money)
};
