import { useState, useEffect } from "react";

export interface Role {
  _id?: string;
  name: string;
  permissions: string[];
}

export interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Role) => void;
  role: Role | null;
}

const AVAILABLE_PERMISSIONS: string[] = [
  "manage_users",
  "manage_roles",
  "view_dashboard",
  "edit_profile",
];

const RoleModal = ({ isOpen, onClose, onSubmit, role }: RoleModalProps) => {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissions(role.permissions);
    } else {
      setName("");
      setPermissions([]);
    }
  }, [role]);

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      _id: role?._id,
      name,
      permissions,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[450px] p-5 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {role ? "Modifier le rôle" : "Créer un rôle"}
        </h2>

        {/* Role name */}
        <label className="block mb-2 font-medium">Nom du rôle</label>
        <input
          type="text"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Permissions */}
        <label className="block mb-2 font-medium">Permissions</label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_PERMISSIONS.map((perm) => (
            <label key={perm} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissions.includes(perm)}
                onChange={() => togglePermission(perm)}
              />
              {perm}
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            {role ? "Sauvegarder" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
