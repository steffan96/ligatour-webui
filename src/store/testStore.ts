// Import { create } from 'zustand'
// import { devtools } from 'zustand/middleware'

// interface StoreState {
//   count: number
//   user: null | { id: string; name: string } // Replace with your user type
//   increment: () => void
//   setUser: (user: null | { id: string; name: string }) => void
// }

// const useStore = create<StoreState>()(
//   devtools((set, get) => ({
//     count: 0,
//     user: null,
//     increment: () => set((state) => ({ count: state.count + 1 })),
//     setUser: (user) => set({ user }),
//   }))
// )

// export default useStore
