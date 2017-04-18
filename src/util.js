const NumericParser = (id, parser) => ({
    id: id,
    is: () => false,
    format: s => {
        if (s.trim().length > 0)
            return parser(s);
        else
            return Number.MAX_SAFE_INTEGER;
    },
    type: 'numeric'
});

export const numberOfDays = s => parseInt(s.toLowerCase().replace('days', '').replace('day', '').trim());

export const money = s => parseFloat(s.replace('£', '').replace(',', '').trim());

export const percentage = s => parseInt(s.replace('%', '').trim());

export const moneyParser = new NumericParser('money', money);

export const daysParser = new NumericParser('days', numberOfDays);

export const Header = (sorterId) => ({sorter: sorterId});
