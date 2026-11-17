import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";

import moment from "moment";

import {
  Building2,
  CalendarDays,
  ArrowRight,
  Gift,
  Play,
  StickyNote,
  Users,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import SectionHeading from "@/components/SectionHeading";

import useHome from "@/modules/home/hooks/useHome";

import useEvents from "@/modules/events/hooks/useUpcomingEvents";

import useProfile from "@/modules/profile/hooks/useProfile";

import { findJoinGroupItem } from "@/modules/churchOffice/utils/churchOffice";

import { useChurchStore } from "@/store/churchStore";

import useRequireAuth from "@/modules/auth/hooks/useRequireAuth";

import { useAuthStore } from "@/store/authStore";

import { getEventImage } from "@/utils/eventImage";

import { stripHtml } from "@/utils/stripHtml";

import { useTheme } from "@/theme/ThemeContext";

const isNull = (v?: string | null) =>
  !v || v.trim().toLowerCase() === "null";

export default function HomeDashboardScreen({ navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { devotional, videos, feeds, onRefresh, refreshing } = useHome();
  const { events } = useEvents();
  const { profile } = useProfile();
  const isGuest = useAuthStore(s => s.isGuest);
  const { requireAuth } = useRequireAuth();

  const fullProfile: any = useChurchStore(st => st.fullProfile);

  const joinGroup = () => {
    const item = findJoinGroupItem(fullProfile?.forms);

    if (item?.url) {
      navigation.navigate("ExternalUrl", {
        title: item.title,
        uri: item.url,
      });
    } else {
      navigation.navigate("Groups");
    }
  };

  const firstName = isNull(profile?.firstName) ? "" : profile?.firstName;

  const announcements = feeds
    .filter((f: any) => /announce/i.test(f.postCategoryName || ""))
    .slice(0, 2);
  const latestPosts = announcements.length
    ? announcements
    : feeds.slice(0, 2);

  const video = videos?.[0];
  const nextEvents = (events || []).slice(0, 2);

  const quick = [
    {
      label: "Church Office",
      Icon: Building2,
      onPress: () => navigation.navigate("ChurchOffice"),
    },
    {
      label: "Join a Group",
      Icon: Users,
      onPress: joinGroup,
    },
    {
      label: "Giving",
      Icon: Gift,
      onPress: () => navigation.navigate("Giving"),
    },
    {
      label: "My Notes",
      Icon: StickyNote,
      onPress: () =>
        requireAuth(() => navigation.navigate("MyNotes"), {
          message: "Sign in to view your notes.",
        }),
    },
  ];

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
        <Text style={[styles.date, { color: colors.textMuted }]}>
          {moment().format("dddd, MMM D")}
        </Text>
        <Text style={[styles.welcome, { color: colors.textPrimary }]}>
          {firstName && !isGuest ? `Welcome, ${firstName}` : "Welcome"}
        </Text>
        <Text style={[styles.welcomeSub, { color: colors.textSecondary }]}>
          What does your heart seek today?
        </Text>
      </View>

      {devotional ? (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() =>
            navigation.navigate("TodayDevotional", { data: devotional })
          }
          style={[styles.devotional, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.devEyebrow}>TODAY'S DEVOTIONAL</Text>
          <Text style={styles.devTitle} numberOfLines={3}>
            {devotional.title}
          </Text>
          <View style={styles.devButton}>
            <Text style={[styles.devButtonText, { color: colors.primary }]}>
              Read Devotional
            </Text>
            <ArrowRight size={14} color={colors.primary} />
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.quickRow}>
        {quick.map(({ label, Icon, onPress }) => (
          <TouchableOpacity
            key={label}
            activeOpacity={0.85}
            onPress={onPress}
            style={[styles.quick, { backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: colors.primaryMuted },
              ]}
            >
              <Icon size={18} color={colors.primary} />
            </View>
            <Text
              numberOfLines={2}
              style={[styles.quickLabel, { color: colors.textPrimary }]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <SectionHeading
          title="Services"
          subtitle="Stay connected in worship."
          actionLabel="Service Times"
          onAction={() => navigation.navigate("AboutChurch")}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("AboutChurch")}
          style={[
            styles.card,
            { backgroundColor: colors.surface, padding: 16 },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Join us for worship
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            See when and where we gather.
          </Text>
          <Text style={[styles.watch, { color: colors.primary }]}>
            View service times
          </Text>
        </TouchableOpacity>
      </View>

      {latestPosts.length ? (
        <View>
          <SectionHeading
            title="Announcements"
            subtitle="Important church updates"
            actionLabel="View all"
            onAction={() =>
              navigation.navigate("FeedCategory", {
                title: "Announcements",
                match: announcements.length ? "announce" : undefined,
              })
            }
          />
          <View style={{ gap: 10 }}>
            {latestPosts.map((item: any, i: number) => (
              <TouchableOpacity
                key={item.postId ?? i}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("FeedsDetail", { feed: item })
                }
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, padding: 14 },
                ]}
              >
                {item.postCategoryName ? (
                  <Text style={[styles.cat, { color: colors.primary }]}>
                    {String(item.postCategoryName).toUpperCase()}
                  </Text>
                ) : null}
                <Text
                  numberOfLines={2}
                  style={[styles.cardTitle, { color: colors.textPrimary }]}
                >
                  {item.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.body, { color: colors.textSecondary }]}
                >
                  {stripHtml(item.content)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      {nextEvents.length ? (
        <View>
          <SectionHeading
            title="Upcoming Events"
            subtitle="Gather with God's people. Come expectant."
            actionLabel="View all"
            onAction={() => navigation.navigate("Events")}
          />
          <View style={{ gap: 10 }}>
            {nextEvents.map((event: any) => (
              <TouchableOpacity
                key={event.id}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("EventDetails", { event })
                }
                style={[
                  styles.card,
                  styles.eventRow,
                  { backgroundColor: colors.surface },
                ]}
              >
                {getEventImage(event) ? (
                  <Image
                    source={{ uri: getEventImage(event) as string }}
                    cachePolicy="memory-disk"
                    contentFit="cover"
                    style={styles.eventThumb}
                  />
                ) : (
                  <View
                    style={[
                      styles.eventThumb,
                      styles.eventDate,
                      { backgroundColor: colors.primaryMuted },
                    ]}
                  >
                    <CalendarDays size={18} color={colors.primary} />
                    <Text style={[styles.eventMonth, { color: colors.primary }]}>
                      {event.startDate
                        ? moment(event.startDate).format("MMM D")
                        : ""}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={[styles.cardTitle, { color: colors.textPrimary }]}
                  >
                    {event.name}
                  </Text>
                  <Text style={[styles.body, { color: colors.textMuted }]}>
                    {event.startDate
                      ? moment(event.startDate).format("ddd, MMM D • h:mm A")
                      : ""}
                    {event.venueDisplayName
                      ? ` • ${event.venueDisplayName}`
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      {video ? (
        <View>
          <SectionHeading
            title="Sunday's Sermon"
            actionLabel="All sermons"
            onAction={() => navigation.navigate("Media")}
          />
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
            <View style={{ backgroundColor: colors.placeholder }}>
              {video.thumbnailUrl ? (
                <Image
                  source={{ uri: video.thumbnailUrl }}
                  cachePolicy="memory-disk"
                  contentFit="cover"
                  style={styles.videoThumb}
                />
              ) : (
                <View style={styles.videoThumb} />
              )}
              <View style={styles.play}>
                <Play size={22} color="#FFFFFF" fill="#FFFFFF" />
              </View>
            </View>
            <View style={{ padding: 14 }}>
              <Text
                numberOfLines={2}
                style={[styles.cardTitle, { color: colors.textPrimary }]}
              >
                {video.title}
              </Text>
              <Text style={[styles.watch, { color: colors.primary }]}>
                Watch now
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  date: { fontSize: 12, fontWeight: "600" },
  welcome: { fontSize: 26, fontWeight: "800", marginTop: 4 },
  welcomeSub: { fontSize: 14, marginTop: 2 },
  devotional: { borderRadius: 20, padding: 20 },
  devEyebrow: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  devTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginTop: 8 },
  devButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },
  devButtonText: { fontSize: 13, fontWeight: "800" },
  quickRow: { flexDirection: "row", gap: 10 },
  quick: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 8,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: { fontSize: 11, fontWeight: "700", textAlign: "center" },
  card: { borderRadius: 16, overflow: "hidden" },
  videoThumb: { width: "100%", height: 190 },
  play: {
    position: "absolute",
    alignSelf: "center",
    top: 70,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "800" },
  watch: { fontSize: 12, fontWeight: "800", marginTop: 8 },
  cat: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 4 },
  body: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  eventRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 10 },
  eventThumb: { width: 62, height: 62, borderRadius: 12 },
  eventDate: { alignItems: "center", justifyContent: "center", gap: 2 },
  eventMonth: { fontSize: 10, fontWeight: "800" },
});
