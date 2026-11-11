import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { validateRequired } from '@/features/auth/validation';
import { useMissions } from '@/features/missions/missions-context';
import { useI18n } from '@/i18n';
import type { Mission } from '@/types/models';

export default function NewMissionScreen() {
  const { t } = useI18n();
  const { session } = useSession();
  const { publish } = useMissions();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [pay, setPay] = useState('');
  const [payUnit, setPayUnit] = useState<Mission['payUnit']>('day');
  const [submitted, setSubmitted] = useState(false);

  const amount = Number(pay.replace(/\s/g, ''));
  const errors = {
    title: validateRequired(title),
    description: validateRequired(description),
    location: validateRequired(location),
    duration: validateRequired(duration),
    pay: pay.trim() === '' ? 'error.required' : amount > 0 ? null : 'publish.payError',
  } as const;
  const errorFor = (field: keyof typeof errors) => {
    const key = errors[field];
    return submitted && key ? t(key) : undefined;
  };

  const submit = () => {
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    publish(
      {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        duration: duration.trim(),
        pay: amount,
        payUnit,
      },
      session?.displayName ?? '',
    );
    router.back();
  };

  return (
    <Screen
      title={t('publish.title')}
      backLabel={t('common.back')}
      footer={<Button title={t('publish.submit')} onPress={submit} />}>
      <Reveal>
        <TextField
          label={t('publish.missionTitle')}
          value={title}
          onChangeText={setTitle}
          error={errorFor('title')}
        />
      </Reveal>
      <Reveal index={1}>
        <TextField
          label={t('publish.description')}
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.multiline}
          error={errorFor('description')}
        />
      </Reveal>
      <Reveal index={2}>
        <TextField
          label={t('publish.location')}
          icon="location"
          value={location}
          onChangeText={setLocation}
          error={errorFor('location')}
        />
      </Reveal>
      <Reveal index={3}>
        <TextField
          label={t('publish.duration')}
          icon="calendar"
          value={duration}
          onChangeText={setDuration}
          error={errorFor('duration')}
        />
      </Reveal>
      <Reveal index={4}>
        <TextField
          label={t('publish.pay')}
          icon="wallet"
          value={pay}
          onChangeText={setPay}
          keyboardType="number-pad"
          error={errorFor('pay')}
        />
      </Reveal>
      <Reveal index={5}>
        <View style={styles.group}>
          <ThemedText type="smallBold">{t('publish.payUnit')}</ThemedText>
          <SegmentedControl
            accessibilityLabel={t('publish.payUnit')}
            value={payUnit}
            onChange={setPayUnit}
            options={[
              { value: 'hour', label: t('publish.unit.hour') },
              { value: 'day', label: t('publish.unit.day') },
              { value: 'mission', label: t('publish.unit.mission') },
            ]}
          />
        </View>
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  multiline: {
    minHeight: 96,
    paddingVertical: Spacing.three,
    textAlignVertical: 'top',
  },
  group: {
    gap: Spacing.two,
  },
});
