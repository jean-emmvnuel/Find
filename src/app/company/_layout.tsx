import AppTabs, { type TabConfig } from '@/components/app-tabs';
import { useI18n } from '@/i18n';

export default function CompanyLayout() {
  const { t } = useI18n();

  const tabs: TabConfig[] = [
    { name: 'index', href: '/company', label: t('tabs.dashboard'), sf: 'chart.bar.fill', md: 'dashboard' },
    { name: 'missions', href: '/company/missions', label: t('tabs.missions'), sf: 'briefcase.fill', md: 'work' },
    {
      name: 'messages',
      href: '/company/messages',
      label: t('tabs.messages'),
      sf: 'bubble.left.and.bubble.right.fill',
      md: 'chat',
    },
    { name: 'profile', href: '/company/profile', label: t('tabs.profile'), sf: 'building.2.fill', md: 'business' },
  ];

  return <AppTabs tabs={tabs} />;
}
