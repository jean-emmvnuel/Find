import AppTabs, { type TabConfig } from '@/components/app-tabs';
import { useI18n } from '@/i18n';

export default function StudentLayout() {
  const { t } = useI18n();

  const tabs: TabConfig[] = [
    { name: 'index', href: '/student', label: t('tabs.missions'), sf: 'magnifyingglass', md: 'search' },
    {
      name: 'applications',
      href: '/student/applications',
      label: t('tabs.applications'),
      sf: 'briefcase.fill',
      md: 'work',
    },
    {
      name: 'messages',
      href: '/student/messages',
      label: t('tabs.messages'),
      sf: 'bubble.left.and.bubble.right.fill',
      md: 'chat',
    },
    { name: 'profile', href: '/student/profile', label: t('tabs.profile'), sf: 'person.fill', md: 'person' },
  ];

  return <AppTabs tabs={tabs} />;
}
