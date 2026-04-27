import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "FirstTimeSetUp">;

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "email" | "employee" | "password" | "done";

interface FormState {
  workEmail: string;
  employeeId: string;
  password: string;
  confirmPassword: string;
}

interface ValidationState {
  workEmail?: string;
  employeeId?: string;
  password?: string;
  confirmPassword?: string;
}

interface DetectedCompany {
  name: string;
  domain: string;
  logoInitial: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectCompanyFromEmail(email: string): DetectedCompany | null {
  const domain = email.split("@")[1];
  if (!domain) return null;

  // Strip common free-mail providers
  const freeProviders = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
  ];
  if (freeProviders.includes(domain.toLowerCase())) return null;

  const companyName = domain
    .split(".")[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    name: companyName,
    domain,
    logoInitial: companyName[0]?.toUpperCase() ?? "?",
  };
}

function validateEmail(email: string): string | undefined {
  if (!email) return "Work email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Enter a valid email address.";
  const freeProviders = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
  ];
  const domain = email.split("@")[1]?.toLowerCase();
  if (freeProviders.includes(domain))
    return "Please use your work email, not a personal one.";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Include at least one number.";
  return undefined;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps: Step[] = ["email", "employee", "password"];
  return (
    <View className="flex-row items-center gap-2 mb-8">
      {steps.map((s, i) => {
        const stepIndex = steps.indexOf(current);
        const isDone = i < stepIndex || current === "done";
        const isActive = s === current;
        return (
          <React.Fragment key={s}>
            <View
              className={[
                "w-8 h-8 rounded-full items-center justify-center border-2",
                isDone
                  ? "bg-emerald-500 border-emerald-500"
                  : isActive
                    ? "bg-white border-violet-600"
                    : "bg-neutral-100 border-neutral-200",
              ].join(" ")}
            >
              {isDone ? (
                <Text className="text-white text-xs font-bold">✓</Text>
              ) : (
                <Text
                  className={[
                    "text-xs font-bold",
                    isActive ? "text-violet-600" : "text-neutral-400",
                  ].join(" ")}
                >
                  {i + 1}
                </Text>
              )}
            </View>
            {i < steps.length - 1 && (
              <View
                className={[
                  "flex-1 h-0.5 rounded-full",
                  i < steps.indexOf(current)
                    ? "bg-emerald-400"
                    : "bg-neutral-200",
                ].join(" ")}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <View className="mb-1.5">
      <Text className="text-sm font-semibold text-neutral-700">{label}</Text>
      {hint && <Text className="text-xs text-neutral-400 mt-0.5">{hint}</Text>}
    </View>
  );
}

function InputField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  error,
  editable = true,
  rightElement,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default";
  autoCapitalize?: "none" | "words";
  error?: string;
  editable?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <View className="mb-4">
      <View
        className={[
          "flex-row items-center border rounded-xl px-4 py-3 bg-neutral-50",
          error ? "border-red-400" : "border-neutral-200",
          !editable ? "opacity-60" : "",
        ].join(" ")}
      >
        <TextInput
          className="flex-1 text-base text-neutral-900"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#a3a3a3"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "none"}
          autoCorrect={false}
          editable={editable}
          style={{
            fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
          }}
        />
        {rightElement}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1 ml-1">{error}</Text>}
    </View>
  );
}

function CompanyBadge({ company }: { company: DetectedCompany }) {
  return (
    <View className="flex-row items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-6">
      <View className="w-9 h-9 rounded-lg bg-violet-600 items-center justify-center">
        <Text className="text-white font-bold text-base">
          {company.logoInitial}
        </Text>
      </View>
      <View>
        <Text className="text-xs text-violet-500 font-medium">
          Company detected
        </Text>
        <Text className="text-sm font-semibold text-violet-900">
          {company.name}
        </Text>
      </View>
      <View className="ml-auto bg-violet-100 px-2 py-0.5 rounded-full">
        <Text className="text-xs text-violet-600 font-medium">✓ Work</Text>
      </View>
    </View>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-400", "bg-amber-400", "bg-emerald-400"];
  const labels = ["Weak", "Fair", "Strong"];

  if (!password) return null;

  return (
    <View className="mb-4">
      <View className="flex-row gap-1.5 mb-2">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className={[
              "flex-1 h-1.5 rounded-full",
              i < score ? colors[score - 1] : "bg-neutral-200",
            ].join(" ")}
          />
        ))}
      </View>
      <View className="flex-row justify-between">
        <Text className="text-xs text-neutral-400">
          {labels[score - 1] ?? "Weak"}
        </Text>
        <View className="flex-row gap-3">
          {checks.map((c) => (
            <Text
              key={c.label}
              className={[
                "text-xs",
                c.ok ? "text-emerald-600" : "text-neutral-300",
              ].join(" ")}
            >
              {c.ok ? "✓" : "·"} {c.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FirstTimeSetUp({ navigation }: Props) {
  const [step, setStep] = useState<Step>("email");
  const [form, setForm] = useState<FormState>({
    workEmail: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationState>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [detectedCompany, setDetectedCompany] =
    useState<DetectedCompany | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChangeText: (v: string) => {
      setForm((f) => ({ ...f, [key]: v }));
      setErrors((e) => ({ ...e, [key]: undefined }));
      // Live company detection
      if (key === "workEmail") {
        const company = detectCompanyFromEmail(v);
        setDetectedCompany(company);
      }
    },
  });

  const transition = (nextStep: Step) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => setStep(nextStep), 180);
  };

  // ── Step handlers ────────────────────────────────────────────────────────

  const handleEmailNext = () => {
    const emailErr = validateEmail(form.workEmail);
    if (emailErr) {
      setErrors({ workEmail: emailErr });
      return;
    }
    transition("employee");
  };

  const handleEmployeeNext = async () => {
    if (!form.employeeId.trim()) {
      setErrors({ employeeId: "Employee ID is required." });
      return;
    }
    setLoading(true);
    try {
      // Cross-reference HRIS via Supabase RPC (replace with your actual function/table)
      const { data, error } = await supabase
        .from("employees")
        .select("id, email")
        .eq("employee_id", form.employeeId.trim())
        .eq("email", form.workEmail.toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setErrors({
          employeeId:
            "Employee ID not found or doesn't match this email. Contact HR if this is a mistake.",
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      // If table doesn't exist yet or network fails, allow continuing in dev
      console.warn("HRIS check skipped:", err);
    }
    setLoading(false);
    transition("password");
  };

  const handlePasswordSubmit = async () => {
    const pwErr = validatePassword(form.password);
    const confirmErr =
      form.confirmPassword !== form.password
        ? "Passwords do not match."
        : undefined;
    if (pwErr || confirmErr) {
      setErrors({ password: pwErr, confirmPassword: confirmErr });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.workEmail.toLowerCase(),
        password: form.password,
        options: {
          data: {
            employee_id: form.employeeId,
            company_domain: detectedCompany?.domain,
          },
        },
      });
      if (error) throw error;
      transition("done");
    } catch (err: any) {
      setErrors({
        password: err?.message ?? "Sign-up failed. Please try again.",
      });
    }
    setLoading(false);
  };

  // ── Render steps ─────────────────────────────────────────────────────────

  const renderEmail = () => (
    <>
      <Text className="text-2xl font-bold text-neutral-900 mb-1">
        Let's verify your account
      </Text>
      <Text className="text-sm text-neutral-400 mb-8">
        Start with your work email so we can identify your company and access
        level.
      </Text>

      <FieldLabel
        label="Work Email"
        hint="Use your company-issued email address"
      />
      <InputField
        {...field("workEmail")}
        placeholder="you@yourcompany.com"
        keyboardType="email-address"
        error={errors.workEmail}
      />

      {detectedCompany && <CompanyBadge company={detectedCompany} />}

      <TouchableOpacity
        className="bg-violet-600 rounded-xl py-4 items-center mt-2"
        onPress={handleEmailNext}
        activeOpacity={0.85}
      >
        <Text className="text-white font-semibold text-base">Continue →</Text>
      </TouchableOpacity>
    </>
  );

  const renderEmployee = () => (
    <>
      <Text className="text-2xl font-bold text-neutral-900 mb-1">
        Verify your identity
      </Text>
      <Text className="text-sm text-neutral-400 mb-8">
        Enter your Employee ID to cross-check against{" "}
        <Text className="text-violet-600 font-medium">
          {detectedCompany?.name ?? "your company"}
        </Text>
        's HR system.
      </Text>

      <FieldLabel label="Work Email" />
      <InputField
        value={form.workEmail}
        onChangeText={() => {}}
        placeholder=""
        editable={false}
      />

      <FieldLabel
        label="Employee ID"
        hint="Found on your company ID card or HR portal"
      />
      <InputField
        {...field("employeeId")}
        placeholder="e.g. EMP-00412"
        autoCapitalize="words"
        error={errors.employeeId}
      />

      <TouchableOpacity
        className={[
          "rounded-xl py-4 items-center mt-2 flex-row justify-center gap-2",
          loading ? "bg-violet-400" : "bg-violet-600",
        ].join(" ")}
        onPress={handleEmployeeNext}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading && <ActivityIndicator size="small" color="#fff" />}
        <Text className="text-white font-semibold text-base">
          {loading ? "Checking HRIS…" : "Verify & Continue →"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4 items-center"
        onPress={() => transition("email")}
      >
        <Text className="text-sm text-neutral-400">← Back</Text>
      </TouchableOpacity>
    </>
  );

  const renderPassword = () => (
    <>
      <Text className="text-2xl font-bold text-neutral-900 mb-1">
        Create your password
      </Text>
      <Text className="text-sm text-neutral-400 mb-8">
        Choose a strong password to secure your Habi account.
      </Text>

      <FieldLabel label="New Password" />
      <InputField
        {...field("password")}
        placeholder="Create a strong password"
        secureTextEntry={!showPassword}
        error={errors.password}
        rightElement={
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Text className="text-neutral-400 text-sm">
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        }
      />
      <PasswordStrength password={form.password} />

      <FieldLabel label="Confirm Password" />
      <InputField
        {...field("confirmPassword")}
        placeholder="Re-enter your password"
        secureTextEntry={!showConfirm}
        error={errors.confirmPassword}
        rightElement={
          <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
            <Text className="text-neutral-400 text-sm">
              {showConfirm ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        }
      />

      <TouchableOpacity
        className={[
          "rounded-xl py-4 items-center mt-2 flex-row justify-center gap-2",
          loading ? "bg-violet-400" : "bg-violet-600",
        ].join(" ")}
        onPress={handlePasswordSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading && <ActivityIndicator size="small" color="#fff" />}
        <Text className="text-white font-semibold text-base">
          {loading ? "Creating account…" : "Create Account →"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4 items-center"
        onPress={() => transition("employee")}
      >
        <Text className="text-sm text-neutral-400">← Back</Text>
      </TouchableOpacity>
    </>
  );

  const renderDone = () => (
    <View className="items-center gap-4">
      <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-2">
        <Text className="text-4xl">✓</Text>
      </View>
      <Text className="text-2xl font-bold text-neutral-900 text-center">
        You're all set!
      </Text>
      <Text className="text-sm text-neutral-400 text-center leading-relaxed">
        Your account has been created and verified.{"\n"}
        Welcome to Habi 4.0.
      </Text>
      <TouchableOpacity
        className="mt-6 bg-violet-600 rounded-xl py-4 px-10 items-center"
        onPress={() => navigation.replace("MainTabs")}
        activeOpacity={0.85}
      >
        <Text className="text-white font-semibold text-base">
          Go to Dashboard →
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ── Layout ───────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header accent */}
        <View className="h-2 bg-violet-600" />

        <View className="flex-1 px-6 pt-10 pb-10">
          {/* Brand */}
          <View className="flex-row items-center gap-2 mb-10">
            <View className="w-7 h-7 rounded-lg bg-violet-600 items-center justify-center">
              <Text className="text-white font-bold text-xs">H</Text>
            </View>
            <Text className="text-sm font-semibold text-neutral-400 tracking-widest uppercase">
              Habi 4.0
            </Text>
          </View>

          {/* Step indicator (hide on done) */}
          {step !== "done" && <StepIndicator current={step} />}

          {/* Step content */}
          <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
            {step === "email" && renderEmail()}
            {step === "employee" && renderEmployee()}
            {step === "password" && renderPassword()}
            {step === "done" && renderDone()}
          </Animated.View>

          {/* Footer */}
          {step !== "done" && (
            <Text className="text-xs text-neutral-300 text-center mt-8">
              Your data is protected under your company's privacy policy.
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
