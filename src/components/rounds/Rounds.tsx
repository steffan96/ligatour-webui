import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import PageWindow from "../shared/PageWindow";
import { useToastStore } from "../../api/stores/useToastStore";
import { listRounds, startRound } from "../../api/rounds";
import { SingleCompetitionContext } from "../competitions/SingleCompetition";
import Pagination from "../common/Pagination";
import ConfirmModal from "../common/ConfirmModal";

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

const RoundSection = ({
  round,
  onSelect,
}: {
  round: Round;
  onSelect: () => void;
}) => (
  <div
    className="bg-white rounded-lg border border-gray-200
     px-4 py-3 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
    onClick={onSelect}
  >
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-bold text-gray-700">
        Round {round.round_number}
      </h2>
      {round.stage && (
        <span className="text-xs text-gray-400 font-medium capitalize">
          {round.stage.replace(/_/g, " ")}
        </span>
      )}
    </div>
    <button
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className="inline-flex items-center gap-1.5
       text-[11px] font-medium text-gray-500 bg-gray-100 
       hover:bg-gray-200 hover:text-gray-800 border border-gray-200 
       rounded-full px-2.5 py-1 transition-colors"
    >
      Enter
      <svg
        className="w-2.5 h-2.5"
        viewBox="0 0 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" />
      </svg>
    </button>
  </div>
);

const NoRoundsState = ({
  onStart,
  isStarting,
}: {
  onStart: () => void;
  isStarting: boolean;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
    <div className="text-4xl">🏁</div>
    <div>
      <p className="text-sm font-bold text-gray-700">No rounds yet</p>
      <p className="text-xs text-gray-500 mt-1 font-medium">
        Generate the first round of matches to get started.
      </p>
    </div>
    <button
      onClick={onStart}
      disabled={isStarting}
      className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-md
        hover:bg-green-800 flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      {isStarting ? "Starting…" : "▶ Start Rounds"}
    </button>
  </div>
);

const ROUNDS_PER_PAGE = 5;

const Rounds = () => {
  const { competition } = useOutletContext<SingleCompetitionContext>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStartRoundModal, setShowStartRoundModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await listRounds(Number(id));
        const data: Round[] = response.data ?? response;
        setRounds(data);
      } catch (err: any) {
        showToast(err || "Failed to load matches.", false);
        setRounds([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleStartFirstRound = async () => {
    setIsStarting(true);
    try {
      const response = await startRound(competition.id);
      const data: Round[] = response.data ?? response;
      setRounds(data);
      showToast("First round started!", true);
    } catch (err: any) {
      showToast(err || "Failed to start round.", false);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStartRound = async (roundId?: number) => {
    if (!id) return;
    setIsStarting(true);
    try {
      const response = await startRound(Number(id));
      const data: Round[] = response.data ?? response;
      setRounds(data);
      showToast("Next round generated.", true);
      if (roundId) {
        navigate(`/competition/${id}/rounds/${roundId + 1}`);
      }
    } catch (err: any) {
      showToast(err || "Failed to start round.", false);
    } finally {
      setIsStarting(false);
      setShowStartRoundModal(false);
    }
  };

  const visibleRounds = rounds
    .filter((r) => r.matches.length > 0)
    .sort((a, b) => a.round_number - b.round_number);

  const totalPages = Math.ceil(visibleRounds.length / ROUNDS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROUNDS_PER_PAGE;
  const paginatedRounds = visibleRounds.slice(
    startIndex,
    startIndex + ROUNDS_PER_PAGE,
  );

  return (
    <PageWindow
      title={`Matches — ${competition.name}`}
      headerActionButtons={
        <button
          className="bg-gray-100 text-gray-900 text-sm font-semibold px-3.5 py-1.5
            rounded-md hover:bg-gray-200 flex items-center gap-2 transition-colors"
          onClick={() => navigate(`/competition/${id}`)}
        >
          <span>←</span> Back to settings
        </button>
      }
    >
      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : rounds.length === 0 ? (
        <NoRoundsState
          onStart={handleStartFirstRound}
          isStarting={isStarting}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginatedRounds.map((round) => (
              <RoundSection
                key={round.id}
                round={round}
                onSelect={() =>
                  navigate(`/competition/${id}/rounds/${round.id}`)
                }
              />
            ))}
          </div>
          {visibleRounds.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowStartRoundModal(true)}
                disabled={isStarting}
                className="bg-green-700 text-white text-sm font-semibold px-4 py-2
                  rounded-md hover:bg-green-800 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <span>▶</span> Start Next Round
              </button>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={visibleRounds.length}
            itemLabel="rounds"
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}

      {showStartRoundModal && (
        <ConfirmModal
          title="Start Next Round?"
          description="This will generate matches for the next round. This action cannot be undone."
          confirmLabel="▶ Start"
          onConfirm={() => handleStartRound()}
          onCancel={() => setShowStartRoundModal(false)}
        />
      )}
    </PageWindow>
  );
};

export default Rounds;