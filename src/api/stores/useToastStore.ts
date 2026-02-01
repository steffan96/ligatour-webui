import { create } from 'zustand';

interface ToastInfo {
  message: string;
  isSuccess: boolean;
}

interface ToastStore {
  toast: ToastInfo | null;
  showToast: (message: string, isSuccess: boolean) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (message, isSuccess) => {
    set({ toast: { message, isSuccess } });
    
    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },
  hideToast: () => set({ toast: null }),
}));
