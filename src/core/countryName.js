/**
 * Converts a country code to its full name (European countries)
 * @param {string} code - The ISO 3166-1 alpha-2 country code
 * @returns {string} The full country name
 */
export function getCountryName(code) {
  const countries = {
    // EU member states
    'AT': 'Austria',
    'BE': 'Belgium',
    'BG': 'Bulgaria',
    'HR': 'Croatia',
    'CY': 'Cyprus',
    'CZ': 'Czechia',
    'DK': 'Denmark',
    'EE': 'Estonia',
    'FI': 'Finland',
    'FR': 'France',
    'DE': 'Germany',
    'GR': 'Greece',
    'HU': 'Hungary',
    'IE': 'Ireland',
    'IT': 'Italy',
    'LV': 'Latvia',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'MT': 'Malta',
    'NL': 'Netherlands',
    'PL': 'Poland',
    'PT': 'Portugal',
    'RO': 'Romania',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'ES': 'Spain',
    'SE': 'Sweden',
    
    // Non-EU European countries
    'AL': 'Albania',
    'AD': 'Andorra',
    'AM': 'Armenia',
    'AZ': 'Azerbaijan',
    'BY': 'Belarus',
    'BA': 'Bosnia and Herzegovina',
    'CH': 'Switzerland',
    'GB': 'United Kingdom',
    'GE': 'Georgia',
    'IS': 'Iceland',
    'LI': 'Liechtenstein',
    'MD': 'Moldova',
    'MC': 'Monaco',
    'ME': 'Montenegro',
    'MK': 'North Macedonia',
    'NO': 'Norway',
    'RU': 'Russia',
    'RS': 'Serbia',
    'SM': 'San Marino',
    'TR': 'Turkey',
    'UA': 'Ukraine',
    'VA': 'Vatican City'
  };

  return countries[code] || code;
}
