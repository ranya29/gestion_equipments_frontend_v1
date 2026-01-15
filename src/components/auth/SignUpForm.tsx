import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { authService } from "../../services/authService.ts";
import { useAuth } from "../../context/AuthContext";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    roleName: "user"  // 🔴 Changé de "User" à "user" (minuscule)
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.prenom || !formData.nom || !formData.email || !formData.password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        prenom: formData.prenom,
        nom: formData.nom,
        username: `${formData.prenom}.${formData.nom}`,
        email: formData.email,
        password: formData.password,
        roleName: formData.roleName
      });

      setSuccess(" Inscription réussie! Redirection...");
      
      // Ajouter l'utilisateur au contexte
      if (response.user) {
        login(response.user);
      }

      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Erreur lors de l'inscription";
        setError(message);
        console.error("Registration error:", error.response?.data);
      } else if (error instanceof Error) {
        setError(error.message || "Erreur lors de l'inscription");
        console.error("Registration error:", error.message);
      } else {
        setError("Erreur lors de l'inscription");
        console.error("Registration error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
      
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              S'inscrire

            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Saisissez votre adresse e-mail et votre mot de passe pour vous inscrire !
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
            
          
            </div>
            
            <form onSubmit={handleSignUp}>
              <div className="space-y-5">
                {error && (
                  <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 text-sm text-green-800 bg-green-100 rounded-lg">
                    {success}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Prénom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="prenom"
                      name="prenom"
                      placeholder="Entrez votre prénom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                    Nom
<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="nom"
                      name="nom"
                      placeholder="Entrez votre nom "
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Saisissez votre adresse e-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Mot de passe<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Entrez votre mot de passe"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
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
                {/* <!-- Button --> */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating account..." : "S'inscrire"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Vous avez déjà un compte ? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
