import React, { useEffect, useState } from 'react';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

// @custom needed to get access to the addr parameeter from the routing
import { useParams } from 'react-router-dom';

const Profile = () => {

    const { addr } = useParams(); // @custom


    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const { address, contract, getUserCampaigns } = useStateContext();


    // @note @learning needed as cannot call an async function immediately within a useEffect (cannot await)
    // anyAddress signifies that we dont neccesrily fetch the campaigns created by the connected address
    const fetchCampaigns = async (anyAddress) => {
        setIsLoading(true);
        const data = await getUserCampaigns(anyAddress);
        setCampaigns(data); // @note setting to the state after getting it
        setIsLoading(false);
    }

    // @note @learning cannot call an async function immediately within a useEffect (cannot await)
    useEffect(() => {
        if (contract) {
            fetchCampaigns(addr);
        }
    }, [address, contract])


    // displays are similar on the Home and Profile pages so we created a reusable component
    return (
        <div className='flex flex-col'>
            <DisplayCampaigns
                // @custom @crucial not the ? after the address
                title={address?.toLowerCase() === addr.toLowerCase() ? "Your active campaigns" : `Active campaigns created by ${addr}`}
                isLoading={isLoading}
                campaigns={campaigns}
                activeOrClosed="active"
            />
            <hr className="my-[80px] border-t border-white my-4" />
            <DisplayCampaigns
                // @custom @crucial not the ? after the address
                title={address?.toLowerCase() === addr.toLowerCase() ? "Your closed campaigns" : `Closed campaigns created by ${addr}`}
                isLoading={isLoading}
                campaigns={campaigns}
                activeOrClosed="closed"

            />
        </div>
    )
}

export default Profile