import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Add debug logging to check incoming props
  console.log("Pagination props:", { currentPage, totalPages });

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    // Convert to number and ensure minimum of 1
    const validTotalPages = Math.max(1, Number(totalPages) || 1);
    const validCurrentPage = Math.max(1, Number(currentPage) || 1);

    console.log("Validated values:", { validCurrentPage, validTotalPages });

    if (validTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= validTotalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (validCurrentPage <= 3) {
        for (let i = 1; i <= 3; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(validTotalPages);
      } else if (validCurrentPage >= validTotalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = validTotalPages - 2; i <= validTotalPages; i++)
          pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        pageNumbers.push(validCurrentPage - 1);
        pageNumbers.push(validCurrentPage);
        pageNumbers.push(validCurrentPage + 1);
        pageNumbers.push("...");
        pageNumbers.push(validTotalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-arrow"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        style={{
          color: currentPage === 1 ? "gray" : "black",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        <span>←</span> Prev
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === "..." ? (
            <span key={`ellipsis-${index}`} className="ellipsis">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              className={`page-number ${
                currentPage === pageNum ? "active" : ""
              }`}
              onClick={() => onPageChange(pageNum)}
            >
              {String(pageNum).padStart(2, "0")}
            </button>
          )
        )}
      </div>

      <button
        className="pagination-arrow"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        style={{
          color: currentPage === totalPages ? "gray" : "black",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        Next <span>→</span>
      </button>
    </div>
  );
};
export default Pagination;
