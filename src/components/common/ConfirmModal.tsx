import React from "react";

interface ConfirmModalProps {
	title: string;
	description: string;
	confirmLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmModal = ({ title, description, confirmLabel, onConfirm, onCancel }: ConfirmModalProps) => (
	<div className="fixed inset-0 z-50 flex items-center justify-center">
		<div className="absolute inset-0 bg-black/40" onClick={onCancel} />
		<div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm mx-4 p-6">
			<div className="mb-4">
				<p className="text-base font-bold text-gray-900">{title}</p>
				<p className="text-sm text-gray-500 mt-1">{description}</p>
			</div>
			<div className="flex justify-end gap-3">
				<button
					onClick={onCancel}
					className="bg-gray-100 text-gray-900 
          font-bold py-2 px-5 rounded-md text-sm hover:bg-gray-200 transition-colors"
				>
					Cancel
				</button>
				<button
					onClick={onConfirm}
					className="bg-green-900 text-white 
          font-bold py-2 px-5 rounded-md text-sm hover:bg-green-800 transition-colors"
				>
					{confirmLabel}
				</button>
			</div>
		</div>
	</div>
);

export default ConfirmModal;
