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
export function getNestedValue<T = any>(
  obj: any,
  path: string,
  defaultValue: T | null = null
): T | null {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }

    if (typeof current !== 'object') {
      return defaultValue;
    }

    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
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
  dateValue: any,
  defaultValue: string = 'Non définie'
): string {
  if (!dateValue) {
    return defaultValue;
  }

  try {
    let dateString: string;

    if (typeof dateValue === 'object' && dateValue.$date) {
      dateString = dateValue.$date;
    } else if (typeof dateValue === 'string') {
      dateString = dateValue;
    } else {
      return defaultValue;
    }

    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return defaultValue;
    }

    return date.toLocaleDateString('fr-FR');
  } catch (error) {
    console.warn('Error formatting date:', error);
    return defaultValue;
  }
}

/**
 * Formate une date MongoDB au format date et heure français.
 * 
 * @param dateValue - Valeur de date (format MongoDB ou ISO string)
 * @param defaultValue - Valeur par défaut si le format est invalide
 * @returns Date et heure formatées ou valeur par défaut
 */
export function formatMongoDateTime(
  dateValue: any,
  defaultValue: string = 'Non définie'
): string {
  if (!dateValue) {
    return defaultValue;
  }

  try {
    let dateString: string;

    if (typeof dateValue === 'object' && dateValue.$date) {
      dateString = dateValue.$date;
    } else if (typeof dateValue === 'string') {
      dateString = dateValue;
    } else {
      return defaultValue;
    }

    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return defaultValue;
    }

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.warn('Error formatting date time:', error);
    return defaultValue;
  }
}
