import React from "react";
import { Link } from "react-router-dom";
import { CompetitionTypeDisplay } from "../../api/interfaces/competitions";

interface CompetitionCardProps {
	id: string;
	name: string;
	type?: string;
	numberOfTeams?: number;
}

export default function CompetitionCard({ id, name, type, numberOfTeams }: CompetitionCardProps) {
	return (
		<Link to={`/competition/${id}`}>
			<div
				className="bg-gray-100
      border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div className="flex-1">
						<h3 className="font-semibold text-gray-900">{name}</h3>
						<div className="flex items-center gap-3 mt-1">
							{type && (
								<span
									className="inline-flex items-center px-2.5 py-0.5
                rounded-full text-xs font-medium bg-green-100 text-green-800"
								>
									{CompetitionTypeDisplay[type as keyof typeof CompetitionTypeDisplay] || type}
								</span>
							)}
							{numberOfTeams !== undefined && (
								<span className="text-sm text-gray-600">
									{numberOfTeams} participant{numberOfTeams !== 1 ? "s" : ""}
								</span>
							)}
						</div>
					</div>
					<div className="text-sm text-gray-500">View Details →</div>
				</div>
			</div>
		</Link>
	);
}
