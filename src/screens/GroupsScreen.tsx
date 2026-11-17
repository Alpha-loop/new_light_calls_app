import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";

import { Search, Users } from "lucide-react-native";

import PageHeader from "@/components/PageHeader";

import useGroups from "@/modules/groups/hooks/useGroups";

import {
  clean,
  isMyGroup,
  scheduleText,
} from "@/modules/groups/utils";

import { useTheme } from "@/theme/ThemeContext";

/** route.params: { filter?: "mine" } */
export default function GroupsScreen({ navigation, route }: any) {
  const { colors } = useTheme();

  const { groups, loading, refreshing, error, reload, onRefresh } =
    useGroups();

  const [query, setQuery] = useState("");
  const [mineOnly, setMineOnly] = useState(route?.params?.filter === "mine");
  const [type, setType] = useState("All");

  const types = useMemo(() => {
    const set = new Set<string>();
    groups.forEach(g => {
      const t = clean(g.groupTypeName);
      if (t) set.add(t);
    });
    return ["All", ...Array.from(set).sort()];
  }, [groups]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter(g => (mineOnly ? isMyGroup(g) : true))
      .filter(g => (type === "All" ? true : clean(g.groupTypeName) === type))
      .filter(g =>
        q ? `${g.name} ${clean(g.description)}`.toLowerCase().includes(q) : true
      );
  }, [groups, query, mineOnly, type]);

  const Chip = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.primary : colors.surface,
        },
      ]}
    >
      <Text
        style={{
          color: active ? "#FFFFFF" : colors.textSecondary,
          fontWeight: "700",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title="Groups & Ministries" />

      <View style={[styles.search, { backgroundColor: colors.surface }]}>
        <Search size={16} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search groups"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.textPrimary }]}
        />
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip
            label="Discover"
            active={!mineOnly}
            onPress={() => setMineOnly(false)}
          />
          <Chip
            label="My Groups"
            active={mineOnly}
            onPress={() => setMineOnly(true)}
          />
          {types.length > 2
            ? types.map(t => (
                <Chip
                  key={t}
                  label={t}
                  active={type === t}
                  onPress={() => setType(t)}
                />
              ))
            : null}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: colors.textMuted }}>{error}</Text>
          <TouchableOpacity
            onPress={reload}
            style={[styles.retry, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={g => String(g.id)}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              {mineOnly
                ? "You haven't joined any groups yet."
                : "No groups found."}
            </Text>
          }
          renderItem={({ item }) => {
            const image = clean(item.imageUrl);
            const when = scheduleText(item);
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("GroupDetails", { id: item.id })
                }
                style={[styles.card, { backgroundColor: colors.surface }]}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    cachePolicy="memory-disk"
                    contentFit="cover"
                    style={styles.thumb}
                  />
                ) : (
                  <View
                    style={[
                      styles.thumb,
                      styles.thumbFallback,
                      { backgroundColor: colors.primaryMuted },
                    ]}
                  >
                    <Users size={24} color={colors.primary} />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={[styles.name, { color: colors.textPrimary }]}
                  >
                    {item.name}
                  </Text>
                  {clean(item.groupTypeName) ? (
                    <Text style={[styles.type, { color: colors.primary }]}>
                      {clean(item.groupTypeName)}
                    </Text>
                  ) : null}
                  {when ? (
                    <Text
                      numberOfLines={1}
                      style={[styles.meta, { color: colors.textMuted }]}
                    >
                      {when}
                    </Text>
                  ) : null}
                  <Text style={[styles.meta, { color: colors.textMuted }]}>
                    {item.peopleInGroupsCount ?? 0}{" "}
                    {item.peopleInGroupsCount === 1 ? "member" : "members"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
  },
  input: { flex: 1, fontSize: 14, padding: 0 },
  chips: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  retry: { marginTop: 14, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20 },
  empty: { textAlign: "center", paddingVertical: 50, fontSize: 13 },
  card: { flexDirection: "row", gap: 12, padding: 12, borderRadius: 16 },
  thumb: { width: 76, height: 76, borderRadius: 14 },
  thumbFallback: { alignItems: "center", justifyContent: "center" },
  name: { fontSize: 15, fontWeight: "800" },
  type: { fontSize: 11, fontWeight: "700", marginTop: 2 },
  meta: { fontSize: 12, marginTop: 3 },
});
