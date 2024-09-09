import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import { CustomButton } from "./";
import { logo, menu, search, thirdweb } from "../assets";
import { navlinks } from "../constants";

import { useStateContext } from '../context';
import { metamaskWallet } from '@thirdweb-dev/react';

const Navbar = () => {

    const { connect, address, contract, getCampaigns, setSearchResults, setSearchMade, ethereum } = useStateContext();

    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    // @custom needed for search func
    const handleSearch = async () => {
        const campaigns = await getCampaigns();
        /**
         * @learning @syntax 
         * 1. filter method creates a new array with all elements that pas the test
         * 2. Object.values returns an array of the given object's own enumerable property values. or example, if campaign is { name: 'Campaign1', description: 'Description1' }, Object.values(campaign) would return ['Campaign1', 'Description1'].
         * 3. some is an array method that tests whether at least one element in the array passes the test implemented by the provided function.
         * 4. If at least one value matches, the campaign is included in the filteredCampaigns array.
         */
        const filteredCampaigns = campaigns.filter((campaign) => {
            return Object.values(campaign).some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase()));
        });

        setSearchResults(filteredCampaigns); // set to state
        setSearchQuery(""); // reset
        setSearchMade(true);

        navigate("/");

        return filteredCampaigns;
    }

    // @custom
    const handleHomeClick = () => {
        setSearchMade(false);
        navigate("/");
    }


    return (
        <div className='flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6'>

            {/** Wrapper for the input field + search icon combo*/}
            <div className='lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-full'>
                {/** Input field */}
                <input
                    type="text"
                    placeholder="Search for campaigns"
                    className='flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    // @note @learning needed so that search is executed also when enter is hit
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                {/** Wrapper for the search icon img */}
                <div
                    className='w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer'
                    onClick={handleSearch}
                >
                    <img
                        src={search}
                        alt="search"
                        className='w-[15px] h-[15px] object-contain'
                    />
                </div>
            </div>

            {/** Wrapper for Button on the right. By default, it is gonna be hidden but appears on small and larger devs. justify.end pushes children to the left*/}
            <div className='sm:flex hidden flex-row justify-end gap-4'>
                <CustomButton
                    btnType="button"
                    // @learning this is not good: title={window.ethereum ? (address ? 'Create a campaign' : 'Connect wallet') : 'Install Metamask to interact'}
                    // The issue here is that window.ethereum is being checked at runtime in the browser. 
                    // However, if Metamask is not installed, window.ethereum will be undefined, which is a falsy value. 
                    // In JavaScript, when you use a ternary operator with a falsy condition, it will always choose the second option.
                    title={typeof ethereum == 'undefined'
                        ? 'Install Metamask'
                        : (address ? 'Create a campaign' : 'Connect wallet')}
                    styles={typeof ethereum === 'undefined'
                        ? 'bg-[#FF6B6B]'
                        : (address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]')}
                    handleClick={() => {
                        // @custom @learning @crucial
                        if (!ethereum) {
                            window.open("https://metamask.io/download/", "_blank");
                        } else if (address) {
                            navigate('create-campaign');
                        } else {
                            connect(metamaskWallet());
                        }
                    }}
                />

                {address ? (
                    <Link to={`/profile/${address}`}>
                        <div className='w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
                            <img
                                src={thirdweb}
                                alt="user"
                                className='w-[60%] h-[60%] object-contain'
                            />
                        </div>
                    </Link>
                ) : (
                    <div className='w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center'>
                        <img
                            src={thirdweb}
                            alt="user"
                            className='w-[60%] h-[60%] object-contain opacity-50'
                        />
                    </div>
                )}
            </div>

            {/** MOBILE MENU @learning */}
            <div className='sm:hidden flex justify-between items-center relative'>
                {/** home icon */}
                <div className='w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
                    <img
                        src={logo}
                        alt="user"
                        className='w-[60%] h-[60%] object-contain'
                        onClick={handleHomeClick}
                    />
                </div>



                {/** hamburger menu icon on the right */}
                <img
                    src={menu}
                    alt="menu"
                    className='w-[34px] h-[34px] object-contain cursor-pointer'
                    onClick={() => setToggleDrawer((prev) => (!prev))}
                />

                {/** dropdown menu for mobile. @learning it behaves differently than the other children. Parents's justify-between does not apply to it, its absolut positioning takes it out of the normal document flow.
                 * If toggleDrawer is not active, its with is 0 */}
                {/** @learning It spans the full width of its container (right-0 left-0 */}
                {/** It has a z-index of 10 to ensure it appears above other elements.  */}
                {/** When toggleDrawer is false, it translates the menu upwards by 100vh (full viewport height), effectively hiding it off-screen. */}
                <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>

                    {/** list of mobile menu items */}
                    <ul className='mb-4'>
                        {navlinks.map((link) => (
                            <li
                                key={link.name}
                                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                                onClick={() => {
                                    setIsActive(link.name);
                                    setToggleDrawer(false);
                                    navigate(link.link);
                                }}
                            >
                                {/** mobile menu item icon */}
                                <img
                                    src={link.imgUrl}
                                    alt={link.name}
                                    className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                                />
                                {/** mobile menu item name */}
                                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>{link.name}</p>
                            </li>
                        ))}
                    </ul>

                    <div className='flex mx-4'>
                        <CustomButton
                            btnType="button"
                            title={typeof ethereum == 'undefined'
                                ? 'Install Metamask'
                                : (address ? 'Create a campaign' : 'Connect wallet')}
                            styles={typeof ethereum === 'undefined'
                                ? 'bg-[#FF6B6B]'
                                : (address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]')}
                            handleClick={() => {
                                // @custom @learning @crucial
                                if (!ethereum) {
                                    window.open("https://metamask.io/download/", "_blank");
                                } else if (address) {
                                    navigate('create-campaign');
                                } else {
                                    connect(metamaskWallet());
                                }
                            }}
                        />

                    </div>
                </div>
            </div>

        </div >
    )
}

export default Navbar