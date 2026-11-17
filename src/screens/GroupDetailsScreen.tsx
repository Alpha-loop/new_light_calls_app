import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";

import moment from "moment";

import { CalendarDays, Globe, MessageCircle, Send } from "lucide-react-native";

import PageHeader from "@/components/PageHeader";

import SectionHeading from "@/components/SectionHeading";

import useGroupDetail from "@/modules/groups/hooks/useGroupDetail";

import { JOIN_GROUP_ENDPOINT } from "@/modules/groups/services/group.service";

import { clean, isMyGroup, scheduleText } from "@/modules/groups/utils";

import { stripHtml } from "@/utils/stripHtml";

import { useTheme } from "@/theme/ThemeContext";

export default function GroupDetailsScreen({ route }: any) {
  const { colors } = useTheme();

  const { group, loading, error, reload } = useGroupDetail(route.params?.id);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <PageHeader title="Group" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error || !group) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <PageHeader title="Group" />
        <View style={styles.center}>
          <Text style={{ color: colors.textMuted }}>
            {error || "Group not found."}
          </Text>
          <TouchableOpacity
            onPress={reload}
            style={[styles.btn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.btnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const image = clean(group.imageUrl);
  const when = scheduleText(group);
  const members =
    group.overview?.totalMembers ?? group.peopleInGroupsCount ?? 0;
  const description = stripHtml(group.description);
  const managers = group.groupManagers ?? [];
  const events = group.groupEvents ?? [];
  const mine = isMyGroup(group);

  const links = [
    { label: "WhatsApp", url: clean(group.whatsAppUrl), Icon: MessageCircle },
    { label: "Telegram", url: clean(group.telegramUrl), Icon: Send },
    { label: "Website", url: clean(group.websiteUrl), Icon: Globe },
  ].filter(l => l.url);

  const canJoin = !!JOIN_GROUP_ENDPOINT && !mine;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title={group.name} />

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 22, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            cachePolicy="memory-disk"
            contentFit="cover"
            style={styles.hero}
          />
        ) : null}

        <View>
          {clean(group.groupTypeName) ? (
            <Text style={[styles.type, { color: colors.primary }]}>
              {clean(group.groupTypeName).toUpperCase()}
            </Text>
          ) : null}
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {group.name}
          </Text>
          {when ? (
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {when}
            </Text>
          ) : null}
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {members} {members === 1 ? "member" : "members"}
          </Text>
        </View>

        {mine ? (
          <View style={[styles.note, { backgroundColor: colors.primaryMuted }]}>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              You're a member of this group
            </Text>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              disabled={!canJoin}
              activeOpacity={0.85}
              style={[
                styles.btn,
                {
                  backgroundColor: canJoin ? colors.primary : colors.surface,
                  alignSelf: "stretch",
                },
              ]}
            >
              <Text
                style={[
                  styles.btnText,
                  { color: canJoin ? "#FFFFFF" : colors.textMuted },
                ]}
              >
                {canJoin ? "Request to Join" : "Join requests coming soon"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {description ? (
          <View>
            <SectionHeading title="About" />
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              {description}
            </Text>
          </View>
        ) : null}

        {managers.length ? (
          <View>
            <SectionHeading title="Leaders" />
            <View style={{ gap: 10 }}>
              {managers.map(m => {
                const name = [m.person?.firstName, m.person?.lastName]
                  .map(clean)
                  .filter(Boolean)
                  .join(" ");
                const photo = clean(m.person?.photo);
                return (
                  <View key={m.id} style={styles.person}>
                    {photo ? (
                      <Image source={{ uri: photo }} style={styles.avatar} />
                    ) : (
                      <View
                        style={[
                          styles.avatar,
                          styles.avatarFallback,
                          { backgroundColor: colors.primaryMuted },
                        ]}
                      >
                        <Text
                          style={{ color: colors.primary, fontWeight: "800" }}
                        >
                          {(name[0] || "?").toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      {name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {events.length ? (
          <View>
            <SectionHeading title="Group Events" />
            <View style={{ gap: 10 }}>
              {events.slice(0, 10).map(e => (
                <View
                  key={e.id}
                  style={[styles.event, { backgroundColor: colors.surface }]}
                >
                  <CalendarDays size={18} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: colors.textPrimary,
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      {e.eventName}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                      {moment(e.eventDate).format("ddd, MMM D • h:mm A")}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {links.length ? (
          <View>
            <SectionHeading title="Connect" />
            <View style={{ gap: 10 }}>
              {links.map(({ label, url, Icon }) => (
                <TouchableOpacity
                  key={label}
                  onPress={() => Linking.openURL(url)}
                  style={[styles.event, { backgroundColor: colors.surface }]}
                >
                  <Icon size={18} color={colors.primary} />
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontWeight: "700",
                      fontSize: 14,
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  hero: { width: "100%", height: 190, borderRadius: 18 },
  type: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  name: { fontSize: 24, fontWeight: "800", marginTop: 4 },
  meta: { fontSize: 13, marginTop: 4 },
  body: { fontSize: 14, lineHeight: 21 },
  note: { padding: 14, borderRadius: 14, alignItems: "center" },
  btn: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 14,
  },
  btnText: { color: "#FFFFFF", fontWeight: "800" },
  person: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarFallback: { alignItems: "center", justifyContent: "center" },
  event: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
  },
});
