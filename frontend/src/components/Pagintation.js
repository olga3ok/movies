import React from 'react';
import './Pagination.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faArrowLeftLong} from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="d-flex justify-content-center mt-3">
            <button
                className="btn btn-secondary pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || totalPages === 0}
            >
                <FontAwesomeIcon icon={faArrowLeftLong} />
            </button>
            <span className="pagination-current-page">{currentPage}</span>
            <button
                className="btn btn-secondary pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
            >
                <FontAwesomeIcon icon={faArrowRightLong} />
            </button>
        </div>
    );
};

export default Pagination;
