import React from 'react';

import { tagType, thirdweb } from '../assets';
import { daysLeft, calculateBarPercentage } from "../utils";

// @note @learning in DisplayCampaings where FundCard is rendered, we spread out all of the campaign properties
// so now we can get each of them through props
const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick }) => {

    const remainingDays = daysLeft(deadline);

    return (
        <div className='sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer' onClick={handleClick}>
            <img
                src={image}
                alt="img"
                className='w-full h-[288px] object-cover object-[50%_30%] rounded-[15px]'
            />

            {/** Wrapper for the contect */}
            <div className='flex flex-col p-4'>
                {/** block for the category image and category */}
                <div className='flex flex-row items-center mb-[18px]'>
                    <img
                        src={tagType}
                        alt="tag"
                        className='w-[17px] h-[17px] object-contain'
                    />
                    <p className='ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]'>Fun</p>
                </div>

                {/** block for funding status bar*/}
                <div className='relative w-full h-[5px] bg-[#3a3a43] mb-4'>
                    <div
                        className='absolute h-full bg-[#4acd8d]'
                        style={{ width: `${calculateBarPercentage(target, amountCollected)}%`, maxWidth: '100%' }}>
                    </div>
                </div>

                {/** block for the title and decsitption*/}
                <div className='block'>
                    <h3 className='font-epilogue font-semibold text-[16px] text-white text-left leading-[20px] truncate'>{title}</h3>
                    <p className='mt-[5px] font-epilogue font-normal font-[12px] text-[#808191] text-left leading-[18px] line-clamp-5'>{description}</p>
                </div>

                {/** block for the amount and date*/}
                <div className='flex justify-between flex-wrap mt-[15px] gap-2'>
                    <div className='flex flex-col'>
                        <h4 className='font-epliogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>{amountCollected} </h4>
                        <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#b2b3bd] sm:max-w-[120px] truncate'>Raised of {target}</p>
                    </div>
                    <div className='flex flex-col'>
                        <h4 className='font-epliogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>{remainingDays} </h4>
                        <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#b2b3bd] sm:max-w-[120px] truncate'>Days left</p>
                    </div>
                </div>

                {/** block for the owner address*/}
                <div className='flex items-center mt-[20px] gap-[12px]'>
                    {/** wrapper div for the image so that we can give it a background*/}
                    <div className='w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13121a]'>
                        <img
                            src={thirdweb}
                            alt="user"
                            className='w-1/2 h-1/2 object-contain'
                        />
                    </div>
                    <p className='flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate'> by <span className='"text-[#b2b3bd]'></span>{owner}</p>
                </div>


            </div>
        </div >
    )
}

export default FundCard