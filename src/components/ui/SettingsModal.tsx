"use client";

import { X, LogOut, User as UserIcon, Mail, Shield, ChevronRight, Loader2, HelpCircle, Bug, FileText, Languages } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { SettingsSection } from "@/components/ui/SettingsSection";

interface User {
  id: string;
  email?: string;
}

interface Profile {
  full_name: string | null;
  role: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  profile: Profile | null;
}

export default function SettingsModal({ isOpen, onClose, user, profile }: SettingsModalProps): React.JSX.Element | null {
  const t = useTranslations("Settings");
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  if (!isOpen) return null;

  async function handleLogout(): Promise<void> {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-300 flex flex-col bg-brand-secondary animate-in slide-in-from-bottom duration-300">
      {navigating && (
        <div className="absolute inset-0 z-400 flex flex-col items-center justify-center bg-brand-secondary/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
          <p className="text-text-subtle text-xs font-bold uppercase tracking-widest animate-pulse">{t("redirecting")}</p>
        </div>
      )}
      <header className="p-4 flex items-center justify-between border-b border-gray-800 bg-brand-surface">
        <h2 className="text-xl font-bold text-white">{t("title")}</h2>
        <Button 
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={navigating}
          className="p-2 rounded-full text-text-subtle hover:text-white disabled:opacity-30"
        >
          <X className="w-6 h-6" />
        </Button>
      </header>

      <div className="flex-1 p-4 space-y-8 pb-12">
        {/* Profile Section */}
        <SettingsSection title={t("account_profile")} titleVariant="primary">
          <div className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20">
              <UserIcon className="text-brand-primary w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white leading-none">{profile?.full_name || "User"}</p>
              <p className="text-xs text-text-subtle mt-1">{user?.email}</p>
            </div>
          </div>
          
          <div className="bg-white/5 divide-y divide-white/5">
            <SettingsItem 
              icon={<Mail className="w-4 h-4" />} 
              label={t("email_preferences")} 
              onClick={() => {
                setNavigating(true);
                router.push("/settings/email");
              }}
            />
            <SettingsItem 
              icon={<Shield className="w-4 h-4" />} 
              label={t("security_privacy")} 
              onClick={() => {
                setNavigating(true);
                router.push("/settings/security");
              }}
            />
          </div>
        </SettingsSection>

        {/* Role Specific Info */}
        <SettingsSection title={t("account_info")} titleVariant="primary" padding="none">
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-text-subtle font-medium">{t("access_role")}</span>
            <span className="bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded-full uppercase font-bold border border-brand-primary/20">
              {profile?.role}
            </span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-text-subtle font-medium">{t("account_id")}</span>
            <span className="text-xs text-white font-mono">{user?.id.slice(0, 12)}...</span>
          </div>
          <div className="flex justify-between items-center p-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <Languages className="w-4 h-4 text-text-subtle" />
              <span className="text-sm text-white font-medium">{t("language")}</span>
            </div>
            <div className="flex bg-brand-secondary rounded-lg p-1 border border-white/5">
              <button 
                onClick={() => {
                  const newPath = pathname.replace(/^\/(en|pt)/, "/en");
                  router.push(newPath);
                  router.refresh();
                }}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${pathname.startsWith("/en") ? "bg-brand-primary text-black" : "text-text-subtle hover:text-white"}`}
              >
                {t("languages.en")}
              </button>
              <button 
                onClick={() => {
                  const newPath = pathname.replace(/^\/(en|pt)/, "/pt");
                  router.push(newPath);
                  router.refresh();
                }}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${pathname.startsWith("/pt") ? "bg-brand-primary text-black" : "text-text-subtle hover:text-white"}`}
              >
                {t("languages.pt")}
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title={t("support")} titleVariant="primary">
           <SettingsItem 
             icon={<HelpCircle className="w-4 h-4" />} 
             label={t("help_center")} 
             onClick={() => {
               setNavigating(true);
               router.push("/settings/help");
             }}
           />
           <SettingsItem 
             icon={<Bug className="w-4 h-4" />} 
             label={t("report_bug")} 
             onClick={() => {
               setNavigating(true);
               router.push("/settings/bug");
             }}
           />
           <SettingsItem 
              icon={<FileText className="w-4 h-4" />} 
              label={t("privacy_policy")} 
              onClick={() => {
                setNavigating(true);
                router.push("/settings/privacy");
              }}
            />
        </SettingsSection>

        {/* Logout Section */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-status-error/10 border border-status-error/20 rounded-lg text-status-error font-bold uppercase text-xs tracking-widest hover:bg-status-error/20 transition-all active:scale-98"
        >
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </button>
      </div>

      <footer className="p-8 text-center bg-brand-secondary">
        <p className="text-xs text-text-subtle uppercase tracking-widest font-bold opacity-30">Strength v1.0.0</p>
      </footer>
    </div>
  );
}

interface SettingsItemProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function SettingsItem({ icon, label, onClick }: SettingsItemProps): React.JSX.Element {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-white/5 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-text-subtle group-hover:text-brand-primary transition-colors">{icon}</div>}
        <span className="text-sm text-white font-medium">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
    </div>
  );
}
