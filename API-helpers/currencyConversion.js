function convert(currency1, currency2, rates, amount) {
    if (!rates.hasOwnProperty(currency1) || !rates.hasOwnProperty(currency2)) {
        return "Invalid Input";
    }
    return (amount / rates[currency1]) * rates[currency2];
}

module.exports = convert;