import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { cardSurface, Font, Radius, Spacing } from '@/constants/theme';
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
        <EmptyState icon="chat" title={t('messages.empty')} hint={t('messages.emptyHint')} />
      ) : null}
      {conversations.map((conversation, index) => (
        <Reveal key={conversation.id} index={index}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={
              conversation.unread > 0
                ? `${conversation.with}, ${t('messages.unread', { count: conversation.unread })}`
                : conversation.with
            }
            onPress={() =>
              router.push({ pathname: '/conversation/[id]', params: { id: conversation.id } })
            }
            style={[styles.row, cardSurface(theme)]}>
            <Avatar name={conversation.with} shape="square" size={48} />
            <View style={styles.text}>
              <View style={styles.line}>
                <ThemedText type="bodyBold" numberOfLines={1} style={styles.grow}>
                  {conversation.with}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  {conversation.time}
                </ThemedText>
              </View>
              <View style={styles.line}>
                <ThemedText
                  type={conversation.unread > 0 ? 'smallBold' : 'small'}
                  themeColor={conversation.unread > 0 ? 'text' : 'textSecondary'}
                  numberOfLines={1}
                  style={styles.grow}>
                  {conversation.lastMessage}
                </ThemedText>
                {conversation.unread > 0 ? (
                  <View style={[styles.unread, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.unreadLabel, { color: theme.onAccent }]}>
                      {conversation.unread}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </PressableScale>
        </Reveal>
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
    gap: Spacing.half,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
  },
  unread: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadLabel: {
    fontSize: 12,
    fontFamily: Font.extrabold,
  },
});
