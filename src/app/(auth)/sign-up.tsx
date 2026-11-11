import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { PasswordField, TextField } from '@/components/ui/text-field';
import { useSession } from '@/features/auth/session-context';
import {
  validateIdentifier,
  validatePassword,
  validateRequired,
} from '@/features/auth/validation';
import { useI18n } from '@/i18n';
import type { UserRole } from '@/types/models';

export default function SignUpScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const role: UserRole = params.role === 'company' ? 'company' : 'student';
  const isStudent = role === 'student';
  const { t } = useI18n();
  const { signIn } = useSession();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameError = validateRequired(name);
  const identifierError = validateIdentifier(identifier);
  const passwordError = validatePassword(password);

  const submit = () => {
    setSubmitted(true);
    if (nameError || identifierError || passwordError) return;
    setLoading(true);
    // Simule l'aller-retour réseau en attendant l'API d'inscription.
    setTimeout(() => signIn(role, name), 600);
  };

  return (
    <Screen
      title={t(isStudent ? 'auth.signUpStudent' : 'auth.signUpCompany')}
      backLabel={t('common.back')}>
      <Reveal>
        <ThemedText themeColor="textSecondary">
          {t(isStudent ? 'auth.signUpSubtitleStudent' : 'auth.signUpSubtitleCompany')}
        </ThemedText>
      </Reveal>
      <Reveal index={1}>
        <TextField
          label={t(isStudent ? 'auth.fullName' : 'auth.companyName')}
          icon={isStudent ? 'person' : 'building'}
          value={name}
          onChangeText={setName}
          autoComplete={isStudent ? 'name' : 'organization'}
          error={submitted && nameError ? t(nameError) : undefined}
        />
      </Reveal>
      <Reveal index={2}>
        <TextField
          label={t('auth.emailOrPhone')}
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
          placeholder={t('auth.passwordHint')}
          value={password}
          onChangeText={setPassword}
          showLabel={t('auth.showPassword')}
          hideLabel={t('auth.hidePassword')}
          onSubmitEditing={submit}
          error={submitted && passwordError ? t(passwordError) : undefined}
        />
      </Reveal>
      <Reveal index={4}>
        <Button title={t('auth.signUp')} loading={loading} onPress={submit} />
      </Reveal>
    </Screen>
  );
}
