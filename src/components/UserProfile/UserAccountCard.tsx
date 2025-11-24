//UserAccountCard.tsx
import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; 

export default function UserAccountCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!password) {
        setError("Le mot de passe est requis");
        setLoading(false); // ← AJOUTÉ
        return;
      }

      if (confirmText !== "DEACTIVATE") {
        setError('Veuillez taper "DEACTIVATE" pour confirmer');
        setLoading(false); // ← AJOUTÉ
        return;
      }

      const response = await axios.delete(`${API_URL}/api/profile`, { // ← MODIFIÉ
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: { password }
      });

      if (response.data.success) {
        // Supprimer le token et rediriger vers la page de connexion
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (err: any) { // ← TypeScript
      setError(err.response?.data?.message || "Erreur lors de la désactivation");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setPassword("");
    setConfirmText("");
    setError(null);
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-red-200 rounded-2xl dark:border-red-800/50 lg:p-6 bg-red-50/50 dark:bg-red-900/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-red-800 dark:text-red-400 lg:mb-3">
              Danger Zone
            </h4>
            <p className="text-sm text-red-600 dark:text-red-400/80 mb-3">
              Once you deactivate your account, there is no going back. Please be certain.
            </p>
            <ul className="text-xs text-red-600 dark:text-red-400/70 space-y-1">
              <li>• All your personal data will be removed</li>
              <li>• You will lose access to all services</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300 lg:inline-flex lg:w-auto"
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11.25 4.5V3.75C11.25 2.92157 10.5784 2.25 9.75 2.25H8.25C7.42157 2.25 6.75 2.92157 6.75 3.75V4.5M3 4.5H15M13.5 4.5V13.5C13.5 14.3284 12.8284 15 12 15H6C5.17157 15 4.5 14.3284 4.5 13.5V4.5M7.5 8.25V11.25M10.5 8.25V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Deactivate Account
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleModalClose} className="max-w-[500px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/30">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Deactivate Account
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action is permanent
                </p>
              </div>
            </div>
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-2">
                ⚠️ Warning: This action cannot be undone!
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Your account and all associated data will be permanently deleted. You will not be able to recover your account.
              </p>
            </div>
          </div>

          {error && (
            <div className="mx-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-y-5">
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter your password to confirm
                  </p>
                </div>

                <div>
                  <Label>Type "DEACTIVATE" to confirm</Label>
                  <Input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DEACTIVATE"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Type exactly "DEACTIVATE" in capital letters
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                    What happens when you deactivate:
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>✓ Your profile will be immediately removed</li>
                    <li>✓ All your data will be deleted permanently</li>
                    <li>✓ You will be logged out from all devices</li>
                    <li>✓ This email address will become available for reuse</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleModalClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDeactivate}
                disabled={loading || confirmText !== "DEACTIVATE"}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                {loading ? "Deactivating..." : "Deactivate Account"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}