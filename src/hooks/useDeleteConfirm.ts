'use client';

import { useState } from 'react';

export function useDeleteConfirm(onDelete: (id: string) => Promise<void>) {
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openModal = (id: string) => setConfirmModal({ isOpen: true, id });
  const closeModal = () => setConfirmModal({ isOpen: false, id: null });

  const handleDelete = async () => {
    if (!confirmModal.id) return;
    const id = confirmModal.id;
    setDeletingId(id);
    await onDelete(id);
    setConfirmModal({ isOpen: false, id: null });
    setDeletingId(null);
  };

  return { confirmModal, openModal, closeModal, handleDelete, deletingId };
}
