import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
  type TextProps as RNTextProps,
  type ViewProps,
} from 'react-native';
import { JOB_STATUS_TOKEN, type JobStatusKey } from '@trackdesk/ui/tokens';
import { theme } from './theme';

type TextVariant = 'title' | 'heading' | 'body' | 'caption';

export function Text({
  variant = 'body',
  muted,
  style,
  ...props
}: RNTextProps & { variant?: TextVariant; muted?: boolean }) {
  return <RNText style={[styles[variant], muted && styles.muted, style]} {...props} />;
}

export function Screen({ children, style, ...props }: ViewProps & { children: ReactNode }) {
  return (
    <View style={[styles.screen, style]} {...props}>
      {children}
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  testID,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'danger' && styles.buttonDanger,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.color.primary.fg} />
      ) : (
        <RNText
          style={[styles.buttonLabel, variant === 'secondary' && styles.buttonLabelSecondary]}
        >
          {title}
        </RNText>
      )}
    </Pressable>
  );
}

export function Card({ children, style, ...props }: ViewProps & { children: ReactNode }) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const STATUS_LABEL: Record<JobStatusKey, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  dispatched: 'Dispatched',
  en_route: 'En route',
  on_site: 'On site',
  completed: 'Completed',
  verified: 'Verified',
  invoiced: 'Invoiced',
  cancelled: 'Cancelled',
  overdue: 'Overdue',
};

export function JobStatusBadge({ status }: { status: JobStatusKey }) {
  const colour = theme.color.status[JOB_STATUS_TOKEN[status]];
  return (
    <View
      style={[styles.badge, { borderColor: colour }]}
      accessibilityLabel={`Status ${STATUS_LABEL[status]}`}
    >
      <View style={[styles.dot, { backgroundColor: colour }]} />
      <RNText style={styles.badgeLabel}>{STATUS_LABEL[status]}</RNText>
    </View>
  );
}

export function JobListItem({
  reference,
  title,
  siteName,
  timeRange,
  status,
  onPress,
}: {
  reference: string;
  title?: string;
  siteName?: string;
  timeRange?: string;
  status: JobStatusKey;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" testID={`job-${reference}`}>
      <Card style={styles.jobItem}>
        <View style={styles.row}>
          <Text variant="caption" muted>
            {reference}
          </Text>
          <JobStatusBadge status={status} />
        </View>
        {title ? <Text variant="heading">{title}</Text> : null}
        {siteName ? <Text muted>{siteName}</Text> : null}
        {timeRange ? (
          <Text variant="caption" muted>
            {timeRange}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}

/** Always-visible indicator while background location is active (DPIA requirement). */
export function TrackingIndicator({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <View
      style={styles.tracking}
      accessibilityRole="text"
      accessibilityLabel="Location tracking is on"
    >
      <View style={[styles.dot, { backgroundColor: theme.color.success.default }]} />
      <RNText style={styles.trackingLabel}>Tracking on</RNText>
    </View>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <View style={styles.centered} testID="empty-state">
      <Text variant="heading">{title}</Text>
      {description ? (
        <Text muted style={styles.centerText}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.centered} testID="loading-state" accessibilityLabel={label}>
      <ActivityIndicator color={theme.color.primary.default} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={styles.centered} testID="error-state" accessibilityRole="alert">
      <Text variant="heading" style={{ color: theme.color.danger.fg }}>
        Something went wrong
      </Text>
      {message ? (
        <Text muted style={styles.centerText}>
          {message}
        </Text>
      ) : null}
      {onRetry ? <Button title="Try again" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.font('2xl'), fontWeight: theme.weight.bold, color: theme.color.fg.default },
  heading: {
    ...theme.font('md'),
    fontWeight: theme.weight.semibold,
    color: theme.color.fg.default,
  },
  body: { ...theme.font('md'), color: theme.color.fg.default },
  caption: { ...theme.font('xs'), color: theme.color.fg.default },
  muted: { color: theme.color.fg.muted },
  screen: {
    flex: 1,
    backgroundColor: theme.color.bg.canvas,
    padding: theme.space(4),
    gap: theme.space(3),
  },
  button: {
    minHeight: theme.space(12),
    paddingHorizontal: theme.space(4),
    borderRadius: theme.radius('md'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: { backgroundColor: theme.color.primary.default },
  buttonSecondary: {
    backgroundColor: theme.color.bg.surface,
    borderWidth: 1,
    borderColor: theme.color.border.default,
  },
  buttonDanger: { backgroundColor: theme.color.danger.default },
  pressed: { opacity: 0.7 },
  buttonLabel: {
    ...theme.font('md'),
    fontWeight: theme.weight.semibold,
    color: theme.color.primary.fg,
  },
  buttonLabelSecondary: { color: theme.color.fg.default },
  card: {
    backgroundColor: theme.color.bg.surface,
    borderRadius: theme.radius('lg'),
    borderWidth: 1,
    borderColor: theme.color.border.default,
    padding: theme.space(4),
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space(1),
    borderWidth: 1,
    borderRadius: theme.radius('full'),
    paddingHorizontal: theme.space(2),
    paddingVertical: theme.space(0.5),
  },
  badgeLabel: { ...theme.font('xs'), color: theme.color.fg.default },
  dot: { width: theme.space(2), height: theme.space(2), borderRadius: theme.radius('full') },
  jobItem: { gap: theme.space(1) },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tracking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space(2),
    alignSelf: 'flex-start',
    backgroundColor: theme.color.success.subtle,
    borderRadius: theme.radius('full'),
    paddingHorizontal: theme.space(3),
    paddingVertical: theme.space(1),
  },
  trackingLabel: {
    ...theme.font('sm'),
    color: theme.color.success.fg,
    fontWeight: theme.weight.medium,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space(3),
    padding: theme.space(6),
  },
  centerText: { textAlign: 'center' },
});
