import {useContext} from 'react';
import {DialogContext} from './dialogsProvider.jsx';

export const useDialogs = () => {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error('useDialogs must be used within a DialogsProvider');
	}

	return context;
};
