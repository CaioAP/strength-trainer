import React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import InviteCard from "@/components/ui/InviteCard";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import { TrainerProfile } from "./AdminDashboard.types";

interface TrainersTabProps {
  trainers: TrainerProfile[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  actionLoading: boolean;
  onInvite: (email: string) => Promise<void>;
  onApprove: (userId: string) => Promise<void>;
  onRevoke: (userId: string) => Promise<void>;
}

export default function TrainersTab({
  trainers,
  searchQuery,
  setSearchQuery,
  actionLoading,
  onInvite,
  onApprove,
  onRevoke,
}: TrainersTabProps): React.JSX.Element {
  const t = useTranslations("Admin.Trainers");

  const filteredTrainers = trainers.filter((tr) => 
    tr.profiles.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <InviteCard
        title={t("invite_title")}
        placeholder={t("invite_placeholder")}
        loading={actionLoading}
        onSubmit={onInvite}
      />

      <div className="space-y-4">
        <SearchInput
          placeholder={t("search_placeholder")}
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="grid gap-3">
          {filteredTrainers.map((tr) => (
            <div 
              key={tr.id} 
              className="bg-brand-surface p-4 rounded-lg shadow-card hover:shadow-card-hover hover:scale-[1.01] flex justify-between items-center group transition-all duration-300 overflow-hidden"
            >
              <div className="min-w-0 flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white group-hover:text-brand-primary transition-colors truncate">
                    {tr.profiles.email}
                  </h3>
                  {!tr.is_approved && (
                    <span className="bg-status-warning/20 text-status-warning text-[9px] px-2 py-0.5 rounded-full uppercase font-bold shrink-0">
                      {t("pending")}
                    </span>
                  )}
                  {!tr.is_active && (
                    <span className="bg-status-error/20 text-status-error text-[9px] px-2 py-0.5 rounded-full uppercase font-bold shrink-0">
                      {t("revoked")}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-text-subtle mt-1 uppercase tracking-wider font-medium">
                  Trainer ID: {tr.id.slice(0, 8)}
                </p>
              </div>
              <div className="flex gap-1">
                {!tr.is_approved && (
                  <button 
                    onClick={() => onApprove(tr.user_id)} 
                    disabled={actionLoading} 
                    className="p-2 text-status-success hover:bg-status-success/10 rounded-md transition-all disabled:opacity-50" 
                    title={t("approve")}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
                {tr.is_active && (
                  <button 
                    onClick={() => onRevoke(tr.user_id)} 
                    disabled={actionLoading} 
                    className="p-2 text-status-error hover:bg-status-error/10 rounded-md transition-all disabled:opacity-50" 
                    title={t("revoke")}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {trainers.length === 0 && <EmptyState message={t("no_trainers")} />}
        </div>
      </div>
    </div>
  );
}
