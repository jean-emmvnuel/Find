import { router } from 'expo-router';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { PasswordField, TextField } from '@/components/ui/text-field';
import { useSession } from '@/features/auth/session-context';
import { validateIdentifier, validatePassword } from '@/features/auth/validation';
import { useI18n } from '@/i18n';
import type { UserRole } from '@/types/models';

export default function SignInScreen() {
  const { t } = useI18n();
  const { signIn } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  // Démo sans backend : le rôle est choisi ici, il viendra du compte ensuite.
  const [role, setRole] = useState<UserRole>('student');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const identifierError = validateIdentifier(identifier);
  const passwordError = validatePassword(password);

  const submit = () => {
    setSubmitted(true);
    if (identifierError || passwordError) return;
    setLoading(true);
    // Simule l'aller-retour réseau en attendant l'API d'authentification.
    setTimeout(() => signIn(role), 600);
  };

  return (
    <Screen title={t('auth.signInTitle')} backLabel={t('common.back')}>
      <Reveal>
        <ThemedText themeColor="textSecondary">{t('auth.signInSubtitle')}</ThemedText>
      </Reveal>
      <Reveal index={1}>
        <SegmentedControl
          accessibilityLabel={t('auth.accountType')}
          value={role}
          onChange={setRole}
          options={[
            { value: 'student', label: t('auth.student') },
            { value: 'company', label: t('auth.company') },
          ]}
        />
      </Reveal>
      <Reveal index={2}>
        <TextField
          label={t('auth.emailOrPhone')}
          icon="person"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          autoComplete="username"
          keyboardType="email-address"
          error={submitted && identifierError ? t(identifierError) : undefined}
        />
      </Reveal>
      <Reveal index={3}>
        <PasswordField
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          showLabel={t('auth.showPassword')}
          hideLabel={t('auth.hidePassword')}
          onSubmitEditing={submit}
          error={submitted && passwordError ? t(passwordError) : undefined}
        />
      </Reveal>
      <Reveal index={4}>
        <Button title={t('auth.signIn')} loading={loading} onPress={submit} />
      </Reveal>
      <Reveal index={5}>
        <Button
          title={t('auth.noAccount')}
          variant="ghost"
          onPress={() => router.replace({ pathname: '/sign-up', params: { role } })}
        />
      </Reveal>
    </Screen>
  );
}
