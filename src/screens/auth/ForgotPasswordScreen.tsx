import { HEADER_TOP_PADDING } from "@/theme/layout";

import { useMemo } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ChevronLeft,
  KeyRound,
  ArrowRight,
  CheckCircle2,
} from "lucide-react-native";

import useForgotPassword from "@/modules/auth/hooks/useForgotPassword";

import { useChurchStore } from "@/store/churchStore";

import { useTheme } from "@/theme/ThemeContext";
import type { ColorTokens } from "@/theme/colors";

export default function ModernForgotPasswordScreen({
  navigation,
}: any) {
  const {
    email,
    setEmail,
    loading,
    error,
    sent,
    handleResetPassword,
  } =
    useForgotPassword();

  const fullProfile = useChurchStore(
    state => state.fullProfile
  );

  const { colors } = useTheme();

  // Rebuilt only when the theme changes (light <-> dark).
  const styles = useMemo(
    () => makeStyles(colors),
    [colors]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View
        style={styles.topBar}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text
          style={
            styles.topBarTitle
          }
          numberOfLines={1}
        >
          {fullProfile?.churchName ||
            "LightCalls"}
        </Text>

        <View
          style={{ width: 22 }}
        />
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
      >
        <View
          style={
            styles.iconWrap
          }
        >
          <KeyRound
            size={24}
            color={colors.onPrimaryMuted}
          />
        </View>

        <Text style={styles.title}>
          Reset Password
        </Text>

        <Text
          style={
            styles.description
          }
        >
          Enter your email
          address and we'll send
          you a link to reset
          your password.
        </Text>

        <View
          style={styles.card}
        >
          <Text
            style={
              styles.fieldLabel
            }
          >
            Email Address
          </Text>

          <TextInput
            value={email}
            onChangeText={
              setEmail
            }
            placeholder="name@example.com"
            autoComplete="email"
            textContentType="emailAddress"
            autoCorrect={false}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={
              styles.input
            }
          />

          {sent ? (
            <View style={styles.successBox}>
              <CheckCircle2
                size={16}
                color={colors.info}
              />
              <Text style={styles.successText}>
                A reset link has been sent to {email.trim()}. Check your inbox
                (and spam folder), then return to log in.
              </Text>
            </View>
          ) : null}

          {error ? (
            <Text
              style={
                styles.errorText
              }
            >
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleResetPassword}
            style={[
              styles.submitButton,
              loading && styles.submitButtonLoading,
            ]}
          >
            <Text
              style={
                styles.submitText
              }
            >
              {loading
                ? "Sending..."
                : sent
                ? "Resend Link"
                : "Send Reset Link"}
            </Text>

            {!loading ? (
              <ArrowRight
                size={16}
                color={colors.textOnPrimary}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: ColorTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: HEADER_TOP_PADDING,
      paddingBottom: 14,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },

    topBarTitle: {
      flex: 1,
      textAlign: "center",
      marginHorizontal: 8,
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    scroll: {
      padding: 24,
      alignItems: "center",
    },

    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primaryMuted,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
      marginBottom: 18,
    },

    title: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    description: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 19,
      marginTop: 8,
      marginBottom: 24,
      paddingHorizontal: 12,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      width: "100%",
    },

    fieldLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.textMuted,
      marginBottom: 8,
      letterSpacing: 0.3,
    },

    input: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 46,
      fontSize: 14,
      color: colors.textPrimary,
    },

    successBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      backgroundColor: colors.infoMuted,
      borderRadius: 12,
      padding: 12,
      marginTop: 12,
    },

    successText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: colors.info,
    },

    errorText: {
      color: colors.danger,
      fontSize: 12,
      marginTop: 8,
    },

    submitButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      marginTop: 14,
    },

    submitButtonLoading: {
      opacity: 0.7,
    },

    submitText: {
      color: colors.textOnPrimary,
      fontWeight: "700",
      fontSize: 13,
    },
  });