import React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import InviteCard from "@/components/ui/InviteCard";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import { TrainerProfile } from "./AdminDashboard.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

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
    tr.profiles.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tr.profiles.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <Card 
              key={tr.id} 
              variant="interactive"
              padding="sm"
              className="flex justify-between items-center group"
            >
              <div className="min-w-0 flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white group-hover:text-brand-primary transition-colors truncate">
                    {tr.profiles.full_name || tr.profiles.email}
                  </h3>
                  {!tr.is_approved && (
                    <span className="bg-status-warning/20 text-status-warning text-xs px-2 py-0.5 rounded-full uppercase font-bold shrink-0">
                      {t("pending")}
                    </span>
                  )}
                  {!tr.is_active && (
                    <span className="bg-status-error/20 text-status-error text-xs px-2 py-0.5 rounded-full uppercase font-bold shrink-0">
                      {t("revoked")}
                    </span>
                  )}
                </div>
                <div className="flex flex-col mt-1">
                  {tr.profiles.full_name && (
                    <Text size="xs" variant="subtle" className="lowercase truncate">
                      {tr.profiles.email}
                    </Text>
                  )}
                  <Text size="xs" variant="subtle" weight="bold" uppercase tracking="wide" className="mt-1">
                    Trainer ID: {tr.id.slice(0, 8)}
                  </Text>
                </div>
              </div>
              <div className="flex gap-1">
                {!tr.is_approved && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onApprove(tr.user_id)} 
                    disabled={actionLoading} 
                    className="text-status-success hover:bg-status-success/10"
                    title={t("approve")}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </Button>
                )}
                {tr.is_active && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRevoke(tr.user_id)} 
                    disabled={actionLoading} 
                    className="text-status-error hover:bg-status-error/10"
                    title={t("revoke")}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
          {trainers.length === 0 && <EmptyState message={t("no_trainers")} />}
        </div>
      </div>
    </div>
  );
}
