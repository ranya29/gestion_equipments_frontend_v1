// Importation du hook useState pour gérer l'état local du composant
import { useState } from "react";

// Importation de Link (pour la navigation déclarative) et useNavigate (pour la navigation programmatique) depuis react-router
import { Link, useNavigate } from "react-router";

// Importation des icônes personnalisées pour la navigation et l'affichage du mot de passe
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";

// Importation des composants de formulaire personnalisés
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

// Importation de react-hook-form pour la gestion des formulaires (importé mais non utilisé ici)
import { useForm, Controller } from "react-hook-form";

// Importation de react-toastify pour afficher des notifications toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importation d'axios pour effectuer des requêtes HTTP
import axios from "axios";

// Déclaration et export du composant SignInForm
export default function SignInForm() {
  // État pour contrôler la visibilité du mot de passe (texte ou masqué)
  const [showPassword, setShowPassword] = useState(false);
  
  // État pour stocker la valeur de l'email saisi par l'utilisateur
  const [email, setEmail] = useState("");
  
  // État pour stocker la valeur du mot de passe saisi
  const [password, setPassword] = useState("");
  
  // État pour stocker le message d'erreur lié à l'email
  const [errorMail, setErrorMail] = useState("");
  
  // État pour stocker le message d'erreur lié au mot de passe
  const [errorPassword, setErrorPassword] = useState("");
  
  // Hook pour la navigation programmatique (redirection après connexion)
  const navigate = useNavigate();

  // Expression régulière pour valider le format d'un email
  // Vérifie la présence de caractères avant @, après @, et après le point
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Fonction asynchrone déclenchée lors de la soumission du formulaire
  const onFinish = async () => {
    try {
      // Variable pour suivre s'il y a des erreurs de validation
      let hasError = false;
      
      // Vérification si l'email est vide (après suppression des espaces)
      if (email.trim().length === 0) {
        // Définir le message d'erreur pour l'email
        setErrorMail("Email requis");
        hasError = true;
      }
      
      // Vérification si l'email existe et s'il correspond au format valide
      if (email && !emailRegex.test(email)) {
        // Définir le message d'erreur si le format est invalide
        setErrorMail("Email invalide");
        hasError = true;
      }
      
      // Vérification si le mot de passe est vide
      if (password.trim().length === 0) {
        // Définir le message d'erreur pour le mot de passe
        setErrorPassword("Password requis");
        hasError = true;
      }
      
      // Si des erreurs de validation existent, arrêter l'exécution
      if (hasError) {
        return;
      }
      
      // Envoi d'une requête POST à l'API de connexion avec les identifiants
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email: email,
        password: password,
      });
      
      // Affichage de la réponse du serveur dans la console (pour débogage)
      console.log(res?.data);
      
      // Affichage d'une notification de succès à l'utilisateur
      toast.success("Vous avez connecté avec succées.");
      
      // Stockage du token JWT dans le localStorage du navigateur
      // Ce token sera utilisé pour authentifier les futures requêtes
      localStorage.setItem("token", res.data.token);
      
      // Redirection vers la page d'accueil après connexion réussie
      navigate("/");
      
    } catch (error) {
      // En cas d'erreur (mauvais identifiants, problème serveur, etc.)
      // Affichage du message d'erreur renvoyé par le serveur dans une notification toast
      toast.error(error?.response?.data?.message);
      
      // Affichage du message d'erreur dans la console pour débogage
      console.log(error?.response?.data?.message);
    }
  };
  
  // Rendu JSX du composant
  return (
    // Conteneur principal avec flex column et flex-1 pour occuper l'espace disponible
    <div className="flex flex-col flex-1">
      {/* Conteneur centré avec largeur maximale pour le formulaire */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {/* Section titre et description */}
          <div className="mb-5 sm:mb-8">
            {/* Titre principal du formulaire */}
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Se connecter
            </h1>
            {/* Description sous le titre */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez votre email et mot de passe pour vous connecter!
            </p>
          </div>
          
          <div>
            {/* Section boutons de connexion sociale (Google et X/Twitter) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              {/* Bouton de connexion avec Google */}
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                {/* Logo Google en SVG */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Chemins SVG pour le logo Google avec les couleurs officielles */}
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign in with Google
              </button>
              
              {/* Bouton de connexion avec X (anciennement Twitter) */}
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                {/* Logo X en SVG */}
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                Sign in with X
              </button>
            </div>
            
            {/* Séparateur visuel "Or" entre connexion sociale et formulaire classique */}
            <div className="relative py-3 sm:py-5">
              {/* Ligne horizontale de séparation */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              {/* Texte "Or" centré sur la ligne */}
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            
            {/* Formulaire de connexion classique */}
            <div className="space-y-6">
              {/* Champ Email */}
              <div>
                {/* Label avec astérisque rouge pour indiquer un champ obligatoire */}
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                {/* Input pour l'email */}
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  // Gestionnaire onChange pour mettre à jour l'état email
                  // et effacer les erreurs lorsque l'utilisateur tape
                  onChange={(e) => {
                    console.log(e.target.value); // Log pour débogage
                    setErrorMail(""); // Réinitialiser le message d'erreur
                    setEmail(e?.target?.value); // Mettre à jour l'état email
                  }}
                />
                {/* Affichage du message d'erreur pour l'email (si présent) */}
                <span className="text-red-500 text-sm mt-1">{errorMail}</span>
              </div>
              
              {/* Champ Mot de passe */}
              <div>
                {/* Label avec astérisque rouge */}
                <Label>
                  Mot de passe <span className="text-error-500">*</span>
                </Label>
                {/* Conteneur relatif pour positionner l'icône de visibilité */}
                <div className="relative">
                  {/* Input pour le mot de passe avec type dynamique (text/password) */}
                  <Input
                    placeholder="Enter your password"
                    // Type change selon l'état showPassword
                    type={showPassword ? "text" : "password"}
                    // Gestionnaire onChange pour mettre à jour l'état password
                    onChange={(e) => {
                      console.log(e.target.value); // Log pour débogage
                      setErrorPassword(""); // Réinitialiser le message d'erreur
                      setPassword(e?.target?.value); // Mettre à jour l'état password
                    }}
                  />
                  {/* Affichage du message d'erreur pour le mot de passe */}
                  <span className="text-red-500 text-sm mt-1">
                    {errorPassword}
                  </span>
                  {/* Icône cliquable pour afficher/masquer le mot de passe */}
                  {/* Positionnée absolument à droite du champ */}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {/* Affichage conditionnel de l'icône selon showPassword */}
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              
              {/* Section lien "Mot de passe oublié" */}
              <div className="flex items-center justify-between">
                {/* Lien vers la page de réinitialisation du mot de passe */}
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              
              {/* Bouton de soumission du formulaire */}
              <div>
                <Button 
                  className="w-full" 
                  size="sm" 
                  // Appel de la fonction onFinish lors du clic
                  onClick={onFinish}
                >
                  Se connecter
                </Button>
              </div>
            </div>

            {/* Section lien vers la page d'inscription */}
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Vous n'avez pas de compte ?{""}
                {/* Lien vers la page d'inscription */}
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