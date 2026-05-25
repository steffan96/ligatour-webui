import React from "react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemLabel?: string;
	onPageChange: (page: number) => void;
}

const Pagination = ({
	currentPage,
	totalPages,
	totalItems,
	itemLabel = "items",
	onPageChange,
}: PaginationProps) => {
	if (totalPages <= 1) return null;

	const goToPreviousPage = () => onPageChange(Math.max(1, currentPage - 1));
	const goToNextPage = () =>
		onPageChange(Math.min(totalPages, currentPage + 1));

	return (
		<div className="flex items-center justify-between mt-4 px-2">
			<div className="text-sm text-gray-700">
				Total {itemLabel}: {totalItems}
			</div>
			<div className="flex items-center gap-2">
				<button
					onClick={goToPreviousPage}
					disabled={currentPage === 1}
					className={`px-3 py-1 rounded border ${
						currentPage === 1
							? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
							: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
					}`}
				>
					Previous
				</button>

				<div className="flex items-center gap-1">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<button
							key={page}
							onClick={() => onPageChange(page)}
							className={`w-8 h-8 rounded border ${
								currentPage === page
									? "bg-green-500 text-white border-green-500"
									: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
							}`}
						>
							{page}
						</button>
					))}
				</div>

				<button
					onClick={goToNextPage}
					disabled={currentPage === totalPages}
					className={`px-3 py-1 rounded border ${
						currentPage === totalPages
							? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
							: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
					}`}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default Pagination;
