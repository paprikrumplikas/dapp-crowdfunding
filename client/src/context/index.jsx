// contains all web3-related logic
// whole app will need to be wrapped with this context so every page can use it

import React, { useContext, createContext, useState, useEffect } from "react";

import { useAddress, useContract, useConnect, useContractWrite } from "@thirdweb-dev/react";

//import { ethers6Adapter } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import { metamaskWallet } from '@thirdweb-dev/react';


// Creates a context object.  Context in React provides a way to pass data through the component tree without having to pass props down manually at every level.
const StateContext = createContext();


// @learning children: allows us to wrap the entire app with the context provider but still render all the children that are inside of it
export const StateContextProvider = ({ children }) => {
    /** everything we need to interact with out smart contract */
    const { contract } = useContract("0xBa0Cf034b5e50499A845bba5597Ee02354041F31");
    const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign");
    const address = useAddress();
    // @custom
    // const [activeAccount, setActiveAccount] = useState(null);
    // with this, we can connect a wallet. @note @learning useMetamask() is depracated
    // with useConnect, we need to specify the wallet, like useConnect(metamaskWallet()), see in Navbar
    // @crucial If you have a wallet connected to your dApp, but it's not the active wallet in your browser extension, the useAddress() hook should still return the address of the connected wallet, not the active one in the extension.
    // @bug this cases an issue that if the active account is unconnected everything will be displayed as if the connected account were active
    const connect = useConnect();

    const [searchResults, setSearchResults] = useState([]); // @custom needed for the search functionality
    const [searchMade, setSearchMade] = useState(false); // @custom needed for the search functionality


    const publishCampaign = async (form) => {
        try {
            // we have to pass them in the rifht order
            const data = await (createCampaign({
                args: [
                    address,
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image
                ]
            }))

            console.log("Contract call success", data);
        } catch (error) {
            console.log("Contract call failure", error);
        }
    }


    const getCampaigns = async () => {
        // @note @learning way to call a read function
        const campaigns = await contract.call('getCampaigns');

        // format to filter out only relevant data and format it.
        // immediately returns and object, hence why => ({})
        // @learning @syntax i is for index
        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i // project id is the index
        }));

        return parsedCampaigns;
    }


    const getUserCampaigns = async (anyAddress) => {
        const allCampaigns = await getCampaigns();
        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === anyAddress);

        return filteredCampaigns;
    }


    const donate = async (pid, amount) => {
        // @learning @crucial the 2nd param is an object, representing tx options. Value field specifies the ether to be sent with the tc
        const data = await contract.call('donateToCampaign', [pid], { value: ethers.utils.parseEther(amount) });
        return data;
    }


    const getDonations = async (pId) => {

        // @note this returns 2 arrays. donations[0] references the donators array, donations[1] references the donations array
        const donations = await contract.call('getDonators', [pId]);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }


    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign, // renaming publichCampaign to cC
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                searchResults, setSearchResults,
                searchMade, setSearchMade,
            }}
        >
            {/** @crucial rendering children here */}
            {children}
        </StateContext.Provider>
    )
}

// @crucial so that we can use it
export const useStateContext = () => useContext(StateContext);
