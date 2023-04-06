import type { UseModalResult } from "~/models/modal";
import { useModalStore } from "~/store/modal";

export const useModal = (name: string): UseModalResult => {
  const isOpen = useModalStore((state) => state.modals[name]?.isOpen || false);
  const openModal = useModalStore((state) => () => state.openModal(name));
  const closeModal = useModalStore((state) => () => state.closeModal(name));

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
