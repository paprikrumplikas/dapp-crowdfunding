import React from 'react';
import { useNavigate } from 'react-router-dom';

import { loader } from '../assets';
import FundCard from "./FundCard";

import { useStateContext } from '../context';   // @custom for search func



const DisplayCampaigns = ({ title, isLoading, campaigns }) => {

    const navigate = useNavigate();
    const { searchResults, searchMade, setSearchMade } = useStateContext()

    // @learning => () results in implicit return: return a vlaue without explicitly using the return keyword
    const formatForUrl = (str) => (
        str
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
            .replace(/^-+|-+$/g, '')    // Remove leading or trailing hyphens
    );


    // to increase code readability
    const handleNavigate = (campaign) => {
        // @note @learning @syntax @crucial new react router allows one to pass state directly through routing
        // this allows one to pass data to the target route without including it in the url
        // The passed state can be accessed in the target component using the useLocation hook from react-router-dom.
        // When you navigate to a new route, the component unmounts, and its props are lost. By passing state through navigation, you ensure the data is available in the new route.
        const urlFriendlyTitle = formatForUrl(campaign.title);
        navigate(`/campaign-details/${urlFriendlyTitle}`, { state: campaign })
    }

    // @custom
    // @crucial @learning display either the search results or all campaigns, depending on whether a search has been made
    const campaignsToDisplay = searchMade ? searchResults : campaigns;


    return (
        <div>
            <h1 className='font-epilogue font-semibold text-[18px] text-white text-left'>
                {title} ({campaignsToDisplay.length})
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

                {/** @custom, for search functionality */}
                {/** If it is not loading and the length is 0, display that there are no campaigns */}
                {!isLoading && campaigns.length > 0 && campaignsToDisplay.length === 0 && (
                    <p className='font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]'>
                        No campaigns matched your search.
                    </p>
                )}

                {/** If it is not loading and the length is 0, display that there are no campaigns */}
                {!isLoading && campaigns.length === 0 && (
                    <p className='font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]'>
                        No campaigns created yet.
                    </p>
                )}

                {/** @learning @crucial function is being used to iterate over each campaign in the campaigns array. For each campaign, a FundCard component is being rendered. */}
                {!isLoading && campaigns.length > 0 && campaignsToDisplay.map((campaign) =>
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