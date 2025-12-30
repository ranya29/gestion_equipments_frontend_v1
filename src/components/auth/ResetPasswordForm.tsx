import { useState } from "react";  
import { Link, useParams, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Controller, useForm, UseFormReturn, ControllerRenderProps, FieldError } from "react-hook-form";
import { API_ENDPOINTS } from "../../api";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Fixed: Using type assertion instead of generic
  const { handleSubmit, control, watch } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  }) as UseFormReturn<ResetPasswordFormData>;

  const password = watch("password");

  const onFinish = async (data: ResetPasswordFormData) => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.RESET_PASSWORD}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || "✅ Mot de passe réinitialisé avec succès !");
        setTimeout(() => navigate("/signin"), 3000);
      } else {
        setError(result.message || "Le lien de réinitialisation est invalide ou a expiré.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Impossible de se connecter au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to sign in
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password to reset your account
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
              <div className="flex items-start gap-3">
                <svg
                  className="size-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-success-800 dark:text-success-300">
                    {successMessage}
                  </p>
                  <p className="text-xs text-success-700 dark:text-success-400 mt-1">
                    Redirection vers la page de connexion dans 3 secondes...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
              <div className="flex items-start gap-3">
                <svg
                  className="size-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-error-800 dark:text-error-300">{error}</p>
              </div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit(onFinish)}>
            <div className="space-y-6">
              {/* PASSWORD */}
              <div>
                <Label>
                  New Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    }}
                    render={({ field, fieldState }: { 
                      field: ControllerRenderProps<ResetPasswordFormData, "password">;
                      fieldState: { error?: FieldError };
                    }) => (
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        error={!!fieldState.error}
                        hint={fieldState.error?.message}
                        disabled={!!successMessage}
                      />
                    )}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <Label>
                  Confirm Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: "Please confirm your password",
                      validate: (value: string) => value === password || "Passwords do not match",
                    }}
                    render={({ field, fieldState }: {
                      field: ControllerRenderProps<ResetPasswordFormData, "confirmPassword">;
                      fieldState: { error?: FieldError };
                    }) => (
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        error={!!fieldState.error}
                        hint={fieldState.error?.message}
                        disabled={!!successMessage}
                      />
                    )}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <Button className="w-full" size="sm" disabled={isLoading || !!successMessage}>
                  {isLoading ? "Resetting..." : successMessage ? "Success! Redirecting..." : "Reset Password"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Remember your password?{" "}
              <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}