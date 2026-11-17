import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ChevronRight } from "lucide-react-native";

import { useTheme } from "@/theme/ThemeContext";

export default function HubRow({
  Icon,
  title,
  subtitle,
  onPress,
}: {
  Icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.surface }]}
    >
      <View
        style={[styles.icon, { backgroundColor: colors.primaryMuted }]}
      >
        <Icon size={20} color={colors.primary} />
      </View>

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

      <ChevronRight size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 15, fontWeight: "800" },
  sub: { fontSize: 12, marginTop: 2 },
});
