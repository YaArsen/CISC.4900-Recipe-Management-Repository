import threeVerticalDots from '../assets/three-dots-vertical.svg';

const KebabMenu = ({ setActiveManageId, activeManageId, id }) => {
    return (
        <>
            {/* Edit button sets the active recipe ID and switches view */}
            <button
                type='button'
                className='kebab-menu'
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveManageId(activeManageId === id ? null : id);
                }}
            >
                <img src={threeVerticalDots} alt='kebab-menu' />
            </button>
        </>
    );
};

export default KebabMenu;