import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWindow from "../shared/PageWindow";
import { useToastStore } from "../../api/stores/useToastStore";
import { getRound, updateRound } from "../../api/rounds";
// import ConfirmModal from "../common/ConfirmModal";

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

const STATUSES = ["scheduled", "in_progress", "completed"] as const;

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

const ScoreDisplay = ({
  homeScore,
  awayScore,
  status,
}: {
  homeScore: number | null;
  awayScore: number | null;
  status: Match["status"];
}) => {
  if (
    status === "scheduled" ||
    status === "bye" ||
    homeScore === null ||
    awayScore === null
  ) {
    return (
      <div className="flex items-center gap-2 text-gray-400 font-bold text-lg">
        <span>-</span>
        <span className="text-xs font-medium">vs</span>
        <span>-</span>
      </div>
    );
  }
  const homeWins = homeScore > awayScore;
  const awayWins = awayScore > homeScore;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-xl font-black tabular-nums ${homeWins ? "text-green-800" : awayWins ? "text-gray-400" : "text-gray-700"}`}
      >
        {homeScore}
      </span>
      <span className="text-xs font-bold text-gray-400">:</span>
      <span
        className={`text-xl font-black tabular-nums ${awayWins ? "text-green-800" : homeWins ? "text-gray-400" : "text-gray-700"}`}
      >
        {awayScore}
      </span>
    </div>
  );
};

const MatchCard = ({ match }: { match: Match }) => {
  const isBye = match.status === "bye";
  const homeWins =
    match.status === "completed" &&
    match.home_score !== null &&
    match.away_score !== null &&
    match.home_score > match.away_score;
  const awayWins =
    match.status === "completed" &&
    match.home_score !== null &&
    match.away_score !== null &&
    match.away_score > match.home_score;

  return (
    <div
      className={`bg-white rounded-lg border transition-shadow hover:shadow-md
        ${match.status === "in_progress" ? "border-red-200 shadow-sm" : isBye ? "border-blue-100 bg-blue-50/30" : "border-gray-200"}`}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
          <span
            className={`text-sm font-bold truncate text-right ${homeWins ? "text-green-800" : "text-gray-800"}`}
          >
            {match.home_team_name}
          </span>
          {homeWins && <span className="text-xs">🏆</span>}
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <ScoreDisplay
            homeScore={match.home_score}
            awayScore={match.away_score}
            status={match.status}
          />
          <MatchStatusBadge status={match.status} />
        </div>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {awayWins && <span className="text-xs">🏆</span>}
          <span
            className={`text-sm font-bold truncate ${isBye ? "text-gray-400 italic" : awayWins ? "text-green-800" : "text-gray-800"}`}
          >
            {isBye ? "Bye" : match.away_team_name}
          </span>
        </div>
      </div>
    </div>
  );
};

const SingleRound = () => {
  const { id, roundId } = useParams<{ id: string; roundId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const [round, setRound] = useState<Round | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editStatus, setEditStatus] = useState<Round["status"]>("scheduled");

  useEffect(() => {
    if (!id || !roundId) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getRound(Number(id), Number(roundId));
        const data: Round = response.data ?? response;
        setRound(data);
        setEditStatus(data.status);
      } catch (err: any) {
        showToast(err || "Failed to load round.", false);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, roundId]);

  const handleSave = async () => {
    if (!id || !roundId) return;
    setIsSaving(true);
    try {
      const response = await updateRound(Number(id), Number(roundId), {
        status: editStatus,
      });
      const data: Round = response.data ?? response;
      setRound(data);
      setIsEditing(false);
      showToast("Round updated successfully!", true);
    } catch (err: any) {
      showToast(err || "Failed to update round.", false);
    } finally {
      setIsSaving(false);
    }
  };

  // const handleDelete = async () => {
  //   if (!id || !roundId) return;
  //   try {
  //     await deleteRound(Number(id), Number(roundId));
  //     showToast("Round deleted.", true);
  //     navigate(`/competition/${id}/rounds`);
  //   } catch (err: any) {
  //     showToast(err || "Failed to delete round.", false);
  //   } finally {
  //     setShowDeleteModal(false);
  //   }
  // };

  const handleCancelEdit = () => {
    if (round) {
      setEditStatus(round.status);
    }
    setIsEditing(false);
  };

  return (
    <PageWindow
      title={round ? `Round ${round.round_number}` : "Round"}
      headerActionButtons={
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-700 text-white text-sm font-semibold px-3.5 py-1.5
                  rounded-md hover:bg-green-800 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving…" : "✓ Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-100 text-gray-900 text-sm font-semibold px-3.5 py-1.5
                  rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-100 text-gray-900 text-sm font-semibold px-3.5 py-1.5
                  rounded-md hover:bg-gray-200 flex items-center gap-2 transition-colors"
              >
                ✎ Edit
              </button>
              {/* <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-800 text-sm font-semibold px-2 py-1.5
                  rounded-md hover:bg-red-50 transition-colors"
              >
                🗑 Delete
              </button> */}
            </>
          )}
          <button
            onClick={() => navigate(`/competition/${id}/rounds`)}
            className="bg-gray-100 text-gray-900 text-sm font-semibold px-3.5 py-1.5
              rounded-md hover:bg-gray-200 flex items-center gap-2 transition-colors"
          >
            ← Back to rounds
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      ) : !round ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm font-bold text-gray-700">Round not found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Stage
                </span>
                <span className="text-sm font-semibold text-gray-800 capitalize">
                  {round.stage}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </span>
                {isEditing ? (
                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as Round["status"])
                    }
                    className="text-sm border border-gray-300 rounded-md px-2 py-1.5
                      text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border w-fit ${
                      round.status === "completed"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : round.status === "in_progress"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {round.status.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {round.matches?.length || 0} Match
              {round.matches?.length !== 1 ? "es" : ""}
            </p>

            {!round.matches || round.matches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm font-bold text-gray-700">
                  No matches in this round
                </p>
              </div>
            ) : (
              round.matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))
            )}
          </div>
        </div>
      )}

      {/* {showDeleteModal && (
        <ConfirmModal
          title="Delete Round?"
          description={`This will permanently delete Round ${round?.round_number} and all its matches. This action cannot be undone.`}
          confirmLabel="🗑 Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )} */}
    </PageWindow>
  );
};

export default SingleRound;
