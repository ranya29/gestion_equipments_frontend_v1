import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ← إضافة

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMail, setErrorMail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false); // ← إضافة
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onFinish = async () => {
    try {
      setLoading(true); // ← إضافة
      let hasError = false;
      
      if (email.trim().length === 0) {
        setErrorMail("Email requis");
        hasError = true;
      } else if (!emailRegex.test(email)) {
        setErrorMail("Email invalide");
        hasError = true;
      }
      
      if (password.trim().length === 0) {
        setErrorPassword("Password requis");
        hasError = true;
      }

      if (hasError) {
        setLoading(false); // ← إضافة
        return;
      }

      // ✅ استخدام API_URL من .env
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: email,
        password: password,
      });

      console.log('✅ Login réussi:', res?.data);
      console.log('role from back:', res.data.user.role);
      console.log('full user:', res.data.user);
      
      
      toast.success("Vous avez connecté avec succès.");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      
      
      
      // ✅ الذهاب للـ home بدلاً من "/"
      navigate("/dashboard"); 

    } catch (error: any) {
      console.error('❌ Erreur login:', error?.response?.data);
      toast.error(error?.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false); // ← إضافة
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Se connecter
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez votre email et mot de passe pour vous connecter!
            </p>
          </div>
          <div>
            {/* Boutons Google/X - garder comme avant */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              {/* ... tes boutons Google et X ... */}
            </div>

            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setErrorMail("");
                    setEmail(e?.target?.value);
                  }}
                />
                {errorMail && (
                  <span className="text-red-500 text-sm mt-1">{errorMail}</span>
                )}
              </div>

              <div>
                <Label>
                  Mot de passe <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setErrorPassword("");
                      setPassword(e?.target?.value);
                    }}
                  />
                  {errorPassword && (
                    <span className="text-red-500 text-sm mt-1">
                      {errorPassword}
                    </span>
                  )}
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

              <div className="flex items-center justify-between">
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Mot de passe oublié?
                </Link>
              </div>

              <div>
                <Button 
                  className="w-full" 
                  size="sm" 
                  onClick={onFinish}
                  disabled={loading}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Vous n'avez pas de compte ?{" "}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}