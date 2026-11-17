import { useMemo, useState } from "react";

import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Search } from "lucide-react-native";

import PageHeader from "@/components/PageHeader";

import { useTheme } from "@/theme/ThemeContext";

const DESTINATIONS: { label: string; hint: string; route: string; keywords: string }[] = [
  { label: "Devotionals", hint: "Today and previous", route: "DevotionalLibrary", keywords: "devotion daily word" },
  { label: "Bible", hint: "Read and search scripture", route: "Bible", keywords: "scripture verse study read" },
  { label: "Sermons & Media", hint: "Watch and listen", route: "Media", keywords: "video audio sermon message" },
  { label: "Events", hint: "What's happening", route: "Events", keywords: "programme meeting calendar" },
  { label: "Giving", hint: "Give and pledges", route: "Giving", keywords: "tithe offering donate pledge" },
  { label: "Groups & Ministries", hint: "Discover and join groups", route: "Groups", keywords: "ministry small group cell fellowship" },
  { label: "Church Family", hint: "Find and add members", route: "ChurchFamily", keywords: "members friends connect people" },
  { label: "Messages", hint: "Your conversations", route: "Messages", keywords: "chat inbox" },
  { label: "Community", hint: "Church posts and feed", route: "Community", keywords: "posts feed" },
  { label: "Prayer, Care & Requests", hint: "Contact the church office, forms", route: "ChurchOffice", keywords: "prayer care group ministry contact" },
  { label: "My Notes", hint: "Your journal", route: "MyNotes", keywords: "journal notes" },
  { label: "Notifications", hint: "Church updates", route: "Notifications", keywords: "alerts announcements" },
  { label: "Profile", hint: "Your details", route: "Profile", keywords: "account me" },
  { label: "About LightCalls", hint: "Version and policies", route: "AboutLightCalls", keywords: "app version privacy terms" },
  { label: "Settings", hint: "Appearance, security", route: "Settings", keywords: "biometric dark mode privacy" },
  { label: "About Us", hint: "Service times and contact", route: "AboutChurch", keywords: "service times location" },
];

const TAB_ROUTES = ["Events", "Giving"];

export default function SearchScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return DESTINATIONS;
    return DESTINATIONS.filter(d =>
      `${d.label} ${d.hint} ${d.keywords}`.toLowerCase().includes(t)
    );
  }, [q]);

  const go = (route: string) =>
    TAB_ROUTES.includes(route)
      ? navigation.navigate("Main", { screen: route })
      : navigation.navigate(route);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title="Search" />

      <View style={[styles.box, { backgroundColor: colors.surface }]}>
        <Search size={16} color={colors.textMuted} />
        <TextInput
          autoFocus
          value={q}
          onChangeText={setQ}
          placeholder="Search LightCalls"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.textPrimary }]}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={d => d.route}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Nothing found.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => go(item.route)}
            style={[styles.row, { borderBottomColor: colors.divider }]}
          >
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              {item.label}
            </Text>
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              {item.hint}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 16,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
  },
  input: { flex: 1, fontSize: 14, padding: 0 },
  row: { paddingVertical: 14, borderBottomWidth: 1 },
  label: { fontSize: 15, fontWeight: "700" },
  hint: { fontSize: 12, marginTop: 2 },
  empty: { textAlign: "center", paddingVertical: 40 },
});
