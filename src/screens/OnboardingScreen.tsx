import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { Image } from "expo-image";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  ArrowRight,
  ChevronLeft,
  Users,
  HandHeart,
} from "lucide-react-native";

import {
  onboardingSlides,
  OnboardingSlide,
} from "../data/onboardingSlides";

import { useTheme } from "@/theme/ThemeContext";
import type { ColorTokens } from "@/theme/colors";

export default function ModernOnboardingScreen({
  navigation,
}: any) {
  const { width } =
    useWindowDimensions();

  const { colors } = useTheme();

  // Rebuilt only when the theme changes (light <-> dark).
  const styles = useMemo(
    () => makeStyles(colors),
    [colors]
  );

  const flatListRef =
    useRef<FlatList>(null);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const isLastSlide =
    currentIndex ===
    onboardingSlides.length - 1;

  const goToAuth = () => {
    // Was { name: "Auth" } — that nested wrapper only exists in
    // the main faithConnect app. This app's AppNavigator.tsx
    // registers "Login" directly, flat, with no "Auth" sub-
    // navigator around it — same fix as useRequireAuth.ts.
    navigation.reset({
      index: 0,

      routes: [
        { name: "Login" },
      ],
    });
  };

  const goToSlide = (
    index: number
  ) => {
    flatListRef.current?.scrollToIndex(
      {
        index,
        animated: true,
      }
    );

    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      goToAuth();

      return;
    }

    goToSlide(
      currentIndex + 1
    );
  };

  const renderItem = ({
    item,
  }: {
    item: OnboardingSlide;
  }) => (
    <View
      style={[
        styles.slide,
        { width },
      ]}
    >
      <View
        style={
          styles.imageWrap
        }
      >
        <Image
          cachePolicy="memory-disk"
          // Was source={{ require(item.image) }} — not valid;
          // wrapping require() in an object literal like that
          // doesn't produce a usable source. item.image is
          // already the required asset reference now (see
          // onboardingSlides.ts), so it's used directly.
          source={item.image}
          style={styles.image}
        />

        {item.tag ? (
          <View
            style={styles.tag}
          >
            {item.tag.icon ===
            "users" ? (
              <Users
                size={14}
                color={colors.primary}
              />
            ) : null}

            <Text
              style={
                styles.tagText
              }
            >
              {item.tag.label}
            </Text>
          </View>
        ) : null}

        {item.centerIcon ? (
          <View
            style={
              styles.centerIconWrap
            }
          >
            <HandHeart
              size={26}
              color={colors.primary}
            />
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>
        {item.title}
      </Text>

      <View style={styles.accentBar} />

      <Text
        style={
          styles.description
        }
      >
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View
        style={styles.topBar}
      >
        {isLastSlide ? (
          <TouchableOpacity
            onPress={() =>
              goToSlide(
                currentIndex - 1
              )
            }
            style={
              styles.backRow
            }
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Previous slide"
          >
            <ChevronLeft
              size={18}
              color={colors.textSecondary}
            />

            <Text
              style={
                styles.backText
              }
            >
              Back
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {!isLastSlide ? (
          <TouchableOpacity
            onPress={goToAuth}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Skip introduction"
          >
            <Text
              style={
                styles.skipText
              }
            >
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        // Slides read `styles`/`colors` from the closure; extraData
        // makes FlatList re-render them when the theme changes.
        extraData={colors}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={
          false
        }
        keyExtractor={item =>
          item.id
        }
        renderItem={renderItem}
        onMomentumScrollEnd={event => {
          const index =
            Math.round(
              event
                .nativeEvent
                .contentOffset
                .x / width
            );

          setCurrentIndex(index);
        }}
      />

      <View
        style={
          styles.dotsContainer
        }
        accessible
        accessibilityLabel={`Slide ${currentIndex + 1} of ${onboardingSlides.length}`}
      >
        {onboardingSlides.map(
          (_, index) => (
            <View
              key={index}
              style={[
                styles.dot,

                currentIndex ===
                  index &&
                  styles.activeDot,
              ]}
            />
          )
        )}
      </View>

      <View
        style={
          styles.bottomArea
        }
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={styles.button}
        >
          <Text
            style={
              styles.buttonText
            }
          >
            {isLastSlide
              ? "GET STARTED"
              : "NEXT"}
          </Text>

          <ArrowRight
            size={18}
            color={colors.textOnPrimary}
          />
        </TouchableOpacity>

        {isLastSlide ? (
          <Text
            style={
              styles.terms
            }
          >
            By continuing, you
            agree to our Terms
            of Service.
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ColorTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 8,
      height: 40,
    },

    skipText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },

    backRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },

    backText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    slide: {
      paddingHorizontal: 24,
      paddingTop: 12,
    },

    imageWrap: {
      width: "100%",
      height: 380,
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
      marginBottom: 28,
      // Shows while the photo loads instead of a blank gap.
      backgroundColor: colors.surfaceAlt,
    },

    image: {
      width: "100%",
      height: "100%",
    },

    // Chips sit on top of photos, so they use the solid surface
    // colour (white in light mode, deep purple-grey in dark).
    tag: {
      position: "absolute",
      left: 14,
      bottom: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },

    tagText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    centerIconWrap: {
      position: "absolute",
      alignSelf: "center",
      bottom: 24,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.textPrimary,
      textAlign: "center",
    },

    // Short Dove Yellow bar under each title, matching Login.
    accentBar: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accent,
      marginTop: 12,
    },

    description: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginTop: 12,
      paddingHorizontal: 8,
    },

    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      marginTop: 12,
    },

    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.textMuted,
      opacity: 0.35,
    },

    activeDot: {
      width: 22,
      backgroundColor: colors.primary,
      opacity: 1,
    },

    bottomArea: {
      paddingHorizontal: 24,
      paddingTop: 18,
      paddingBottom: 20,
    },

    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.primary,
      borderRadius: 26,
      paddingVertical: 16,
    },

    buttonText: {
      color: colors.textOnPrimary,
      fontWeight: "700",
      fontSize: 14,
      letterSpacing: 0.5,
    },

    terms: {
      fontSize: 12,
      color: colors.textMuted,
      textAlign: "center",
      marginTop: 12,
    },
  });