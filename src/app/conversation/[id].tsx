import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { noNativeFocusRing } from '@/components/ui/web-styles';
import { cardSurface, Font, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { getConversation, listMessages } from '@/services/missions';
import type { Message } from '@/types/models';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { t } = useI18n();
  const conversation = getConversation(id);
  const [messages, setMessages] = useState<Message[]>(() => listMessages(id));
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);

  if (!conversation) {
    return (
      <Screen backLabel={t('common.back')}>
        <EmptyState icon="chat" title={t('messages.notFound')} />
      </Screen>
    );
  }

  const canSend = draft.trim().length > 0;
  const send = () => {
    if (!canSend) return;
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setMessages((current) => [
      ...current,
      { id: `local-${current.length}`, from: 'me', text: draft.trim(), time },
    ]);
    setDraft('');
  };

  return (
    <Screen
      backLabel={t('common.back')}
      headerAction={
        <View style={styles.contact}>
          <ThemedText type="bodyBold" numberOfLines={1} style={styles.shrink}>
            {conversation.with}
          </ThemedText>
          <Avatar name={conversation.with} size={40} />
        </View>
      }
      footer={
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('messages.placeholder')}
            accessibilityLabel={t('messages.placeholder')}
            placeholderTextColor={theme.textSecondary}
            selectionColor={theme.primary}
            multiline
            onSubmitEditing={send}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.backgroundElement,
                borderColor: focused ? theme.primary : theme.border,
              },
            ]}
          />
          <PressableScale
            onPress={send}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel={t('messages.send')}
            accessibilityState={{ disabled: !canSend }}
            style={[styles.send, { backgroundColor: theme.primary, opacity: canSend ? 1 : 0.4 }]}>
            <Icon name="send" color={theme.onPrimary} />
          </PressableScale>
        </View>
      }>
      <View style={styles.thread}>
        {messages.map((message, index) => {
          const mine = message.from === 'me';
          return (
            <Reveal
              key={message.id}
              // Seuls les messages d'origine sont échelonnés ; un nouveau message arrive aussitôt.
              index={message.id.startsWith('local-') ? 0 : index}
              style={[styles.bubbleRow, mine && styles.mine]}>
              <View
                style={[
                  styles.bubble,
                  mine
                    ? { backgroundColor: theme.primary, borderBottomRightRadius: Radius.small }
                    : { ...cardSurface(theme), borderBottomLeftRadius: Radius.small },
                ]}>
                <ThemedText style={mine ? { color: theme.onPrimary } : undefined}>{message.text}</ThemedText>
              </View>
              <ThemedText type="caption" themeColor="textSecondary">
                {message.time}
              </ThemedText>
            </Reveal>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginLeft: Spacing.three,
  },
  shrink: {
    flexShrink: 1,
  },
  thread: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    gap: Spacing.three,
  },
  bubbleRow: {
    alignItems: 'flex-start',
    gap: Spacing.one,
  },
  mine: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: Radius.large,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: Radius.large,
    borderWidth: 1.5,
    fontFamily: Font.medium,
    fontSize: 16,
    ...noNativeFocusRing,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
