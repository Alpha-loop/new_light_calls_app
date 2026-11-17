import { useEffect, useMemo, useState } from "react";

import {
  AccessibilityInfo,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";

import {
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  Search,
  UserPlus,
  X,
} from "lucide-react-native";

import useMeetupDiscovery, {
  RequestFeedback,
} from "@/modules/social/hooks/useMeetupDiscovery";

import { useTheme } from "@/theme/ThemeContext";

const clean = (v?: string) => {
  const t = v?.trim();
  return !t || t.toLowerCase() === "null" ? "" : t;
};

function Avatar({
  photo,
  name,
}: {
  photo?: string;
  name: string;
}) {
  const { colors } = useTheme();
  const url = clean(photo);

  return url ? (
    <Image
      recyclingKey={url}
      cachePolicy="memory-disk"
      source={{ uri: url }}
      style={styles.avatar}
    />
  ) : (
    <View
      style={[
        styles.avatar,
        styles.avatarFallback,
        { backgroundColor: colors.primaryMuted },
      ]}
    >
      <Text
        style={{
          color: colors.primary,
          fontWeight: "800",
          fontSize: 18,
        }}
      >
        {(name.trim()[0] || "?").toUpperCase()}
      </Text>
    </View>
  );
}

function StatusBanner({
  feedback,
  onDismiss,
}: {
  feedback: NonNullable<RequestFeedback>;
  onDismiss: () => void;
}) {
  const { colors } = useTheme();
  const isError = feedback.type === "error";
  const accent = isError ? colors.danger : colors.primary;
  const Icon = isError ? CircleAlert : CircleCheck;

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      feedback.message
    );
  }, [feedback]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onDismiss}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          backgroundColor: isError
            ? colors.dangerMuted
            : colors.primaryMuted,
          borderColor: accent,
        },
      ]}
    >
      <Icon size={18} color={accent} />
      <Text
        style={[
          styles.bannerText,
          { color: colors.textPrimary },
        ]}
      >
        {feedback.message}
      </Text>
      <X size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function ModernSocialsScreen() {
  const { colors } = useTheme();

  const {
    loading,
    loadError,
    reload,
    candidates,
    sendRequest,
    sendingId,
    feedback,
    dismissFeedback,
  } = useMeetupDiscovery();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const people = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...candidates].sort((a, b) =>
      (a.fullName || "").localeCompare(b.fullName || "")
    );
    if (!q) return list;
    return list.filter(p =>
      `${p.fullName || ""} ${clean(p.address)}`
        .toLowerCase()
        .includes(q)
    );
  }, [candidates, query]);

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  if (loadError) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.textMuted }}>
          {loadError}
        </Text>
        <TouchableOpacity
          onPress={reload}
          style={[
            styles.retry,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {feedback ? (
        <StatusBanner
          feedback={feedback}
          onDismiss={dismissFeedback}
        />
      ) : null}

      <View style={styles.headerRow}>
        {searching ? (
          <View
            style={[
              styles.searchBox,
              { backgroundColor: colors.surface },
            ]}
          >
            <Search size={16} color={colors.textMuted} />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Search members"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.searchInput,
                { color: colors.textPrimary },
              ]}
            />
            <TouchableOpacity
              hitSlop={12}
              onPress={() => {
                setQuery("");
                setSearching(false);
              }}
            >
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.heading,
                { color: colors.textPrimary },
              ]}
            >
              Church Family
            </Text>
            <TouchableOpacity
              hitSlop={12}
              onPress={() => setSearching(true)}
              accessibilityLabel="Search members"
              style={[
                styles.searchBtn,
                { backgroundColor: colors.primaryMuted },
              ]}
            >
              <Search size={18} color={colors.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <FlatList
        data={people}
        keyExtractor={item => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text
            style={[
              styles.empty,
              { color: colors.textMuted },
            ]}
          >
            {query
              ? "No members match your search."
              : "No members to show right now."}
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={[
              styles.sep,
              { backgroundColor: colors.divider },
            ]}
          />
        )}
        renderItem={({ item }) => {
          const status = clean(item.friendshipRequest);
          const isPending = /pending/i.test(status);
          const isFriend = /accept|friend|connected/i.test(
            status
          );
          const busy = sendingId === item.id;
          const sub = clean(item.address);

          return (
            <View style={styles.row}>
              <Avatar
                photo={item.photo}
                name={item.fullName || ""}
              />

              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.name,
                    { color: colors.textPrimary },
                  ]}
                >
                  {item.fullName}
                </Text>
                {sub ? (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.sub,
                      { color: colors.textMuted },
                    ]}
                  >
                    {sub}
                  </Text>
                ) : null}
              </View>

              {isFriend ? (
                <Check size={18} color={colors.primary} />
              ) : isPending ? (
                <View style={styles.pending}>
                  <Clock
                    size={14}
                    color={colors.textMuted}
                  />
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: 12,
                    }}
                  >
                    Pending
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  disabled={busy}
                  onPress={() => sendRequest(item)}
                  style={[
                    styles.addBtn,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  {busy ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <>
                      <UserPlus size={14} color="#FFFFFF" />
                      <Text style={styles.addText}>Add</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  heading: { fontSize: 20, fontWeight: "800" },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 42,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 15, fontWeight: "700" },
  sub: { fontSize: 12, marginTop: 2 },
  sep: { height: 1, marginLeft: 76 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    minWidth: 62,
    justifyContent: "center",
  },
  addText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
  pending: { flexDirection: "row", alignItems: "center", gap: 4 },
  empty: { textAlign: "center", paddingVertical: 40, fontSize: 13 },
  retry: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: { color: "#FFFFFF", fontWeight: "700" },
  banner: {
    position: "absolute",
    top: 8,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bannerText: { flex: 1, fontSize: 13, fontWeight: "600" },
});
