import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import type { PaginationProps } from "../../interfaces/props/modalProps";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages < 1) return null;

  const visibleRange = 1;
  const showPages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) showPages.push(i);
  } else {
    showPages.push(1);

    if (currentPage > visibleRange + 2) {
      showPages.push("...");
    }

    const startPage = Math.max(2, currentPage - visibleRange);
    const endPage = Math.min(totalPages - 1, currentPage + visibleRange);

    for (let i = startPage; i <= endPage; i++) {
      showPages.push(i);
    }

    if (currentPage < totalPages - (visibleRange + 1)) {
      showPages.push("...");
    }

    showPages.push(totalPages);
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-6 justify-center text-sm sm:text-base">
      <button
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="text-gray-500 hover:text-black disabled:opacity-50 flex items-center gap-1 px-2 py-1"
      >
        <ChevronLeft />
      </button>

      <div className="flex flex-wrap gap-2 justify-center">
        {showPages.map((item, idx) =>
          typeof item === "number" ? (
            <button
              key={idx}
              onClick={() => handlePageChange(item)}
              aria-label={`Go to page ${item}`}
              aria-current={currentPage === item ? "page" : undefined}
              className={`w-7 h-7 rounded-md text-sm flex items-center justify-center transition cursor-pointer ${currentPage === item
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-200"
                }`}
            >
              {item}
            </button>
          ) : (
            <span
              key={idx}
              className="w-7 h-7 flex items-center justify-center text-gray-500"
            >
              {item}
            </span>
          )
        )}
      </div>

      <button
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="text-gray-500 hover:text-black disabled:opacity-50 flex items-center gap-1 px-2 py-1"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
