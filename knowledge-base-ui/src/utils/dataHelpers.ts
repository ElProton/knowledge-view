import { MongoDateValue } from '../types/document.types';

/**
 * Accède de manière sécurisée à une propriété imbriquée d'un objet.
 * Gère les cas où les propriétés intermédiaires sont nulles ou undefined.
 * 
 * @param obj - L'objet source
 * @param path - Le chemin vers la propriété (ex: 'data.platform')
 * @param defaultValue - Valeur par défaut si la propriété n'existe pas
 * @returns La valeur trouvée ou la valeur par défaut
 * 
 * @example
 * const platform = getNestedValue(post, 'data.platform', 'Unknown');
 * const title = getNestedValue(post, 'title', 'Untitled');
 */
export function getNestedValue<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue: T | null = null
): T | null {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }

    if (typeof current !== 'object') {
      return defaultValue;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return current !== undefined ? (current as T) : defaultValue;
}

/**
 * Parse une valeur de date MongoDB et retourne un objet Date.
 * Gère le format MongoDB { $date: "ISO_STRING" } ainsi que les chaînes ISO standard.
 * 
 * @param dateValue - Valeur de date (format MongoDB ou ISO string)
 * @returns Objet Date ou null si invalide
 */
function parseMongoDate(dateValue: MongoDateValue): Date | null {
  if (!dateValue) {
    return null;
  }

  try {
    let dateString: string;

    if (typeof dateValue === 'object' && '$date' in dateValue) {
      dateString = dateValue.$date;
    } else if (typeof dateValue === 'string') {
      dateString = dateValue;
    } else {
      return null;
    }

    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  } catch (error) {
    console.warn('Error parsing MongoDB date:', error);
    return null;
  }
}

/**
 * Formate une date MongoDB au format français lisible.
 * Gère le format MongoDB { $date: "ISO_STRING" } ainsi que les chaînes ISO standard.
 * 
 * @param dateValue - Valeur de date (format MongoDB ou ISO string)
 * @param defaultValue - Valeur par défaut si le format est invalide
 * @returns Date formatée ou valeur par défaut
 * 
 * @example
 * formatMongoDate({ $date: "2025-12-31T10:00:00Z" }) // "31/12/2025"
 * formatMongoDate("2025-12-31T10:00:00Z") // "31/12/2025"
 */
export function formatMongoDate(
  dateValue: MongoDateValue,
  defaultValue: string = 'Non définie'
): string {
  const date = parseMongoDate(dateValue);
  
  if (!date) {
    return defaultValue;
  }

  return date.toLocaleDateString('fr-FR');
}

/**
 * Formate une date MongoDB au format date et heure français.
 * 
 * @param dateValue - Valeur de date (format MongoDB ou ISO string)
 * @param defaultValue - Valeur par défaut si le format est invalide
 * @returns Date et heure formatées ou valeur par défaut
 */
export function formatMongoDateTime(
  dateValue: MongoDateValue,
  defaultValue: string = 'Non définie'
): string {
  const date = parseMongoDate(dateValue);
  
  if (!date) {
    return defaultValue;
  }

  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
