/**
 * Monedas fiat con mercado P2P activo en Binance. No es una lista oficial
 * (Binance no publica una), es una seleccion curada de las mas usadas para
 * arbitraje P2P. Si les falta o sobra alguna, se edita aca nomas.
 */
export const fiatCurrencies: string[] = [
  // America Latina
  "ARS", "VES", "COP", "PEN", "CLP", "MXN", "BRL", "BOB", "PYG", "UYU",
  "DOP", "GTQ", "HNL", "CRC", "PAB",
  // Africa
  "NGN", "GHS", "KES", "ZAR", "EGP", "MAD", "TZS", "UGX", "XOF",
  // Medio Oriente
  "TRY", "AED", "SAR", "QAR", "ILS",
  // Asia
  "INR", "PKR", "BDT", "IDR", "PHP", "VND", "THB", "MYR", "SGD", "HKD",
  "TWD", "JPY", "KRW", "KZT", "UZS", "NPR", "LKR", "MMK",
  // Europa / CIS
  "RUB", "UAH", "PLN", "RON", "CZK", "HUF", "BGN", "GBP", "EUR",
  "AZN", "GEL", "AMD", "BYN", "MDL",
  // Oceania / otros
  "AUD", "NZD", "CAD", "USD",
];
