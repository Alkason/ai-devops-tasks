/**
 * @typedef {Object} UserData
 * @property {string} name - Imię i nazwisko użytkownika.
 * @property {string} email - Adres e-mail użytkownika.
 * @property {Date} lastLogin - Data ostatniego logowania przekonwertowana na obiekt klasy Date.
 */

/**
 * Pobiera dane użytkownika z zewnętrznego API na podstawie jego identyfikatora.
 * * Funkcja wykonuje zapytanie HTTP GET. W przypadku błędu sieci lub niepoprawnego
 * statusu odpowiedzi (innego niż 2xx), błąd jest logowany w konsoli, a funkcja zwraca `null`.
 *
 * @param {string|number} userId - Unikalny identyfikator użytkownika.
 * @returns {Promise<UserData|null>} Obietnica (Promise) zwracająca obiekt z danymi użytkownika lub `null` w przypadku błędu.
 * * @example
 * fetchUserData(123)
 * .then(user => {
 * if (user) console.log(`Witaj ${user.name}`);
 * });
 */
function fetchUserData(userId) {
  return fetch(`https://api.example.com/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      return {
        name: data.name,
        email: data.email,
        lastLogin: new Date(data.lastLoginTimestamp)
      };
    })
    .catch(error => {
      console.error('Fetch error:', error);
      return null;
    });
}