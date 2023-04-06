import { type ReactNode } from "react";

export interface ModalState {
  isOpen: boolean;
}

export interface ModalStore {
  modals: Record<string, ModalState>;
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
}

export interface UseModalResult {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}
