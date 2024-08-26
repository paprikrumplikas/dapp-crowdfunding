// @crucial @learning @note the line below disables TypeScript's type checking in the file
// @ts-nocheck


import React from 'react';
import { Route, Routes } from "react-router-dom";

import { CampaignDetails, CreateCampign, Profile, Home } from "./pages";
import { Navbar, Sidebar } from "./components";

const App = () => {
	return (
		<div className='relative sm:-8 p-4 bg-[#13131a] min-h-screen flex-flex-row'>
			{/* Wrapper for the sidebar */}
			<div className='sm:flex hidden mr-10 relative'>
				<Sidebar />
			</div>
			{/* Wrapper for the navbar */}
			<div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
				<Navbar />

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/" element={<Home />} />
					<Route path="/" element={<Home />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</div>
		</div>
	)
}

export default App