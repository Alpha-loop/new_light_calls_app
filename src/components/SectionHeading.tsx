import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ChevronRight } from "lucide-react-native";

import { useTheme } from "@/theme/ThemeContext";

export default function SectionHeading({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={10}
          style={styles.action}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>
            {actionLabel}
          </Text>
          <ChevronRight size={14} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", marginBottom: 10 },
  title: { fontSize: 17, fontWeight: "800" },
  sub: { fontSize: 12, marginTop: 2 },
  action: { flexDirection: "row", alignItems: "center", gap: 2 },
  actionText: { fontSize: 12, fontWeight: "700" },
});
