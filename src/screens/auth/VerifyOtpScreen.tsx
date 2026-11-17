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
  ShieldCheck,
} from "lucide-react-native";

import useVerifyOtp from "@/modules/auth/hooks/useVerifyOtp";

import { useTheme } from "@/theme/ThemeContext";
import type { ColorTokens } from "@/theme/colors";

export default function ModernVerifyOtpScreen({
  navigation,
  route,
}: any) {
  const {
    signupData,
  } = route.params ?? {};

  const {
    inputs,
    otpArray,
    handleChange,
    handleVerify,
    loading,
    error,
    timer,
  } = useVerifyOtp(
    signupData,
    navigation
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
          <ShieldCheck
            size={26}
            color={colors.onPrimaryMuted}
          />
        </View>

        <Text style={styles.title}>
          Verify Your Email
        </Text>

        <Text
          style={
            styles.description
          }
        >
          We've sent a 6-digit
          code to your email
          address. Please enter
          it below to continue.
        </Text>

        <View
          style={styles.otpRow}
        >
          {otpArray.map(
            (digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  if (ref) {
                    inputs.current[
                      index
                    ] = ref;
                  }
                }}
                value={digit}
                onChangeText={text =>
                  handleChange(
                    text.slice(
                      -1
                    ),
                    index
                  )
                }
                keyboardType="number-pad"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                maxLength={1}
                selectionColor={colors.primary}
                accessibilityLabel={`Digit ${index + 1} of ${otpArray.length}`}
                style={[
                  styles.otpBox,
                  // Filled boxes get a brand-blue border so the user
                  // can see how far through the code they are.
                  digit
                    ? styles.otpBoxFilled
                    : null,
                ]}
              />
            )
          )}
        </View>

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
          onPress={handleVerify}
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
              ? "Verifying..."
              : "Verify & Continue"}
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.resendRow
          }
        >
          <Text
            style={
              styles.resendLabel
            }
          >
            Didn't receive the
            code?{" "}
          </Text>

          <Text
            style={
              timer > 0
                ? styles.resendTimer
                : styles.resendLink
            }
          >
            {timer > 0
              ? `Resend in 00:${timer
                  .toString()
                  .padStart(
                    2,
                    "0"
                  )}`
              : "Resend OTP"}
          </Text>
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
      paddingHorizontal: 16,
      paddingTop: HEADER_TOP_PADDING,
      paddingBottom: 8,
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
      marginBottom: 26,
      paddingHorizontal: 12,
    },

    otpRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 22,
    },

    otpBox: {
      width: 44,
      height: 52,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    otpBoxFilled: {
      borderWidth: 1.5,
      borderColor: colors.primary,
    },

    errorText: {
      color: colors.danger,
      fontSize: 12,
      marginBottom: 10,
    },

    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      width: "100%",
      paddingVertical: 15,
      alignItems: "center",
    },

    submitButtonLoading: {
      opacity: 0.7,
    },

    submitText: {
      color: colors.textOnPrimary,
      fontWeight: "700",
      fontSize: 13,
      letterSpacing: 0.5,
    },

    resendRow: {
      flexDirection: "row",
      marginTop: 18,
    },

    resendLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },

    resendTimer: {
      fontSize: 12,
      color: colors.textMuted,
    },

    resendLink: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },
  });