import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWindow from "../shared/PageWindow";
import { useToastStore } from "../../api/stores/useToastStore";
import { getRound } from "../../api/rounds";
import { updateMatch } from "../../api/matches";

interface Match {
  id: number;
  competition_id: number;
  round_id: number;
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  home_score: number | null;
  away_score: number | null;
  status: "scheduled" | "in_progress" | "completed" | "bye";
  winner_team_id: number | null;
  created_at: string;
}

interface Round {
  id: number;
  competition_id: number;
  round_number: number;
  stage: string;
  status: "scheduled" | "in_progress" | "completed";
  created_at: string;
  matches: Match[];
}

const MatchStatusBadge = ({ status }: { status: Match["status"] }) => {
  const map: Record<Match["status"], { label: string; cls: string }> = {
    scheduled: {
      label: "🗓 Scheduled",
      cls: "bg-gray-100 text-gray-600 border-gray-200",
    },
    in_progress: {
      label: "🔴 Live",
      cls: "bg-red-50 text-red-700 border-red-200 animate-pulse",
    },
    completed: {
      label: "✅ Final",
      cls: "bg-green-50 text-green-800 border-green-200",
    },
    bye: { label: "⏭ Bye", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  };
  const { label, cls } = map[status] ?? map.scheduled;
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${cls}`}>
      {label}
    </span>
  );
};

const MatchCard = ({
  match,
  onUpdateMatch,
}: {
  match: Match;
  onUpdateMatch: (matchId: number, winnerId: number | null) => Promise<void>;
}) => {
  const isBye = match.status === "bye";
  const homeWins = match.winner_team_id === match.home_team_id;
  const awayWins = match.winner_team_id === match.away_team_id;

  const [isEditing, setIsEditing] = useState(false);
  const [winnerId, setWinnerId] = useState<number | "">(
    match.winner_team_id ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setWinnerId(match.winner_team_id ?? "");
  }, [match.winner_team_id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateMatch(match.id, winnerId === "" ? null : Number(winnerId));
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={
        "bg-white rounded-lg border " +
        (isBye ? "bg-blue-50/30 border-blue-100" : "border-gray-200")
      }
    >
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
          <span
            className={`text-sm font-bold truncate ${homeWins ? "text-green-800" : ""}`}
          >
            {match.home_team_name}
          </span>
          {homeWins && <span>🏆</span>}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs font-bold text-gray-400">VS</div>
          <MatchStatusBadge status={match.status} />
        </div>
        <div className="flex-1 flex items-center gap-3 min-w-0">
          {awayWins && <span>🏆</span>}
          <span
            className={`text-sm font-bold truncate ${awayWins ? "text-green-800" : ""}`}
          >
            {isBye ? "Bye" : match.away_team_name}
          </span>
        </div>
        {!isBye && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-gray-100 px-2 py-1 rounded"
          >
            Edit
          </button>
        )}
      </div>
      {isEditing && (
        <div className="border-t bg-gray-50 px-4 py-3 rounded-b-lg flex flex-col gap-3">
          <select
            value={winnerId}
            onChange={(e) =>
              setWinnerId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">Draw</option>
            <option value={match.home_team_id}>{match.home_team_name}</option>
            <option value={match.away_team_id}>{match.away_team_name}</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs px-3 py-1 bg-white border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="text-xs px-3 py-1 bg-green-700 text-white rounded"
            >
              {isSaving ? "..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SingleRound = () => {
  const { id, roundId } = useParams<{ id: string; roundId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const [round, setRound] = useState<Round | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRound = async () => {
    if (!id || !roundId) return;
    setIsLoading(true);
    try {
      const response = await getRound(Number(id), Number(roundId));
      const data: Round = response.data ?? response;
      setRound(data);
    } catch (err: any) {
      showToast(err || "Failed to load round.", false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRound();
  }, [id, roundId]);

  const handleUpdateMatch = async (mId: number, wId: number | null) => {
    if (!id || !roundId) return;
    try {
      await updateMatch(
        Number(id),
        Number(roundId),
        mId,
        wId as unknown as number,
      );
      await loadRound();
      showToast("Match updated!", true);
    } catch (err: any) {
      showToast(err || "Match update failed.", false);
      throw err;
    }
  };

  return (
    <PageWindow
      title={round ? `Round ${round.round_number}` : "Round"}
      headerActionButtons={
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/competition/${id}/rounds`)}
            className="bg-gray-100 px-3 py-1 rounded"
          >
            Back
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="animate-pulse h-20 bg-gray-100 rounded" />
      ) : !round ? (
        <div>Not found</div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white border rounded-lg p-4">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Status
            </span>
            <div className="font-bold capitalize">
              {round.status.replace(/_/g, " ")}
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {round.matches?.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                onUpdateMatch={handleUpdateMatch}
              />
            ))}
          </div>
        </div>
      )}
    </PageWindow>
  );
};

export default SingleRound;