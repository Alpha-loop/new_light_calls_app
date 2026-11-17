import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  ArrowRight,
} from "lucide-react-native";

import useLogin from "@/modules/auth/hooks/useLogin";

import { useAuthStore } from "@/store/authStore";

import { useChurchStore } from "@/store/churchStore";

import {
  authenticateAndGetCredentials,
  confirmBiometric,
  enableBiometric,
  isBiometricAvailable,
  isBiometricEnabled,
  markPromptDismissed,
  shouldOfferBiometric,
} from "@/utils/biometric";
import { useTheme } from "@/theme/ThemeContext";
import type { ColorTokens } from "@/theme/colors";

// TODO: replace with the church's real policy pages.
const PRIVACY_URL = "https://foursquarevgc.org/privacy";
const TERMS_URL = "https://foursquarevgc.org/terms";

export default function ModernLoginScreen({
  navigation,
}: any) {
  // Theme colours. Adjust this line if your useTheme() returns
  // the tokens under a different name.
  const { colors } = useTheme();

  // Rebuilt only when the theme changes (light <-> dark).
  const styles = useMemo(
    () => makeStyles(colors),
    [colors]
  );

  const {
    loading,
    handleLogin,
  } = useLogin();

  const enterGuestMode = useAuthStore(
    state => state.enterGuestMode
  );

  const fullProfile = useChurchStore(
    state => state.fullProfile
  );

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [bioReady, setBioReady] =
    useState(false);

  useEffect(() => {
    (async () => {
      setBioReady(
        (await isBiometricAvailable()) &&
          (await isBiometricEnabled())
      );
    })();
  }, []);

  const offerBiometric = (
    username: string,
    pass: string
  ) =>
    new Promise<void>(async resolve => {
      if (!(await shouldOfferBiometric())) {
        return resolve();
      }

      Alert.alert(
        "Biometric Login",
        "Would you like to use Face ID / Fingerprint to access LightCalls on this device?",
        [
          {
            text: "Not Now",
            style: "cancel",
            onPress: async () => {
              await markPromptDismissed();
              resolve();
            },
          },
          {
            text: "Enable Biometric Login",
            onPress: async () => {
              try {
                if (!(await confirmBiometric())) return resolve();
                await enableBiometric(username, pass);
                setBioReady(true);
              } catch {}
              resolve();
            },
          },
        ],
        { cancelable: false }
      );
    });

  const onBiometricLogin = async () => {
    try {
      setError("");
      const creds =
        await authenticateAndGetCredentials();
      if (!creds) return;
      await handleLogin(
        creds.username,
        creds.password
      );
      navigation.replace("Main");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Biometric login failed. Please sign in with your password."
      );
    }
  };

  const onSubmit = async () => {
    try {
      setError("");

      await handleLogin(
        email,
        password
      );

      await offerBiometric(
        email,
        password
      );

      navigation.replace(
        "Main"
      );
    } catch (err: any) {
      setError(
        err?.response?.data
          ?.message ||
          "Login failed"
      );
    }
  };

  const onContinueAsGuest = () => {
    enterGuestMode();

    // Same reasoning as useRequireAuth.ts's goToLogin — entering
    // guest mode is a state update, and AppNavigator only
    // registers "Main" once canAccessMain (accessToken || isGuest)
    // actually recomputes as true on the next render. Deferring
    // one tick lets that happen before navigating, rather than
    // firing the reset against a navigator that hasn't registered
    // "Main" yet. reset() (not navigate()) so there's nothing to
    // go "back" to on the auth stack afterward — a guest landing
    // on Main shouldn't be able to swipe/back into Login.
    setTimeout(() => {
      navigation.reset({
        index: 0,

        routes: [
          { name: "Main" },
        ],
      });
    }, 0);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
      >
        <View
          style={styles.card}
        >
          <View
            style={
              styles.iconWrap
            }
          >
            <Image
              cachePolicy="memory-disk"
              // Local bundled asset instead of fullProfile.logoUrl
              // — this is a dedicated single-church build, so the
              // logo is guaranteed to be there and loads instantly
              // with no network dependency, unlike a remote fetch.
              // Adjust this filename if yours differs from
              // "logo.png" in the project's assets/ folder.
              source={require("../../../assets/logo-full.png")}
              contentFit="contain"
              style={
                styles.logoImage
              }
            />
          </View>

          <Text style={styles.churchName}>
            FOURSQUARE GOSPEL CHURCH, VGC
          </Text>

          <Text style={styles.welcome}>
            Welcome to LightCalls
          </Text>

          {/* Short Dove Yellow bar: the one brand-accent touch on this screen */}
          <View style={styles.accentBar} />

          <Text style={styles.subtitle}>
            Stay connected. Grow in Christ. Shine His light.
          </Text>

          <View
            style={
              styles.inputWrap
            }
          >
            <Mail
              size={16}
              color={colors.textMuted}
            />

            <TextInput
              value={email}
              onChangeText={
                setEmail
              }
              placeholder="Email Address"
              autoComplete="username"
              textContentType="username"
              importantForAutofill="yes"
              autoCorrect={false}
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              autoCapitalize="none"
              keyboardType="email-address"
              style={
                styles.input
              }
            />
          </View>

          <View
            style={
              styles.inputWrap
            }
          >
            <Lock
              size={16}
              color={colors.textMuted}
            />

            <TextInput
              value={password}
              onChangeText={
                setPassword
              }
              placeholder="Password"
              autoComplete="password"
              textContentType="password"
              importantForAutofill="yes"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              secureTextEntry={
                !showPassword
              }
              style={
                styles.input
              }
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(
                  prev => !prev
                )
              }
              hitSlop={14}
            >
              {showPassword ? (
                <EyeOff
                  size={16}
                  color={colors.textMuted}
                />
              ) : (
                <Eye
                  size={16}
                  color={colors.textMuted}
                />
              )}
            </TouchableOpacity>
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
            onPress={() =>
              navigation.navigate(
                "ForgotPassword"
              )
            }
            style={
              styles.forgotWrap
            }
          >
            <Text
              style={
                styles.forgotText
              }
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onSubmit}
            disabled={loading}
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
                ? "Signing In..."
                : "Sign In"}
            </Text>

            {!loading ? (
              <ArrowRight
                size={16}
                color={colors.textOnPrimary}
              />
            ) : null}
          </TouchableOpacity>

          {bioReady ? (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onBiometricLogin}
                style={styles.biometricButton}
              >
                <Fingerprint
                  size={18}
                  color={colors.onPrimaryMuted}
                />
                <Text style={styles.biometricText}>
                  Biometric Login
                </Text>
              </TouchableOpacity>
            </>
          ) : null}

          <View
            style={
              styles.footer
            }
          >
            <Text
              style={
                styles.footerText
              }
            >
              Don't have an
              account?{" "}
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Register"
                )
              }
            >
              <Text
                style={
                  styles.footerLink
                }
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              onContinueAsGuest
            }
            style={
              styles.guestWrap
            }
          >
            <Text
              style={
                styles.guestText
              }
            >
              Continue as Guest
            </Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            By continuing you agree to our{" "}
            <Text
              style={styles.legalLink}
              onPress={() => Linking.openURL(PRIVACY_URL)}
            >
              Privacy Policy
            </Text>{" "}
            &{" "}
            <Text
              style={styles.legalLink}
              onPress={() => Linking.openURL(TERMS_URL)}
            >
              Terms of Use
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles are a function of the theme, so they can't live in a
// plain module-level StyleSheet.create (there's no `colors` there).
const makeStyles = (colors: ColorTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scroll: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 24,
      alignItems: "center",
    },

    iconWrap: {
      width: 84,
      height: 84,
      borderRadius: 20,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
      overflow: "hidden",
    },

    logoImage: {
      width: "100%",
      height: "100%",
    },

    churchName: {
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.6,
      textAlign: "center",
      color: colors.primary,
    },

    welcome: {
      fontSize: 28,
      fontWeight: "800",
      textAlign: "center",
      color: colors.textPrimary,
      marginTop: 10,
    },

    accentBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accent,
      marginTop: 10,
    },

    subtitle: {
      fontStyle: "italic",
      textAlign: "center",
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 10,
      marginBottom: 22,
    },

    inputWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      width: "100%",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 48,
      marginBottom: 12,
    },

    input: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
    },

    errorText: {
      color: colors.danger,
      fontSize: 12,
      alignSelf: "flex-start",
      marginBottom: 8,
    },

    forgotWrap: {
      alignSelf: "flex-end",
      marginBottom: 18,
    },

    forgotText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.primary,
    },

    submitButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 24,
      width: "100%",
      paddingVertical: 14,
    },

    submitButtonLoading: {
      opacity: 0.7,
    },

    submitText: {
      color: colors.textOnPrimary,
      fontWeight: "700",
      fontSize: 14,
    },

    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      width: "100%",
      marginVertical: 18,
    },

    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.divider,
    },

    dividerText: {
      fontSize: 12,
      color: colors.textMuted,
    },

    biometricButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primaryMuted,
      borderRadius: 24,
      width: "100%",
      paddingVertical: 13,
    },

    biometricText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.onPrimaryMuted,
    },

    footer: {
      flexDirection: "row",
      marginTop: 20,
    },

    footerText: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    footerLink: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primary,
    },

    legal: {
      marginTop: 22,
      fontSize: 11,
      textAlign: "center",
      color: colors.textMuted,
    },

    legalLink: {
      fontWeight: "700",
      textDecorationLine: "underline",
      color: colors.textSecondary,
    },

    guestWrap: {
      marginTop: 18,
      alignItems: "center",
      paddingVertical: 8, // larger tap target
    },

    guestText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      textDecorationLine: "underline",
    },
  });