import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ChevronLeft } from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";

import { HEADER_TOP_PADDING } from "@/theme/layout";

import { useTheme } from "@/theme/ThemeContext";

export default function PageHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={14}
        accessibilityLabel="Go back"
      >
        <ChevronLeft size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text
        numberOfLines={1}
        style={[styles.title, { color: colors.textPrimary }]}
      >
        {title}
      </Text>

      <View style={{ width: 22 }} />
    </View>
  );
}

/** Wraps an existing tab screen so it can also open as a stacked page. */
export function withPageHeader(
  title: string,
  Screen: React.ComponentType<any>
) {
  return function Wrapped(props: any) {
    const { colors } = useTheme();
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <PageHeader title={title} />
        <View style={{ flex: 1 }}>
          <Screen {...props} />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: HEADER_TOP_PADDING,
    paddingBottom: 14,
  },
  title: { fontSize: 16, fontWeight: "700", flex: 1, textAlign: "center" },
});
