import React, { useState, useEffect } from 'react';
// @learning from the location we are gonna pick up the state we sent via routing
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from '../context';
import { CustomButton } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from "../assets";
import { CountBox } from "../components";



const CampaignDetails = () => {
    // @learning from the location we are picking up the state we sent via routing
    const { state } = useLocation();
    console.log(state);

    const { getDonations, contract, address } = useStateContext();

    // comp local states
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [donators, setDonators] = useState([]);
    const remainingDays = daysLeft(state.deadline);

    return (
        <div>
            {isLoading && 'Loading...'}

            {/** wrapper for the top of the content with images and counters */}
            <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
                <div className='flex-1 flex-col'>
                    <img
                        src={state.image}
                        alt="campaign"
                        className='w-full h-[410px] object-cover object-[50%_30%] rounded-xl'
                    />

                    {/** funding status bar */}
                    <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2'>
                        <div className='absolute h-full bg-[#4acd8d]' style={{ width: `${calculateBarPercentage(state.target, state.AmountCollected)}%`, maxWidth: '100%' }}>
                        </div>
                    </div>
                </div>

                <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
                    <CountBox title="Days left" value={remainingDays} />
                    <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
                    <CountBox title="Total backers" value={donators.length} />
                </div>
            </div>

            {/** wrapper for the bottom of the content */}
            <div className='mt-[60px] flex lg:flex-row flex-col gap-5'>
                {/** smaller wrapper */}
                <div className='flex-[2] flex flex-col gap-[40px]'>
                    <div>
                        <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Creator</h4>
                        <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>
                            {/** img put in a wrapper so we can give it a backgorund */}
                            <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'>
                                <img
                                    src={thirdweb}
                                    alt="user"
                                    className='w-[60%] h-[60%] object-contain'
                                />
                            </div>
                        </div>
                    </div>





                </div>

            </div>

        </div >
    )
}

export default CampaignDetails