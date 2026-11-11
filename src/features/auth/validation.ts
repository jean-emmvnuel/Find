import type { TranslationKey } from '@/i18n';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d{8,15}$/;

/** Renvoie la clé du message d'erreur, ou `null` si la valeur est valide. */
export function validateIdentifier(value: string): TranslationKey | null {
  const trimmed = value.trim();
  if (!trimmed) return 'error.required';
  // Un numéro peut être saisi avec des espaces : « +225 07 00 00 00 00 ».
  return EMAIL.test(trimmed) || PHONE.test(trimmed.replace(/\s/g, '')) ? null : 'error.identifier';
}

export function validatePassword(value: string): TranslationKey | null {
  if (!value) return 'error.required';
  return value.length >= 8 ? null : 'error.password';
}

export function validateRequired(value: string): TranslationKey | null {
  return value.trim() ? null : 'error.required';
}
