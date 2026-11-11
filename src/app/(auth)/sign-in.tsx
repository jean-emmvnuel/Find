import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { useI18n } from '@/i18n';
import type { UserRole } from '@/types/models';

export default function SignInScreen() {
  const { t } = useI18n();
  const { signIn } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  // Démo sans backend : le rôle est choisi ici, il viendra du compte ensuite.
  const [role, setRole] = useState<UserRole>('student');

  return (
    <Screen title={t('auth.signIn')}>
      <Logo width={120} />
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
      <View style={styles.row}>
        {(['student', 'company'] as const).map((value) => (
          <View key={value} style={styles.rowItem}>
            <Button
              title={t(value === 'student' ? 'auth.iAmStudent' : 'auth.iAmCompany')}
              variant={role === value ? 'primary' : 'secondary'}
              onPress={() => setRole(value)}
            />
          </View>
        ))}
      </View>
      <Button title={t('auth.signIn')} onPress={() => signIn(role)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rowItem: {
    flex: 1,
  },
});
