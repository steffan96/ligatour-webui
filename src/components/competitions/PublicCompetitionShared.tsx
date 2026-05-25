/**
 * PublicCompetitionShared.tsx
 *
 * Shared primitives used by every public competition page:
 *   - LoadingSpinner
 *   - ErrorDisplay
 *   - StatusBadge
 *   - TabBar  (generic — pass your own tab definitions)
 *   - CompetitionPageShell  (full-page layout: header + content card)
 *   - useCompetitionData  (fetch / loading / error / auto-refresh hook)
 */

import { type CompetitionInterface, getPublicCompetition } from 'api/competitions';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

// ─── LoadingSpinner ────────────────────────────────────────────────────────────

export const LoadingSpinner = ({ label = 'Loading…' }: { label?: string }) => (
  <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
      <div className="absolute inset-0 rounded-full border-4 border-t-green-900 animate-spin" />
    </div>
    <p className="text-sm text-gray-400 font-medium tracking-wide">{label}</p>
  </div>
);

// ─── ErrorDisplay ──────────────────────────────────────────────────────────────

export const ErrorDisplay = ({
  title = 'Unable to Load',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={
            'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 ' +
            '2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 ' +
            '0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
          }
        />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-5 max-w-xs">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className={
          'inline-flex items-center gap-2 bg-green-900 text-white text-sm font-medium ' +
          'px-5 py-2 rounded-lg hover:bg-green-800 active:scale-95 transition-all duration-150'
        }
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581' +
              'm0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            }
          />
        </svg>
        Try Again
      </button>
    )}
  </div>
);

// ─── StatusBadge ───────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; classes: string; dot: string }> = {
  active: {
    label: 'Live',
    classes: 'bg-green-100 text-green-800 border-green-200',
    dot: 'bg-green-500 animate-pulse',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
  },
  pending: {
    label: 'Upcoming',
    classes: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-400',
  },
};

export const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  const cfg = STATUS_MAP[status] ?? {
    label: status,
    classes: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── TabBar ────────────────────────────────────────────────────────────────────

export interface TabDef<T extends string = string> {
  key: T;
  label: string;
  icon: React.ReactNode;
}

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef<T>[];
  active: T;
  onChange: (t: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 px-5 border-b border-gray-100 flex-shrink-0">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              'inline-flex items-center gap-1.5 px-3 py-3 text-xs font-semibold',
              'transition-all duration-150 border-b-2 -mb-px focus:outline-none',
              isActive
                ? 'border-green-900 text-green-900'
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300',
            ].join(' ')}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── CompetitionPageShell ──────────────────────────────────────────────────────

/**
 * Full-page wrapper shared by all public competition views.
 *
 * Renders:
 *   - A top header bar with a coloured icon, the competition name / type, and an
 *     optional status badge.
 *   - A padded content area containing a white rounded card. Pass the tab bar and
 *     tab content as `children`; the card already handles overflow.
 */
export const CompetitionPageShell = ({
  competition,
  headerIcon,
  showStatus = false,
  children,
}: {
  competition: CompetitionInterface;
  /** SVG icon rendered inside the green rounded square in the header */
  headerIcon: React.ReactNode;
  /** Whether to render the StatusBadge next to the competition title */
  showStatus?: boolean;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    {/* ── Header ── */}
    <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center shadow-sm">
              {headerIcon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{competition.name}</h1>
              {competition.type && (
                <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{competition.type}</p>
              )}
            </div>
          </div>
          {showStatus && (
            <div className="flex items-center gap-3">
              <StatusBadge status={competition.status} />
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ── Content card ── */}
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  </div>
);

// ─── useCompetitionData ────────────────────────────────────────────────────────

/**
 * Generic data-fetching hook for public competition pages.
 *
 * Handles:
 *  - Initial fetch on mount
 *  - Loading / error state
 *  - A `transform` function to convert the raw API response payload into the
 *    shape your page needs
 *  - Auto-refresh every 30 s when `competition.status === "active"`
 *
 * @param slug       The URL slug from `useParams`
 * @param pathPrefix API sub-path, e.g. `"round_robin"` or `"knockout"`.
 *                   The hook will call `getPublicCompetition(`${pathPrefix}/${slug}`)`.
 * @param transform  `(responseData) => T` — extracts your page-specific data from
 *                   the raw API response (`response.data`).
 * @param initial    Initial value for the page-specific data (before first fetch).
 */
export function useCompetitionData<T>(
  slug: string | undefined,
  pathPrefix: string,
  transform: (data: Record<string, any>) => T,
  initial: T,
) {
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null);
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!slug) {
      setError('Invalid competition link');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getPublicCompetition(`${pathPrefix}/${slug}`);
      const payload = response.data as Record<string, any>;
      const competitionData = payload.competition as CompetitionInterface | undefined;
      if (!competitionData) throw new Error('Competition not found');
      setCompetition(competitionData);
      setData(transform(payload));
    } catch (err: any) {
      console.error(`[useCompetitionData] ${pathPrefix}/${slug}:`, err);
      setError(err?.message || 'Failed to load data. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  }, [slug, pathPrefix]); // `transform` is intentionally excluded — callers should memoize or define it outside render

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh for live competitions
  useEffect(() => {
    if (competition?.status !== 'active') return;
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [competition?.status, fetchData]);

  return { competition, data, loading, error, refetch: fetchData };
}
