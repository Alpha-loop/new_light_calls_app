import { HEADER_TOP_PADDING } from "@/theme/layout";

import { useEffect, useState } from "react";

import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ChevronLeft,
  Check,
  Sun,
  Moon,
  Smartphone,
  Fingerprint,
  ShieldCheck,
  FileText,
  Info,
  ChevronRight,
} from "lucide-react-native";

import { useTheme } from "@/theme/ThemeContext";

import {
  confirmBiometric,
  disableBiometric,
  isBiometricAvailable,
  isBiometricEnabled,
} from "@/utils/biometric";

const PRIVACY_URL = "https://foursquarevgc.org/privacy";
const TERMS_URL = "https://foursquarevgc.org/terms";

// Logout lives directly in the side drawer (ModernMenuDrawer/
// ModernHeader) instead of here. Dark mode preference is the
// first real thing to live on this screen.
const THEME_OPTIONS: {
  key: "system" | "light" | "dark";
  label: string;
  Icon: typeof Sun;
}[] = [
  {
    key: "system",
    label: "Follow System",
    Icon: Smartphone,
  },
  {
    key: "light",
    label: "Light",
    Icon: Sun,
  },
  {
    key: "dark",
    label: "Dark",
    Icon: Moon,
  },
];

export default function SettingsScreen({
  navigation,
}: any) {
  const {
    colors,
    preference,
    setPreference,
  } = useTheme();

  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioOn, setBioOn] = useState(false);

  useEffect(() => {
    (async () => {
      setBioAvailable(await isBiometricAvailable());
      setBioOn(await isBiometricEnabled());
    })();
  }, []);

  const toggleBiometric = async (next: boolean) => {
    if (next) {
      if (!(await confirmBiometric())) return;
      // Credentials are captured at login; to enable later the
      // member signs in once and accepts the prompt.
      Alert.alert(
        "Enable at next login",
        "For your security, sign in with your password once more and choose \"Enable Biometric Login\" when asked."
      );
      return;
    }
    await disableBiometric();
    setBioOn(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.topBar,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          hitSlop={14}
        >
          <ChevronLeft
            size={22}
            color={
              colors.textPrimary
            }
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.topBarTitle,
            {
              color:
                colors.textPrimary,
            },
          ]}
        >
          Settings
        </Text>

        <View
          style={{ width: 22 }}
        />
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >
        <Text
          style={[
            styles.sectionLabel,
            {
              color:
                colors.textMuted,
            },
          ]}
        >
          APPEARANCE
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          {THEME_OPTIONS.map(
            (
              { key, label, Icon },
              index
            ) => {
              const active =
                preference === key;

              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.8}
                  onPress={() =>
                    setPreference(
                      key
                    )
                  }
                  style={[
                    styles.row,
                    index > 0 && {
                      borderTopWidth: 1,
                      borderTopColor:
                        colors.divider,
                    },
                  ]}
                >
                  <Icon
                    size={18}
                    color={
                      active
                        ? colors.primary
                        : colors.textSecondary
                    }
                  />

                  <Text
                    style={[
                      styles.rowLabel,
                      {
                        color: active
                          ? colors.primary
                          : colors.textPrimary,

                        fontWeight: active
                          ? "700"
                          : "600",
                      },
                    ]}
                  >
                    {label}
                  </Text>

                  {active ? (
                    <Check
                      size={18}
                      color={
                        colors.primary
                      }
                    />
                  ) : null}
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {bioAvailable ? (
          <>
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textMuted, marginTop: 22 },
              ]}
            >
              SECURITY
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.row}>
                <Fingerprint size={18} color={colors.primary} />
                <Text
                  style={[
                    styles.rowLabel,
                    { color: colors.textPrimary, fontWeight: "600" },
                  ]}
                >
                  Biometric Login
                </Text>
                <Switch
                  value={bioOn}
                  onValueChange={toggleBiometric}
                  trackColor={{ true: colors.primary }}
                />
              </View>
            </View>
          </>
        ) : null}

        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textMuted, marginTop: 22 },
          ]}
        >
          LEGAL
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {[
            ["About LightCalls", "app:AboutLightCalls", Info],
            ["Privacy Policy", PRIVACY_URL, ShieldCheck],
            ["Terms of Use", TERMS_URL, FileText],
          ].map(([label, url, Icon]: any, i) => (
            <TouchableOpacity
              key={label}
              activeOpacity={0.8}
              onPress={() =>
                String(url).startsWith("app:")
                  ? navigation.navigate(String(url).slice(4))
                  : Linking.openURL(url)
              }
              style={[
                styles.row,
                i > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: colors.divider,
                },
              ]}
            >
              <Icon size={18} color={colors.textSecondary} />
              <Text
                style={[
                  styles.rowLabel,
                  { color: colors.textPrimary, fontWeight: "600" },
                ]}
              >
                {label}
              </Text>
              <ChevronRight size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBar: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    paddingHorizontal: 16,

    paddingTop: HEADER_TOP_PADDING,

    paddingBottom: 14,
  },

  topBarTitle: {
    fontSize: 16,

    fontWeight: "700",
  },

  content: {
    padding: 16,
  },

  sectionLabel: {
    fontSize: 11,

    fontWeight: "700",

    letterSpacing: 0.5,

    marginBottom: 10,

    marginLeft: 4,
  },

  card: {
    borderRadius: 14,

    borderWidth: 1,

    overflow: "hidden",
  },

  row: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    paddingVertical: 14,

    paddingHorizontal: 14,
  },

  rowLabel: {
    flex: 1,

    fontSize: 15,
  },
});