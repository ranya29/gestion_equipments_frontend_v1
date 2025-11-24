//src/pages/UserProfiles.tsx
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserPasswordCard from "../components/UserProfile/UserPasswordCard";
import UserEmailCard from "../components/UserProfile/UserEmailCard";
import UserAccountCard from "../components/UserProfile/UserAccountCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Profile Dashboard | User Settings"
        description="Manage your profile and account settings"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile Settings
        </h3>
        <div className="space-y-6">
          {/* Personal Information */}
          <UserInfoCard />
          
          {/* Security Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
              Security Settings
            </h4>
            <div className="space-y-6">
              <UserPasswordCard />
              <UserEmailCard />
            </div>
          </div>

          {/* Account Management */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
              Danger Zone
            </h4>
            <UserAccountCard />
          </div>
        </div>
      </div>
    </>
  );
}