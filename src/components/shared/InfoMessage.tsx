import React, {useState} from 'react';

export default function InfoMessage({message, type}: {message: string; type?: 'success' | 'error'}) {
	const [visible, setVisible] = useState(true);

	if (!message || !visible) {
		return null;
	}

	return (
		<>
			<style>
				{`
          .notification-card {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background-color: #ffffff;
            color: #333;
            border-left: 4px solid;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.5s ease-out;
            transition: all 0.3s ease;
          }
          .notification-card.error {
            border-left-color: #ff6b6b;
            background-color: #fff5f5;
            animation: slideIn 0.5s ease-out, shake 0.5s ease-in-out;
          }
          .notification-card.success {
            border-left-color: #00c851;
            background-color: #e8f5e9;
          }
          .notification-card::before {
            content: '⚠️';
            font-size: 20px;
          }
          .notification-card.success::before {
            content: '✅';
            color: #00c851;
          }
          .notification-card.error::before {
            content: '❌';
            color: #ff6b6b;
          }
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .notification-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
          }
          .notification-card.error:hover {
            transform: translateY(-2px) scale(1.02);
          }
          .notification-card .close-button {
            margin-left: auto;
            background: none;
            border: none;
            color: #666;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            transition: color 0.2s ease;
          }
          .notification-card.error .close-button {
            color: #ff6b6b;
          }
          .notification-card.success .close-button {
            color: #00c851;
          }
          .notification-card .close-button:hover {
            color: #333;
          }
          .notification-card.fade-out {
            animation: fadeOut 0.3s ease-out forwards;
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }
        `}
			</style>
			<div className={`notification-card${type ? ' ' + type : ''}`}>
				{message}
				<button className='close-button' onClick={() => {
					setVisible(false);
				}}>×</button>
			</div>
		</>
	);
}
