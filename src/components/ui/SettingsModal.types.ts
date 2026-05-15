export interface SettingsModalUser {
  id: string;
  email?: string;
}

export interface SettingsModalProfile {
  full_name: string | null;
  role: string;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SettingsModalUser | null;
  profile: SettingsModalProfile | null;
}
