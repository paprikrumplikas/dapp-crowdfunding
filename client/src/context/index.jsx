// contains all web3-related logic
// whole app will need to be wrapped with this context so every page can use it

import React, { useContext, createContext } from "react";

import { useAddress, useContract, useMetamask, useContractWrite } from "@thirdweb-dev/react";

//import { ethers6Adapter } from "@thirdweb-dev/react";
import { ethers } from "ethers";

// Creates a context object.  Context in React provides a way to pass data through the component tree without having to pass props down manually at every level.
const StateContext = createContext();


// @learning children: allows us to wrap the entire app with the context provider but still render all the children that are inside of it
export const StateContextProvider = ({ children }) => {
    /** everything we need to interact with out smart contract */
    const { contract } = useContract("0xBa0Cf034b5e50499A845bba5597Ee02354041F31");
    const { mutateAsync: createCampaign } = useContractWrite(contract, "CreateCampaign");
    const address = useAddress();
    const connect = useMetamask();     // with this, we can connect a wallet


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

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign // renaming publichCampaign to cC
            }}
        >
            {/** @crucial rendering children here */}
            {children}
        </StateContext.Provider>
    )
}

// @crucial so that we can use it
export const useStateContext = () => useContext(StateContext);
