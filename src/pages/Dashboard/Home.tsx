import React from "react";
import PageMeta from "../../components/common/PageMeta";

const Home: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is the Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      <div className="p-6">
        <h1 className="text-4xl md:text-5xl font-extrabold  text-indigo-600 dark:text-white tracking-tight">
          Bienvenue 
        </h1>

      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
        Réservez vos équipements rapidement et gérez vos demandes en toute simplicité.
      </p>

    
      </div>
    </>
  );
};

export default Home;
