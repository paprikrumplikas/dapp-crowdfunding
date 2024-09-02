import React from 'react';
import { useNavigate } from 'react-router-dom';

import { loader } from '../assets';
import FundCard from "./FundCard";


const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
    const navigate = useNavigate();

    // to increase code readability
    const handleNavigate = (campaign) => {
        // @note @learning @syntax @crucial new react router allows one to pass state directly through routing
        // this allows one to pass data to the target route without including it in the url
        // The passed state can be accessed in the target component using the useLocation hook from react-router-dom.
        // When you navigate to a new route, the component unmounts, and its props are lost. By passing state through navigation, you ensure the data is available in the new route.
        navigate(`/campaign-details/${campaign.title}`, { state: campaign })
    }

    return (
        <div>
            <h1 className='font-epilogue font-semibold text-[18px] text-white text-left'>
                {title} ({campaigns.length})
            </h1>

            <div className='flex flex-wrap mt-[20px] gap-[26px]'>
                {/** If isLoading, then show the loading img */}
                {isLoading && (
                    <img
                        src={loader}
                        alt="loader"
                        className='w-[100px] h-[100px] object-contain'
                    />

                )}


                {/** If it is not loading and the length is 0, display that there are no campaigns */}
                {!isLoading && campaigns.length === 0 && (
                    <p className='font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]'>
                        You have not created any campaigns yet.
                    </p>
                )}

                {/** @learning @crucial function is being used to iterate over each campaign in the campaigns array. For each campaign, a FundCard component is being rendered. */}
                {!isLoading && campaigns.length > 0 && campaigns.map((campaign) =>
                    <FundCard
                        key={campaign.pId}
                        {...campaign}
                        handleClick={() => handleNavigate(campaign)}
                    />)}
            </div>


        </div>
    )
}

export default DisplayCampaigns