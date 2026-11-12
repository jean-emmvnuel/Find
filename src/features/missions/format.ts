import type { TranslationKey } from '@/i18n';
import type { Mission } from '@/types/models';

type Translate = (key: TranslationKey) => string;

/** « 15 000 FCFA / jour » */
export function formatPay(mission: Pick<Mission, 'pay' | 'payUnit'>, t: Translate): string {
  const amount = mission.pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${amount} FCFA ${t(`missions.per.${mission.payUnit}`)}`;
}

type TranslateWithParams = (key: TranslationKey, params?: Record<string, string | number>) => string;

/** « Aujourd'hui », « Il y a 2 j » */
export function formatPosted(daysAgo: number, t: TranslateWithParams): string {
  return daysAgo <= 0 ? t('missions.postedToday') : t('missions.postedDaysAgo', { count: daysAgo });
}

/** « 4,8 » en français, « 4.8 » en anglais. */
export function formatRating(rating: number, locale: string): string {
  return rating.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
