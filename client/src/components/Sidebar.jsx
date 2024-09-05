import React, { useState } from 'react';
// Link provides declarative, accessible navigation around your application.
// It renders an <a> tag with a real href, so people using the keyboard for navigation or screen readers will still be able to use your app.
// When clicked, Link will navigate to the specified route without a full page reload.
import { Link, useNavigate } from 'react-router-dom';

import { logo, sun } from '../assets';
import { navlinks } from "../constants";

import { useStateContext } from "../context";


const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
    // if Active, we give it a special background color
    // if not disabled, cursor changes to pointer
    // @learning : for the home icon, a different size is specified in the styles prop. Here, the styles prop is applied last in the className string and, hence, overwrites the default
    <div
        className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`}
        onClick={handleClick}
    >
        {!isActive ? (
            <img
                src={imgUrl}
                alt="fund-logo"
                className='w-1/2 h-1/2'
            />
        ) : (
            <img
                src={imgUrl}
                alt="fund-logo"
                className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`}
            />
        )}
    </div >

)


// @note not displayed on small devices
const Sidebar = () => {
    const navigate = useNavigate();
    const { setSearchMade, address } = useStateContext();
    const [isActive, setIsActive] = useState('dashboard');

    // @custom associated with search functionality, needed so if we click the home icon, all campaigns get displayed, not only the search results
    const handleHomeClick = () => {
        setIsActive('dashboard');
        setSearchMade(false); // Reset searchMade to false
    };

    return (
        // Wrapper for the whole sidebar. Sitcky: element does not move when scrolling
        < div className='flex justify-between items-center flex-col sticky top-5 h-[93vh]'>

            {/* home icon @note originally was <Link to="/">*/}
            <Link to="/" onClick={handleHomeClick}>
                <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
            </Link>

            {/* navbar with the other icons spread out from navlinks */}
            <div className='flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12'>
                {/** This inner div specifically contains and arranges the icon components. */}
                <div className='flex flex-col justify-center items-center gap-3'>
                    {navlinks.map((link) => (
                        <Icon
                            key={link.name}
                            {...link}
                            isActive={isActive}
                            handleClick={() => {
                                if (address) {
                                    if (!link.disabled) {
                                        setIsActive(link.name);
                                        if (link.link === "/profile") {
                                            navigate(`/profile/${address}`)
                                        } else {
                                            navigate(link.link);
                                        }
                                    }
                                }
                            }}
                        />
                    ))}
                </div>

                {/** Sun icon placed separately from the rest. */}
                <Icon
                    styles="bg-[#1c1c24] shadow-secondary"
                    imgUrl={sun}
                />
            </div>
        </div >
    )
}

export default Sidebar