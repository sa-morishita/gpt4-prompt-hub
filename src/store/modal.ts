import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ModalStore } from "~/models/modal";

export const useModalStore = create<ModalStore>()(
  devtools((set) => ({
    modals: {},
    openModal: (name: string) =>
      set((state) => ({
        modals: { ...state.modals, [name]: { isOpen: true } },
      })),
    closeModal: (name: string) =>
      set((state) => ({
        modals: { ...state.modals, [name]: { isOpen: false } },
      })),
  }))
);
