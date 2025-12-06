import { useState, useEffect } from "react";

export interface Role {
  _id?: string;
  name: string;
  permissions: string[];
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Role) => Promise<void> | void;
  role: Role | null;
}

const ALL_PERMISSIONS = [
  "manage_users",
  "manage_roles",
  "view_dashboard",
  "edit_project",
  "delete_project",
];

const RoleModal = ({ isOpen, onClose, onSubmit, role }: RoleModalProps) => {
  const [name, setName] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissions(role.permissions || []);
    } else {
      setName("");
      setPermissions([]);
    }
  }, [role]);

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions((old) => old.filter((p) => p !== perm));
    } else {
      setPermissions((old) => [...old, perm]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="modal">
        <h2 className="title">{role ? "Modifier Rôle" : "Créer Rôle"}</h2>

        <input
          className="input"
          placeholder="Nom du rôle"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <h3>Permissions :</h3>

        <div className="grid grid-cols-2 gap-2">
          {ALL_PERMISSIONS.map((perm) => (
            <label key={perm} className="flex gap-2">
              <input
                type="checkbox"
                checked={permissions.includes(perm)}
                onChange={() => togglePermission(perm)}
              />
              {perm}
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>

          <button
            className="btn-primary"
            onClick={() => onSubmit({ name, permissions })}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
