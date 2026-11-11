import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { listConversations } from '@/services/missions';

/** Liste des conversations, commune aux espaces étudiant et entreprise. */
export function MessagesScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const conversations = listConversations();

  return (
    <Screen title={t('messages.title')} withTabBar>
      {conversations.length === 0 ? (
        <ThemedText themeColor="textSecondary">{t('common.empty')}</ThemedText>
      ) : null}
      {conversations.map((conversation) => (
        <View
          key={conversation.id}
          style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.text}>
            <ThemedText style={styles.name}>{conversation.with}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {conversation.lastMessage}
            </ThemedText>
          </View>
          {conversation.unread > 0 ? <Badge label={String(conversation.unread)} tone="accent" /> : null}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
  },
  text: {
    flex: 1,
  },
  name: {
    fontWeight: 700,
  },
});
