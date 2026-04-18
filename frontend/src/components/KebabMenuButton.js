import threeVerticalDots from '../assets/three-dots-vertical.svg';

const KebabMenuButton = ({ setActiveManageId, activeManageId, id }) => {
    return (
        <>
            {/* Edit button sets the active recipe ID and switches view */}
            <button
                type='button'
                className='manage-button'
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveManageId(activeManageId === id ? '' : id.toString());
                }}
            >
                <img src={threeVerticalDots} alt='manage' />
            </button>
        </>
    );
};

export default KebabMenuButton;