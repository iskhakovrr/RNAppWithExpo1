export default function getNoun(number, type) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return type[0];
    }
    n %= 10;
    if (n === 1) {
        return type[1];
    }
    if (n >= 2 && n <= 4) {
        return type[2];
    }
    return type[0];
}