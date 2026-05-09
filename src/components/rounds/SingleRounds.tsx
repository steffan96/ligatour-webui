import React, { useEffect, useState } from "react";
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
  draw: boolean;
  type: string;
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
      label: "live",
      cls: "bg-red-50 text-red-700 border-red-200 animate-pulse",
    },
    completed: {
      label: "completed",
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
  const isDraw = match.draw === true;

  const [isEditing, setIsEditing] = useState(false);
  const [winnerId, setWinnerId] = useState<number | "">(match.winner_team_id ?? "");
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
          <span className={`text-sm font-bold truncate ${homeWins ? "text-green-800" : ""}`}>
            {match.home_team_name}
          </span>
          {homeWins && <span>🏆</span>}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs font-bold text-gray-400">
            {isDraw ? <span className="text-orange-600">DRAW</span> : "VS"}
          </div>
          <MatchStatusBadge status={match.status} />
        </div>
        <div className="flex-1 flex items-center gap-3 min-w-0">
          {awayWins && <span>🏆</span>}
          <span className={`text-sm font-bold truncate ${awayWins ? "text-green-800" : ""}`}>
            {isBye ? "Bye" : match.away_team_name}
          </span>
        </div>
        {!isEditing && (
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
            {/* {match.type != 'knockout' && <option value={0}>Draw</option>} */}
            <option value={0}>Draw</option>
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

interface SingleRoundProps {
  competitionId: number;
  roundId: number;
}

const SingleRound = ({ competitionId, roundId }: SingleRoundProps) => {
  const { showToast } = useToastStore();
  const [round, setRound] = useState<Round | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRound = async () => {
    setIsLoading(true);
    try {
      const response = await getRound(competitionId, roundId);
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
  }, [competitionId, roundId]);

  const handleUpdateMatch = async (mId: number, wId: number | null) => {
    try {
      await updateMatch(competitionId, roundId, mId, wId as unknown as number);
      await loadRound();
      showToast("Match updated!", true);
    } catch (err: any) {
      showToast(err || "Match update failed.", false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-500 font-medium">
            {round ? (
              <>
                {round.stage && (
                  <span className="ml-1.5 capitalize text-gray-400">
                    · {round.stage.replace(/_/g, " ")}
                  </span>
                )}
                <span className="ml-1.5 capitalize text-gray-400">
                  · {round.status.replace(/_/g, " ")}
                </span>
              </>
            ) : (
              <span className="text-gray-300">Loading…</span>
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-20 bg-gray-100 rounded" />
      ) : !round ? (
        <div className="text-sm text-gray-500 text-center py-10">Round not found.</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {round.matches?.map((m) => (
            <MatchCard key={m.id} match={m} onUpdateMatch={handleUpdateMatch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleRound;