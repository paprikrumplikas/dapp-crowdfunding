import React from 'react';

const CustomButton = ({ btnType, title, handleClick, styles }) => {
    return (
        <button
            type={btnType}
            className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[57px] rounded-[10px] px-4 ${styles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    )
}

export default CustomButton