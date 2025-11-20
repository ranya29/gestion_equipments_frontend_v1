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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome to your Dashboard
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          This is your main dashboard. You can add your own widgets or components here.
        </p>

        {/* Ici tu peux ajouter tes propres composants ou sections du dashboard */}
      </div>
    </>
  );
};

export default Home;
