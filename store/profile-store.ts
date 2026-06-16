import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileFormValues } from "@/types/profile.api";

type ProfileState = {
  userId: string | null;
  profile: ProfileFormValues | null;
  setProfile: (userId: string, profile: ProfileFormValues) => void;
  clearProfile: () => void;
};

const emptyProfile: ProfileFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  nationalId: "",
  postalCode: "",
  addressLine: "",
  avatarUrl: null,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      userId: null,
      profile: null,
      setProfile: (userId, profile) => set({ userId, profile }),
      clearProfile: () => set({ userId: null, profile: null }),
    }),
    {
      name: "drshoes-profile",
      partialize: (state) => ({
        userId: state.userId,
        profile: state.profile,
      }),
    }
  )
);

export { emptyProfile };
