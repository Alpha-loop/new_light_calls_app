import { ScrollView, StyleSheet, Text, View } from "react-native";

import {
  HeartHandshake,
  MessageCircle,
  Newspaper,
  Users,
  UsersRound,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import HubRow from "@/components/HubRow";

import useRequireAuth from "@/modules/auth/hooks/useRequireAuth";

import { useTheme } from "@/theme/ThemeContext";

export default function ConnectScreen({ navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { requireAuth } = useRequireAuth();

  const gated = (route: string, what: string) => () =>
    requireAuth(() => navigation.navigate(route), {
      message: `Sign in to view ${what}.`,
    });

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 16,
        gap: 12,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginBottom: 6 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Connect
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Church Posts and Community Feed
        </Text>
      </View>

      <HubRow
        Icon={Users}
        title="Church Family"
        subtitle="Find members and send connection requests"
        onPress={() => navigation.navigate("ChurchFamily")}
      />
      <HubRow
        Icon={MessageCircle}
        title="Messages"
        subtitle="Your conversations"
        onPress={gated("Messages", "your messages")}
      />
      <HubRow
        Icon={UsersRound}
        title="Groups & Ministries"
        subtitle="Discover groups and see the ones you belong to"
        onPress={() => navigation.navigate("Groups")}
      />
      <HubRow
        Icon={Newspaper}
        title="Community"
        subtitle="Church posts and the community feed"
        onPress={() => navigation.navigate("Community")}
      />
      <HubRow
        Icon={HeartHandshake}
        title="Prayer, Care & Requests"
        subtitle="Reach the church office"
        onPress={() => navigation.navigate("ChurchOffice")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 4 },
  sub: { fontSize: 13, marginTop: 4, lineHeight: 19 },
});
