import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Image } from "expo-image";

import PageHeader from "@/components/PageHeader";

import useHome from "@/modules/home/hooks/useHome";

import { stripHtml } from "@/utils/stripHtml";

import { useTheme } from "@/theme/ThemeContext";

/**
 * Generic list of church posts filtered by category name.
 * Used for Announcements, Daily Reflections and Blog.
 * route.params: { title: string; match?: string }
 */
export default function FeedCategoryScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const { title = "Posts", match } = route.params ?? {};

  const { feeds, loading, refreshing, onRefresh } = useHome();

  const re = match ? new RegExp(match, "i") : null;
  const items = re
    ? feeds.filter((f: any) => re.test(f.postCategoryName || ""))
    : feeds;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title={title} />

      <FlatList
        data={items}
        keyExtractor={(item: any, i) => String(item.postId ?? i)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 50 }}
            />
          ) : (
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              Nothing here yet.
            </Text>
          )
        }
        renderItem={({ item }: any) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate("FeedsDetail", { feed: item })
            }
            style={[styles.card, { backgroundColor: colors.surface }]}
          >
            {item.mediaUrl && item.mediaUrl !== "null" ? (
              <Image
                source={{ uri: item.mediaUrl }}
                contentFit="cover"
                cachePolicy="memory-disk"
                style={styles.image}
              />
            ) : null}
            <View style={{ padding: 14 }}>
              {item.postCategoryName ? (
                <Text style={[styles.cat, { color: colors.primary }]}>
                  {String(item.postCategoryName).toUpperCase()}
                </Text>
              ) : null}
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {item.title}
              </Text>
              <Text
                numberOfLines={3}
                style={[styles.body, { color: colors.textSecondary }]}
              >
                {stripHtml(item.content)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, overflow: "hidden" },
  image: { width: "100%", height: 150 },
  cat: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: "800" },
  body: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  empty: { textAlign: "center", paddingVertical: 50, fontSize: 13 },
});
