// contains all web3-related logic
// whole app will need to be wrapped with this context so every page can use it

import React, { useContext, createContext } from "react";

import { useAddress, useContract, useConnect, useContractWrite } from "@thirdweb-dev/react";

//import { ethers6Adapter } from "@thirdweb-dev/react";
import { ethers } from "ethers";

// Creates a context object.  Context in React provides a way to pass data through the component tree without having to pass props down manually at every level.
const StateContext = createContext();


// @learning children: allows us to wrap the entire app with the context provider but still render all the children that are inside of it
export const StateContextProvider = ({ children }) => {
    /** everything we need to interact with out smart contract */
    const { contract } = useContract("0xBa0Cf034b5e50499A845bba5597Ee02354041F31");
    const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign");
    const address = useAddress();
    // with this, we can connect a wallet. @note @learning useMetamask() is depracated
    // with useConnect, we need to specify the wallet, like useConnect(metamaskWallet())
    const connect = useConnect();


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


    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();
        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
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
            }}
        >
            {/** @crucial rendering children here */}
            {children}
        </StateContext.Provider>
    )
}

// @crucial so that we can use it
export const useStateContext = () => useContext(StateContext);
