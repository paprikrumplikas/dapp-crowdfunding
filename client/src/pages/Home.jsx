import React, { useEffect, useState } from 'react';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

const Home = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const { address, contract, getCampaigns, searchMade } = useStateContext();


    // @note @learning nedded as cannot call an async function immediately within a useEffect (cannot await)
    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getCampaigns();
        setCampaigns(data); // @note setting to the state after getting it
        setIsLoading(false);
    }

    // @note @learning @crucial cannot call an async function immediately within a useEffect (cannot await)
    useEffect(() => {
        if (contract) {
            fetchCampaigns();
        }
    }, [address, contract])


    // displays are similar on the Home and Profile pages so we created a reusable component
    return (
        <div className='flex flex-col'>
            <DisplayCampaigns
                title={!searchMade ? "All active campaigns" : "Search results - in active campaigns"}
                isLoading={isLoading}
                campaigns={campaigns}
                activeOrClosed="active"
            />
            {/** @custom to deisplay active and old campaigns separately */}
            <hr className="my-[80px] border-t border-white my-4" />
            <DisplayCampaigns
                title={!searchMade ? "Closed campaigns" : "Search results - in closed campaigns"}
                isLoading={isLoading}
                campaigns={campaigns}
                activeOrClosed="closed"
            />
        </div>
    )
}

export default Home