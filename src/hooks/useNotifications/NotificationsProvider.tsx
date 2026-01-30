// import React, {createContext, useState, useCallback} from 'react';
// import {Snackbar, Alert} from '@mui/material';

// type NotificationContextType = {
// 	showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
// };

// export const NotificationContext = createContext<NotificationContextType>({
// 	showNotification: () => {},
// });

// export const NotificationsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
// 	const [open, setOpen] = useState(false);
// 	const [message, setMessage] = useState('');
// 	const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

// 	const showNotification = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
// 		setMessage(message);
// 		setSeverity(severity);
// 		setOpen(true);
// 	}, []);

// 	return (
// 		<NotificationContext.Provider value={{showNotification}}>
// 			{children}
// 			<Snackbar open={open} autoHideDuration={6000} onClose={() => {
// 				setOpen(false);
// 			}}>
// 				<Alert onClose={() => {
// 					setOpen(false);
// 				}} severity={severity}>
// 					{message}
// 				</Alert>
// 			</Snackbar>
// 		</NotificationContext.Provider>
// 	);
// };
