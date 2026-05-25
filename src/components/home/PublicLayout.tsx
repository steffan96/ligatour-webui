import React from "react";
import { Outlet } from "react-router-dom";
import { useToastStore } from "../../api/stores/useToastStore";
import { InfoMessageCard } from "../shared/InfoMessageCard";

export default function PublicLayout() {
	const { toast, hideToast } = useToastStore();

	return (
		<div className="min-h-screen bg-gray-50">
			{toast && (
				<InfoMessageCard
					message={toast.message}
					isSuccess={toast.isSuccess}
					onClose={hideToast}
				/>
			)}
			<Outlet />
		</div>
	);
}
