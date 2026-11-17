import { StyleSheet, Text, View } from "react-native";

import useProfileLookups from "../hooks/useProfileLookups";

import { useTheme } from "@/theme/ThemeContext";

import { UserProfile } from "../types/profile.types";

interface Props {
  profile: UserProfile;
}

const clean = (v?: string) => {
  const t = v?.trim();
  return !t || t.toLowerCase() === "null" ? "-" : t;
};

export default function ProfileDetailsCard({ profile }: Props) {
  const { colors } = useTheme();

  const { maritalStatusOptions } = useProfileLookups();

  // The profile often returns the status only as an ID (that's why
  // Edit Profile knew "Married" but this card was blank).
  const maritalName =
    clean(profile.maritalStatus) !== "-"
      ? profile.maritalStatus
      : maritalStatusOptions.find(
          m => m.id === profile.maritalStatusID
        )?.name;

  const rows: [string, string | undefined][] = [
    ["Email", profile.email],
    ["Phone Number", profile.mobilePhone],
    ["Address", profile.homeAddress],
    ["Occupation", profile.occupation],
    ["Marital Status", maritalName],
    ["Church Group", profile.churchGroup],
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
      ]}
    >
      {rows.map(([label, value], i) => (
        <View
          key={label}
          style={[
            styles.row,
            i < rows.length - 1 && {
              borderBottomWidth: 1,
              borderBottomColor: colors.divider,
            },
          ]}
        >
          <Text style={[styles.label, { color: colors.textMuted }]}>
            {label}
          </Text>
          <Text
            style={[styles.value, { color: colors.textPrimary }]}
          >
            {clean(value)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginTop: 22,
    paddingHorizontal: 14,
  },
  row: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
});
