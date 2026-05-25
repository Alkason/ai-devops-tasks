/**
 * Waliduje, czy podany ciąg znaków jest poprawnym adresem IPv4.
 * * Wyrażenie regularne sprawdza każdy z 4 oktetów, upewniając się,
 * że mieści się w przedziale od 0 do 255.
 * * @param {string} ip - Ciąg znaków do sprawdzenia
 * @returns {boolean} - true, jeśli adres jest poprawny, w przeciwnym razie false
 */
function validateIPv4(ip) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
}

// ==========================================
// Przykłady użycia i testy automatyczne
// ==========================================

const testCases = [
    // Poprawne adresy
    { ip: "192.168.1.1", expected: true },
    { ip: "0.0.0.0", expected: true },
    { ip: "255.255.255.255", expected: true },
    { ip: "10.0.0.01", expected: true },
    
    // Niepoprawne adresy
    { ip: "256.1.1.1", expected: false },
    { ip: "192.168.1", expected: false },
    { ip: "192.168.1.1.1", expected: false },
    { ip: "192.168.1.abc", expected: false },
    { ip: "192.168..1", expected: false },
    { ip: " 192.168.1.1 ", expected: false } // Spacje na początku/końcu są odrzucane przez ^ i $
];

console.log("Rozpoczęcie testów walidatora IPv4:\n");

let passedCount = 0;

testCases.forEach(({ ip, expected }) => {
    const result = validateIPv4(ip);
    const status = result === expected ? "✅ SUKCES" : "❌ BŁĄD";
    
    if (result === expected) passedCount++;
    
    console.log(`[${status}] IP: "${ip}" -> Wynik: ${result} (Oczekiwano: ${expected})`);
});

console.log(`\nWynik końcowy: ${passedCount}/${testCases.length} testów zakończonych pomyślnie.`);

// Eksport funkcji, jeśli plik jest używany jako moduł (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateIPv4 };
}