export default class display {
    static currencies = [
        ["¤", "L"],     // Generic currency symbol
        ["€", "R"],     // Euro
        ["kr", "R"],    // Various kroner, Czech, Swedish, Norwegian etc.
        ["¥", "L"],     // Japanese Yen or Chinese RMB
        ["$", "L"],     // Various dollars and pesos
        ["£", "L"],     // GB Pund
        ["₹", "L"],     // Indian Rupee
        ["₱", "L"],     // Philipino peso
        ["₽", "L"],     // Various Rubles
        ["₪", "R"],     // Israeli Shekel
        ["₩", "L"],     // Korean Won
        ["zł", "R"]     // Polish Złoty
    ]

    static getCurrencyList(){
        return this.currencies;
    }
}