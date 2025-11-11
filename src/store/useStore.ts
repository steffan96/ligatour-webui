import {create} from 'zustand';

type Store = {
	isModalOpen: boolean;
	modalArgs: ModalArgs;
	openModal: (args: ModalArgs) => void;
	closeModal: () => void;
	toggleModal: () => void;
};

const useStore = create<Store>(set => ({
	isModalOpen: false,
	modalArgs: undefined as unknown as ModalArgs,
	openModal(args: ModalArgs) {
		set({ isModalOpen: true, modalArgs: args });
	},
	closeModal() {
		set(() => ({ isModalOpen: false, modalArgs: undefined as unknown as ModalArgs }));
	},
	toggleModal() {
		set(state => ({ isModalOpen: !state.isModalOpen }));
	},
}));

export default useStore;
