import React, { useEffect, useState } from "react";
import { addPlayerToTeam, getTeam } from "api/teams";
import { useToastStore } from "../../api/stores/useToastStore";
import {
	AddPlayerForm,
	EditPlayerForm,
	PlayerCard,
	type PlayerFields,
	usePlayerList,
} from "../../components/players/PlayerFormShared";

const extractTeamPlayers = (raw: any[]) =>
	raw.map((entry) => ({ ...entry.player }));

interface TeamPlayersProps {
	teamId: string;
	onBack: () => void;
}

const TeamPlayers = ({ teamId, onBack }: TeamPlayersProps) => {
	const { showToast } = useToastStore();

	const [team, setTeam] = useState<any>(null);
	const [players, setPlayers] = useState<any[]>([]);
	const [isAdding, setIsAdding] = useState(false);

	const {
		editingId,
		editingPlayer,
		handleEditPlayer,
		handleUpdatePlayer,
		handleRemovePlayer,
		handleCancel,
	} = usePlayerList(players, setPlayers);

	useEffect(() => {
		const fetchTeam = async () => {
			try {
				const response = await getTeam(teamId);
				setTeam(response.data || null);
				setPlayers(extractTeamPlayers(response?.data?.players || []));
			} catch (err: any) {
				showToast(err || "Failed to load team.", false);
				onBack();
			}
		};
		fetchTeam();
	}, [teamId]);

	const handleAddPlayer = async (player: PlayerFields): Promise<boolean> => {
		try {
			await addPlayerToTeam(teamId, player);
			const response = await getTeam(teamId);
			setPlayers(extractTeamPlayers(response?.data?.players || []));
			setIsAdding(false);
			return true;
		} catch (err: any) {
			showToast(err || "Failed to add a player.", false);
			return false;
		}
	};

	if (!team) return null;

	const isIdle = !isAdding && editingId === null;

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between pb-3 border-b border-gray-200">
				<div className="flex items-center gap-3">
					<p className="text-xs text-gray-500 font-medium">
						{team.name} &middot; {players.length} player
						{players.length !== 1 ? "s" : ""}
					</p>
					{isIdle && (
						<button
							onClick={() => setIsAdding(true)}
							className="bg-white text-green-900 text-sm font-bold
                         px-3.5 py-1.5 rounded-md hover:bg-green-50
                         border border-green-200 transition-colors"
						>
							+ Add Player
						</button>
					)}
				</div>
			</div>

			{/* Add form */}
			{isAdding && (
				<AddPlayerForm
					onAdd={handleAddPlayer}
					onCancel={() => {
						setIsAdding(false);
						handleCancel();
					}}
				/>
			)}

			{editingId !== null && editingPlayer && (
				<EditPlayerForm
					player={editingPlayer}
					onUpdate={handleUpdatePlayer}
					onCancel={handleCancel}
				/>
			)}

			<div>
				{players.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 text-center gap-2">
						<div className="text-3xl">👤</div>
						<p className="text-sm font-bold text-gray-700">No players yet</p>
						<p className="text-xs font-medium text-gray-500">
							Add players to this team to get started
						</p>
						{isIdle && (
							<button
								onClick={() => setIsAdding(true)}
								className="mt-1 text-blue-900 hover:text-blue-700 text-sm font-semibold
                           px-4 py-1.5 rounded-md bg-blue-50 border border-blue-200
                           hover:bg-blue-100 transition-colors"
							>
								+ Add First Player
							</button>
						)}
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{players.map((player, index) => (
							<PlayerCard
								key={player.id ?? index}
								participant={player}
								index={index}
								onRemove={() => handleRemovePlayer(index)}
								onEdit={() => handleEditPlayer(index)}
								editingId={editingId}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default TeamPlayers;
