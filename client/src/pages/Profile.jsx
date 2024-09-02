import React, { useEffect, useState } from 'react';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

const Profile = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const { address, contract, getUserCampaigns } = useStateContext();


    // @note @learning needed as cannot call an async function immediately within a useEffect (cannot await)
    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getUserCampaigns();
        setCampaigns(data); // @note setting to the state after getting it
        setIsLoading(false);
    }

    // @note @learning cannot call an async function immediately within a useEffect (cannot await)
    useEffect(() => {
        if (contract) {
            fetchCampaigns();
        }
    }, [address, contract])


    // displays are similar on the Home and Profile pages so we created a reusable component
    return (
        <DisplayCampaigns
            title="Your campaigns"
            isLoading={isLoading}
            campaigns={campaigns}
        />
    )
}

export default Profile