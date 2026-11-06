import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme/ThemeContext";

interface Props {
  title: string;

  onPrevious: () => void;

  onNext: () => void;

  hasPrevious: boolean;

  hasNext: boolean;
}

export default function ChapterNavigationBar({
  title,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: Props) {
  const { colors } = useTheme();

  // Same class of fix as the tab bar and comment input elsewhere
  // in this app — a bottom-anchored bar needs the real device
  // inset added, or it sits right against the home-indicator
  // gesture area on devices with no physical home button.
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          borderTopColor: colors.border,

          paddingBottom:
            12 + insets.bottom,
        },
      ]}
    >
      <TouchableOpacity
        disabled={!hasPrevious}
        onPress={onPrevious}
        hitSlop={8}
        style={[
          styles.arrow,
          {
            opacity: hasPrevious
              ? 1
              : 0.3,
          },
        ]}
      >
        <ChevronLeft
          size={22}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          { color: colors.textSecondary },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <TouchableOpacity
        disabled={!hasNext}
        onPress={onNext}
        hitSlop={8}
        style={[
          styles.arrow,
          {
            opacity: hasNext
              ? 1
              : 0.3,
          },
        ]}
      >
        <ChevronRight
          size={22}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    // minHeight, not a fixed height: the old `height: 56` had to hold
    // 10 top padding + the safe-area inset + the content, so on any
    // phone with gesture navigation the title was clipped and the
    // arrows sat half under the system bar.
    minHeight: 56,

    paddingHorizontal: 12,

    paddingTop: 8,

    borderTopWidth: 1,
  },

  arrow: {
    width: 44,

    height: 44,

    alignItems: "center",

    justifyContent: "center",
  },

  title: {
    fontSize: 13,

    fontWeight: "600",

    flex: 1,

    textAlign: "center",

    marginHorizontal: 10,
  },
});
