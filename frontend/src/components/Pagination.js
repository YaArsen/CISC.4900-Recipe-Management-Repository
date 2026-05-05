const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    return (
        <div className='pagination'>
            {/* Pagination Buttons */}
            {currentPage !== 1 && <input type='button' value='<' onClick={() => setCurrentPage(c => c - 1)} />}

            {[...Array(totalPages).keys()].map((_, index) => (
                <button
                    key={index}
                    type='button'
                    onClick={() => setCurrentPage(index + 1)}
                    className={`page ${currentPage === index + 1 ? 'show' : ''}`}
                >
                    {index + 1}
                </button>
            ))}

            {currentPage < totalPages && <input type='button' value='>' onClick={() => setCurrentPage(c => c + 1)} />}

            <div>{currentPage}/{totalPages}</div>
        </div>
    );
};

export default Pagination;