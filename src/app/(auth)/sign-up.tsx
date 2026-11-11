import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useSession } from '@/features/auth/session-context';
import { useI18n } from '@/i18n';
import type { UserRole } from '@/types/models';

export default function SignUpScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const role: UserRole = params.role === 'company' ? 'company' : 'student';
  const { t } = useI18n();
  const { signIn } = useSession();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen title={t(role === 'student' ? 'auth.signUpStudent' : 'auth.signUpCompany')}>
      <TextField
        label={t(role === 'student' ? 'auth.fullName' : 'auth.companyName')}
        value={name}
        onChangeText={setName}
      />
      <TextField
        label={t('auth.emailOrPhone')}
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={t('auth.signUp')} onPress={() => signIn(role, name)} />
    </Screen>
  );
}
