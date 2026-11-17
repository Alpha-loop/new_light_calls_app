import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";

import {
  BookOpen,
  Newspaper,
  PlayCircle,
  StickyNote,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import HubRow from "@/components/HubRow";

import SectionHeading from "@/components/SectionHeading";

import useHome from "@/modules/home/hooks/useHome";

import useRequireAuth from "@/modules/auth/hooks/useRequireAuth";

import { useTheme } from "@/theme/ThemeContext";

export default function GrowScreen({ navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { devotional, videos, loading, onRefresh, refreshing } = useHome();
  const video: any = videos?.[0];
  const { requireAuth } = useRequireAuth();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 16,
        gap: 22,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <SectionHeading
          title="Devotionals"
          actionLabel="Previous"
          onAction={() => navigation.navigate("DevotionalLibrary")}
        />
        {devotional ? (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() =>
              navigation.navigate("TodayDevotional", { data: devotional })
            }
            style={[styles.card, { backgroundColor: colors.surface }]}
          >
            {devotional.mediaUrl && devotional.mediaUrl !== "null" ? (
              <Image
                source={{ uri: devotional.mediaUrl }}
                cachePolicy="memory-disk"
                contentFit="cover"
                style={styles.cardImage}
              />
            ) : null}
            <View style={{ padding: 14 }}>
              <Text style={[styles.cat, { color: colors.primary }]}>
                TODAY'S DEVOTIONAL
              </Text>
              <Text
                numberOfLines={2}
                style={[styles.cardTitle, { color: colors.textPrimary }]}
              >
                {devotional.title}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>
            {loading ? "Loading…" : "No devotional for today yet."}
          </Text>
        )}
      </View>

      <View style={{ gap: 10 }}>
        <SectionHeading title="Scripture" />
        <HubRow
          Icon={BookOpen}
          title="Read the Bible"
          subtitle="Read, search and journal on scripture"
          onPress={() => navigation.navigate("Bible")}
        />
      </View>

      <View>
        <SectionHeading
          title="Sunday's Sermon"
          actionLabel="All sermons"
          onAction={() => navigation.navigate("Media")}
        />
        {video ? (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() =>
              navigation.navigate("ViewVideoDetails", {
                data: video,
                videoDetails: videos,
              })
            }
            style={[styles.card, { backgroundColor: colors.surface }]}
          >
            {video.thumbnailUrl ? (
              <Image
                source={{ uri: video.thumbnailUrl }}
                cachePolicy="memory-disk"
                contentFit="cover"
                style={styles.cardImage}
              />
            ) : null}
            <View style={{ padding: 14 }}>
              <Text
                numberOfLines={2}
                style={[styles.cardTitle, { color: colors.textPrimary }]}
              >
                {video.title}
              </Text>
              <Text style={[styles.more, { color: colors.primary }]}>
                Watch now
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>
            {loading ? "Loading…" : "No sermon posted yet."}
          </Text>
        )}
      </View>

      <View style={{ gap: 10 }}>
        <SectionHeading title="Explore" />
        <HubRow
          Icon={PlayCircle}
          title="Sermons & Media"
          subtitle="Watch and listen to messages"
          onPress={() => navigation.navigate("Media")}
        />
        <HubRow
          Icon={Newspaper}
          title="Blog"
          subtitle="Church articles and teaching"
          onPress={() =>
            navigation.navigate("FeedCategory", {
              title: "Blog",
              match: "blog|article",
            })
          }
        />
        <HubRow
          Icon={StickyNote}
          title="My Notes"
          subtitle="Create, browse and search your notes"
          onPress={() =>
            requireAuth(() => navigation.navigate("MyNotes"), {
              message: "Sign in to view your notes.",
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 4 },
  sub: { fontSize: 13, marginTop: 4, lineHeight: 19 },
  card: { borderRadius: 16, overflow: "hidden" },
  cardImage: { width: "100%", height: 150 },
  cat: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  body: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  more: { fontSize: 12, fontWeight: "800", marginTop: 10 },
});
