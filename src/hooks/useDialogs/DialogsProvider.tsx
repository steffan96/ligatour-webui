import React, {createContext, useState, useCallback} from 'react';
import {
	Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';

type DialogContextType = {
	showConfirmDialog: (title: string, message: string) => Promise<boolean>;
};

export const DialogContext = createContext<DialogContextType>({
	showConfirmDialog: async () => false,
});

export const DialogsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
	const [open, setOpen] = useState(false);
	const [dialogConfig, setDialogConfig] = useState<{title: string; message: string; resolve: (value: boolean) => void}>();

	const showConfirmDialog = useCallback(async (title: string, message: string) => new Promise<boolean>(resolve => {
		setDialogConfig({title, message, resolve});
		setOpen(true);
	}), []);

	const handleClose = (confirmed: boolean) => {
		setOpen(false);
		dialogConfig?.resolve(confirmed);
	};

	return (
		<DialogContext.Provider value={{showConfirmDialog}}>
			{children}
			<Dialog open={open} onClose={() => {
				handleClose(false);
			}}>
				<DialogTitle>{dialogConfig?.title}</DialogTitle>
				<DialogContent>{dialogConfig?.message}</DialogContent>
				<DialogActions>
					<Button onClick={() => {
						handleClose(false);
					}}>Cancel</Button>
					<Button onClick={() => {
						handleClose(true);
					}} autoFocus>Confirm</Button>
				</DialogActions>
			</Dialog>
		</DialogContext.Provider>
	);
};
