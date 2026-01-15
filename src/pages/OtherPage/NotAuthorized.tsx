import React from "react";
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white">403</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Vous n'êtes pas autorisé(e) à accéder à cette page.</p>
      <div className="mt-6">
        <Link to="/" className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
