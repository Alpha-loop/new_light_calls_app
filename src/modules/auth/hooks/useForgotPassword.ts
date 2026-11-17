import { useState } from "react";

import { forgotPassword } from "../services/auth.service";

import { useChurchStore } from "../../../store/churchStore";

export default function useForgotPassword() {
  const tenantId = useChurchStore(state => state.tenantId);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    const trimmed = email.trim();

    if (!trimmed) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await forgotPassword({
        email: trimmed,
        tenantId,
      });

      // This backend can answer 200 with status:false.
      if (res?.status === false) {
        setError(
          res?.message || "Unable to send reset link"
        );
        return;
      }

      setSent(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to process request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    error,
    setError,
    sent,
    handleResetPassword,
  };
}
