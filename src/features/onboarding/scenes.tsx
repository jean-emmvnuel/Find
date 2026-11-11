import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Illustrations de l'onboarding. Plutôt que des images génériques, chaque scène
 * montre un vrai morceau de l'app : une mission, un profil vérifié, un paiement.
 */

function Card({ children, style }: { children: ReactNode; style?: object }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
}

export function MissionsScene() {
  const theme = useTheme();
  return (
    <View style={styles.scene}>
      <Card style={[styles.behind, { transform: [{ rotate: '-5deg' }] }]}>
        <ThemedText type="smallBold">Inventoriste</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          Cocody · 2 000 FCFA / heure
        </ThemedText>
      </Card>
      <Card style={{ transform: [{ rotate: '2deg' }] }}>
        <View style={styles.row}>
          <Avatar name="Ivoire Events" size={36} />
          <View style={styles.grow}>
            <ThemedText type="smallBold">Hôte d’accueil</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Plateau, Abidjan · 3 jours
            </ThemedText>
          </View>
        </View>
        <View style={[styles.pill, { backgroundColor: theme.accentSoft }]}>
          <ThemedText type="smallBold">15 000 FCFA / jour</ThemedText>
        </View>
      </Card>
    </View>
  );
}

export function VerifiedScene() {
  const theme = useTheme();
  return (
    <View style={styles.scene}>
      <Card style={styles.centered}>
        <Avatar name="Awa Koné" size={64} />
        <ThemedText type="heading">Awa Koné</ThemedText>
        <Badge label="Profil vérifié" tone="success" icon="verified" />
        <View style={styles.row}>
          <Icon name="document" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" themeColor="textSecondary">
            CNI · Carte étudiante
          </ThemedText>
        </View>
      </Card>
    </View>
  );
}

export function PaymentScene() {
  const theme = useTheme();
  return (
    <View style={styles.scene}>
      <Card>
        <View style={styles.row}>
          <View style={[styles.iconBubble, { backgroundColor: theme.successSoft }]}>
            <Icon name="wallet" color={theme.success} />
          </View>
          <View style={styles.grow}>
            <ThemedText type="caption" themeColor="textSecondary">
              Paiement reçu · Wave
            </ThemedText>
            <ThemedText type="subtitle">+ 45 000 FCFA</ThemedText>
          </View>
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          Ivoire Events · Hôte d’accueil, 3 jours
        </ThemedText>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    width: 280,
    height: 240,
    justifyContent: 'center',
  },
  card: {
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderWidth: 1,
    gap: Spacing.two,
    boxShadow: '0 12px 28px rgba(14, 27, 91, 0.12)',
  },
  behind: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    opacity: 0.9,
  },
  centered: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
