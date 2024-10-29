0. Base info:
   1. Contract deployed to Sepolia at address 0xBa0Cf034b5e50499A845bba5597Ee02354041F31
   2. deployer 0x947A3D447E75f07583943Aa9975DEB0ef18439b4 (account: PP MM)
   3. 

___________________________________________________________________________________________________________



1. WEB3 setup (regged w account: PP MM)
   1. npx thirdweb@latest create --contract
      1. /src
      2. Hardhat
      3. empty contract
   2. If you are using a Node.js project, you should install the dotenv package to automatically load environment variables from a .env file.
      in the web3 folder: npm install dotenv
   3. Create an API KEY on thirdweb, this will output a CLIENT ID and a SECRET_KEY
   More info: https://portal.thirdweb.com/account/api-keys 
   Later on this cannot be retrieved but a few cahrs can be checked at MY API KEYs -> click on it...
      1. @crucial define THIRDWEB_SECRET_KEY in the .env file, do not expose
      2. add thridweb secret key (not directly but by referencing .env) to web3/package.json here (@note this package.json is in the web3 folder):
      "deploy": "npx thirdweb@latest deploy -k ${THIRDWEB_SECRET_KEY}" 
      3. add thirdweb client ID to client/.env as VITE_THIRDWEB_CLIENT_ID=...
      @crucial @learning  VITE_ prefix is a MUST: it used for Vite applications to expose environment variables to the client-side code.
      4. In main, reference this client ID when wrapping the app with the ThirdWebProvider tag

                <ThirdwebProvider
                     activeChain="sepolia"
                     clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
                  >

2. INIT APP
   1. In the client folder: npx thirdweb create --app
      @crucial this set up a Typscript SDK, no javascript is available 
      1. ./
      2. Vite
   2. enable routing by installing: 
      npm install react-router-dom
   3. We get a lot of stuff provided in client/src. But if we want to build from scratch, delete src, then create again, and
      1. npm install @thirdweb-dev/react
   
      2. create main.jsx (since this is typescirpt, tsx instead of jsx @note ), the starting point of eveny React app
   
            import React from "react";
            import { createRoot } from "react-dom/client";
            import { ThirdwebProvider } from "thirdweb/react";
            import { BrowserRouter as Router } from "react-router-dom";

            import App from "./App";
            import './index.css';

            createRoot(document.getElementById("root")!).render(
            <React.StrictMode>
                <ThirdwebProvider>
                <Router>
                    <App />
                </Router>
                </ThirdwebProvider>
            </React.StrictMode>
            );


      2. Create App.jsx (App.tsx), in there write snippet "rafce"
         import React from 'react'

               const App = () => {
               return (
                  <div>App</div>
               )
               }

               export default App

      3. Install Tailwind:
         1. npm install -D tailwindcss postcss autoprefixer
         2. npx tailwindcss init -p
         3. Add the themes provided by the instructor to tailwind.config.js

      4. Create index.css (in src) and 
         1. add the tailwind directives as per https://tailwindcss.com/docs/guides/vite):
            @tailwind base;
            @tailwind components;
            @tailwind utilities;
         2. add extras provided by the instrucotr (gradient, font import) 


       5. Project specific:
          1. Add the assets provided by the instructor to src.  To download them from github, use https://download-directory.github.io/
          2. Create constants folder in src, create index.js therein, add content provided by instructor 
             This file contains no logic, just navigation links.
          3. Create contaxt folder (not really project specific)
             @crucial @learning we here create a React context API that is gonna enable us to use the thirdweb logic within our entire app
          4. Create folders: components, pages
          5. Create folder: utils, therein create: index.js and copy the logic provided by instrucotr
             Contains funcs that we use often in our pages.

       6. Create the files for each page (in page folder), and 
          1. prepare their backbone (rafce)
          2. create the index.js for and export every page

       7. Create the files for each component (in components folder), and
          1. prepare their backbone (rafce)
          2. create the index.js for and export every page
   
       8. Import all pages and components in the App.tsx @crucial @learning at the top of the file, add "// @ts-nocheck" to disable typechecking

       9. 

   

3. START DEVELOPING APP.TSX
   1. Create basic application layout



------------------------------------------------------------------------------------------------------------------------


TOASTIFY: @learning @crucial

1. t's used to display non-blocking notifications (toasts) in React applications.
2. You started using react-toastify instead of a standard JavaScript alert for several important reasons: 
   1. Non-blocking: Toasts are non-blocking notifications, meaning they don't interrupt the user's interaction with your application. Alerts, on the other hand, are modal and block further interaction until dismissed.
   2. Better user experience: Toasts provide a more modern and less intrusive way to show notifications. They can appear and disappear smoothly without disrupting the user's workflow.
   3. Customization: React-toastify offers extensive customization options. You can control the appearance, position, duration, and behavior of notifications, which isn't possible with standard alerts.
   4. Multiple notifications: You can show multiple toasts at once, stacking them neatly, whereas only one alert can be shown at a time.
   5. Different types of notifications
   6. ...













3. WEB3 traditional setup @crucial - BUT NOT USED HERE
   1. forge script ./script/Deployer.s.sol:Deployer --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --etherscan-api-key $ETHERSCAN_API_KEY --verify
   2. verify separately from deployment (did not work at the time: NOTOK, Invlid API Key): @learning
      forge verify-contract 0x38469aabFd538bc989b7E940a45Fd4893a75B40B ./src/Crowdfunding.sol:Crowdfunding --chain 11155111 --watch --etherscan-api-key $ETHERSCAN_API_KEY









