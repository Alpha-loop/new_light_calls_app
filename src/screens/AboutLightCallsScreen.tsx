import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Image } from "expo-image";

import Constants from "expo-constants";

import { ChevronRight, FileText, ShieldCheck } from "lucide-react-native";

import PageHeader from "@/components/PageHeader";

import { useChurchStore } from "@/store/churchStore";

import { useTheme } from "@/theme/ThemeContext";

const PRIVACY_URL =
  process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ||
  "https://foursquarevgc.org/privacy";
const TERMS_URL =
  process.env.EXPO_PUBLIC_TERMS_URL || "https://foursquarevgc.org/terms";

export default function AboutLightCallsScreen() {
  const { colors } = useTheme();
  const churchName: string =
    (useChurchStore(s => s.fullProfile) as any)?.churchName || "";

  const version = Constants.expoConfig?.version ?? "1.0.0";

  const links = [
    { label: "Privacy Policy", url: PRIVACY_URL, Icon: ShieldCheck },
    { label: "Terms of Use", url: TERMS_URL, Icon: FileText },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title="About LightCalls" />

      <ScrollView
        contentContainerStyle={{ padding: 20, alignItems: "center", paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../assets/logo-full.png")}
          contentFit="contain"
          style={styles.logo}
        />

        <Text style={[styles.name, { color: colors.textPrimary }]}>
          LightCalls
        </Text>
        <Text style={[styles.version, { color: colors.textMuted }]}>
          Version {version}
        </Text>

        <Text style={[styles.tagline, { color: colors.primary }]}>
          Stay connected. Grow in Christ. Shine His light.
        </Text>

        <Text style={[styles.body, { color: colors.textSecondary }]}>
          LightCalls is the digital home of{" "}
          {churchName || "our church"}. Use it to read devotionals and the
          Bible, watch services, stay up to date with church updates, connect
          with the church family and groups, give, and reach the church
          office.
        </Text>

        <View
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          {links.map(({ label, url, Icon }, i) => (
            <TouchableOpacity
              key={label}
              activeOpacity={0.8}
              onPress={() => Linking.openURL(url)}
              style={[
                styles.row,
                i > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: colors.divider,
                },
              ]}
            >
              <Icon size={18} color={colors.textSecondary} />
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
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
  logo: { width: 110, height: 110, marginTop: 10 },
  name: { fontSize: 26, fontWeight: "800", marginTop: 14 },
  version: { fontSize: 12, marginTop: 4 },
  tagline: { fontSize: 13, fontWeight: "700", fontStyle: "italic", marginTop: 14, textAlign: "center" },
  body: { fontSize: 14, lineHeight: 22, marginTop: 18, textAlign: "center" },
  card: { alignSelf: "stretch", borderRadius: 16, marginTop: 26 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: "600" },
});
