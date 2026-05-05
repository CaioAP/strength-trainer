"use client";

import { useState } from "react";

interface ConfirmModalState {
  isOpen: boolean;
  id: string | null;
}

interface UseDeleteConfirmReturn {
  confirmModal: ConfirmModalState;
  openModal: (_id: string) => void;
  closeModal: () => void;
  handleDelete: () => Promise<void>;
  deletingId: string | null;
}

export function useDeleteConfirm(onDelete: (_id: string) => Promise<void>): UseDeleteConfirmReturn {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    id: null,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openModal = (id: string): void => setConfirmModal({ isOpen: true, id });
  const closeModal = (): void => setConfirmModal({ isOpen: false, id: null });

  const handleDelete = async (): Promise<void> => {
    if (!confirmModal.id) return;
    const id = confirmModal.id;
    setDeletingId(id);
    await onDelete(id);
    setConfirmModal({ isOpen: false, id: null });
    setDeletingId(null);
  };

  return { confirmModal, openModal, closeModal, handleDelete, deletingId };
}
