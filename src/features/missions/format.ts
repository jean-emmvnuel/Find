import type { TranslationKey } from '@/i18n';
import type { Mission } from '@/types/models';

type Translate = (key: TranslationKey) => string;

/** « 15 000 FCFA / jour » */
export function formatPay(mission: Pick<Mission, 'pay' | 'payUnit'>, t: Translate): string {
  const amount = mission.pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${amount} FCFA ${t(`missions.per.${mission.payUnit}`)}`;
}
