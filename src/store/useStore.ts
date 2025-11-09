import {create} from 'zustand';

type Store = {
	isModalOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
	toggleModal: () => void;
};

const useStore = create<Store>(set => ({
	isModalOpen: false,
	openModal() {
		set({isModalOpen: true});
	},
	closeModal() {
		set(() => ({isModalOpen: false}));
	},
	toggleModal() {
		set(state => ({isModalOpen: !state.isModalOpen}));
	},
}));

export default useStore;
