import React, { useState, useEffect } from 'react';
// @learning from the location we are gonna pick up the state we sent via routing
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from '../context';
import { CustomButton } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from "../assets";
import { CountBox, Loader } from "../components";

import { loader } from '../assets';


const CampaignDetails = () => {
    const navigate = useNavigate();
    // @learning @crucial from the location we are picking up the state we sent via routing
    const { state } = useLocation();
    // console.log(state);

    const { getDonations, contract, address, donate, getCampaigns } = useStateContext();

    // comp local states
    const [isLoading, setIsLoading] = useState(false);  // this is more like tx pending
    const [isDataLoading, setIsDataLoading] = useState(false); // this is more like data read is pending
    const [amount, setAmount] = useState('');
    const [donators, setDonators] = useState([]);
    const [campaignCount, setCampaignCount] = useState(null);

    const remainingDays = daysLeft(state.deadline);

    const fetchDonators = async () => {
        const data = await getDonations(state.pId);
        setDonators(data);
    }

    // @custom so we dont have a silly hardcoded value
    // @crucial this needs to be called in a useEffect that can update when contract gets available
    const getNumberOfCampaignsByOwnerOfCurrentCampaign = async () => {
        if (!contract) {
            setIsDataLoading(true);
            return 'Loading campaign count...';
        }
        try {
            const allCampaigns = await getCampaigns();
            const totalCampaignsByUser = allCampaigns.filter((campaign) => campaign.owner === state.owner);
            setIsDataLoading(false);

            return `${totalCampaignsByUser.length} campaign(s)`;
        } catch (error) {
            console.error("Error fetching campaign count:", error);
            return 'Error';
        }
    }


    useEffect(() => {
        const fetchCampaignCount = async () => {
            try {
                const count = await getNumberOfCampaignsByOwnerOfCurrentCampaign();
                setCampaignCount(count);
            } catch (error) {
                console.error("Error fetching campaign count:", error);
                setCampaignCount('Error');
            }
        };

        fetchCampaignCount();
    }, [contract]);


    useEffect(() => {
        if (contract) {
            fetchDonators();
        }
    }, [contract, address])

    // for the button
    const handleDonate = async () => {
        setIsLoading(true);
        await donate(state.pId, amount);
        // navigate back to home page
        navigate('/');
        setIsLoading(false);
    }

    return (
        <div>
            {isLoading && <Loader />}

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
                        <div
                            className='absolute h-full bg-[#4acd8d]'
                            style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}>
                        </div>
                    </div>
                </div>

                <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
                    <CountBox title="Days left" value={remainingDays} />
                    <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
                    <CountBox title="# of donations" value={donators.length} />
                </div>
            </div>

            {/** wrapper for the bottom of the content */}
            <div className='mt-[60px] flex lg:flex-row flex-col gap-5'>
                {/** smaller wrapper - 1 */}
                <div className='flex-[2] flex flex-col gap-[40px]'>

                    <div className='flex flex-row justify-between'>

                        {/** Container for title */}
                        <div className='flex-grow'>
                            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Campaign Title</h4>
                            <p className='mt-[20px] font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>{state.title}</p>
                        </div>

                        {/** Container for clickabla owner data */}
                        <div
                            className='cursor-pointer flex-grow'
                            onClick={() => {
                                navigate(`/profile/${state.owner}`)
                            }}
                        >
                            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Creator</h4>
                            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px] justify-start'>
                                {/** img put in a wrapper so we can give it a backgorund */}
                                <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32]'>
                                    <img
                                        src={thirdweb}
                                        alt="user"
                                        className='w-[60%] h-[60%] object-contain'
                                    />
                                </div>

                                {/** container for owner stats */}
                                <div>
                                    <h4 className='font-epilogue font-semibold text-[14px] text-white break-all'>{state.owner}</h4>
                                    <div className='flex flex-row items-center'>
                                        <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]'>
                                            {/** If isLoading, then show the loading img */}
                                            {campaignCount}
                                        </p>
                                        {isDataLoading && (
                                            <img
                                                src={loader}
                                                alt="loader"
                                                className='w-[20px] h-[20px] object-contain'
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div>
                        <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Story</h4>
                        <div className='mt-[20px]'>
                            <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>{state.description}</p>
                        </div>
                    </div>


                    <div className='flex-1 mt-[20px]'>
                        <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Fund</h4>

                        {/** wrapper div */}
                        <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]'>
                            <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
                                Fund the campaign 🌱
                            </p>

                            <div className='mt-[30px]'>
                                <input
                                    type="number"
                                    placeholder="ETH 0.1"
                                    step="0.01"
                                    className="w-full py-[10px] sm-px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                                    value={amount}
                                    // @syntax @learning @note takes a key press event, sets the amount
                                    onChange={(e) => setAmount(e.target.value)}
                                />

                                <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                                    <h4 className='font-epilogue font-semibold text-[16px] leading-[22px] text-white'>
                                        Back it because you beleive in it.
                                    </h4>
                                    <p className='mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]'>
                                        Support the project for no reward, just because it speaks to you.
                                    </p>
                                </div>

                                <CustomButton
                                    btnType="button"
                                    title="Fund campaign"
                                    styles="w-full bg-[#8c6dfd]"
                                    handleClick={handleDonate}
                                />
                            </div>
                        </div>
                    </div>



                    <div className='mt-[20px]'>
                        <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Donations</h4>
                        <div className='my-[20px] flex flex-col gap-4'>
                            {donators.length > 0 ? donators.map((item, index) => (
                                < div
                                    key={`${item.donator}-${index}`}
                                    className="flex justify-between items-center"
                                >
                                    <p className='font-epilouge font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all'>
                                        {index + 1}. {item.donator}
                                    </p>
                                    <p className='font-epilouge font-normal text-[16px] text-[#808191] leading-[26px] break-all'>
                                        {item.donation} ETH
                                    </p>
                                </div>
                            )) : (
                                <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>No donators yet. Be the first one!</p>
                            )}
                        </div>
                    </div>

                </div>


            </div>
        </div >
    )
}

export default CampaignDetails