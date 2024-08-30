import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ethers } from "ethers";

import { money } from "../assets";
import { CustomButton } from '../components';
import { checkIfImage } from "../utils";
import FormField from '../components/FormField';
import { useStateContext } from '../context';



const CreateCampaign = () => {
    const { createCampaign, address } = useStateContext();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: "",
    })

    // @custom to keep form data until there is a submission
    useEffect(() => {
        // Load form data from localStorage when component mounts
        const savedForm = localStorage.getItem(`campaignForm_${address}`);
        if (savedForm) {
            setForm(JSON.parse(savedForm));
        }
    }, [address]);

    // @custom
    useEffect(() => {
        // Save form data to localStorage whenever it changes
        localStorage.setItem(`campaignForm_${address}`, JSON.stringify(form));
    }, [form, address]);

    // whenever a form field is changing, update the form
    const handleFormFieldChange = (fieldName, e) => {
        // first spread out the form, then change ONLY the special name of the field that changed
        setForm({ ...form, [fieldName]: e.target.value });
    }


    // submission happens instantly as of our button is of type "submit"
    const handleSubmit = async (e) => {
        // @learning to prevent reloading the page after form submission. In react, we never want this
        e.preventDefault();
        console.log(form);

        // check if image url is valid
        checkIfImage(form.image, async (exists) => {
            if (exists) {
                // set loading
                setIsLoading(true);
                try {
                    await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) });
                    // @custom Clear the form data from localStorage after successful submission
                    localStorage.removeItem(`campaignForm_${address}`);
                    setIsLoading(false);
                    navigate("/");
                } catch (error) {
                    console.error("Campaign creation failed:", error);
                    setIsLoading(false);
                    alert("Campaign creation failed. Please try again.");
                }
            } else {
                alert("Provide valid image url!");
                // clear the url
                setForm({ ...form, image: "" });
            }
        })

    };


    return (
        <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
            {/**If it is loading, show the loader */}
            {isLoading && 'Loader...'}

            {/** Header */}
            <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
                <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Start a Campaign!</h1>
            </div>

            {/** Form */}
            <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
                {/** Some input fields take only half of the screen if it is big enough, so there are 2 next to each other
                 * If screen is not big enough, they will just wrap */}
                <div className='flex flex-wrap gap-[40px]'>
                    <FormField
                        labelName="Your Name *"
                        placeHolder="John Doe"
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => { handleFormFieldChange('name', e) }}
                    />
                    <FormField
                        labelName="Campaign Title *"
                        placeHolder="Write a title"
                        inputType="text"
                        value={form.title}
                        handleChange={(e) => { handleFormFieldChange('title', e) }}
                    />
                </div>

                <FormField
                    labelName="Story *"
                    placeHolder="Write your story"
                    isTextArea
                    value={form.description}
                    handleChange={(e) => { handleFormFieldChange('description', e) }}
                />

                {/** Banner */}
                <div className='w-full flex justify-center items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]'>
                    <img
                        src={money}
                        alt="money"
                        className='w-[40px] h-[40px] object-contain'
                    />
                    <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>
                        You will get 100% of the raised amount!
                    </h4>
                </div>

                {/** Some input fields take only half of the screen if it is big enough, so there are 2 next to each other
                 * If screen is not big enough, they will just wrap */}
                <div className='flex flex-wrap gap-[40px]'>
                    <FormField
                        labelName="Target Amount *"
                        placeHolder="ETH 0.5"
                        step="0.1"
                        inputType="number"
                        value={form.target}
                        handleChange={(e) => { handleFormFieldChange('target', e) }}
                    />
                    <FormField
                        labelName="End Date *"
                        placeHolder="End Date"
                        inputType="date"
                        value={form.deadline}
                        handleChange={(e) => { handleFormFieldChange('deadline', e) }}
                    />
                </div>

                <FormField
                    labelName="Campaign Image *"
                    placeHolder="Specify an image URL for your campaign"
                    inputType="url"
                    value={form.image}
                    handleChange={(e) => { handleFormFieldChange('image', e) }}
                />

                <div className='flex justify-center items-center mt-[40px]'>
                    <CustomButton
                        btnType="submit"
                        title="Submit new campaign"
                        styles="bg-[#1dc071]"
                    />
                </div>
            </form>
        </div>
    )
}

export default CreateCampaign;