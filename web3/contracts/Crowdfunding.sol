// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Crowdfunding {
    // campaign struct
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    // Mappings
    mapping(uint256 => Campaign) public campaigns;

    // Events @custom
    event NewCampaign(
        address indexed owner, string indexed title, string description, uint256 indexed target, uint256 deadline
    );
    event NewDonation(address indexed donator, uint256 indexed campaignIndex, uint256 indexed amount);

    // so that we can give IDs to out campaigns
    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) external returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "The deadline should be a date in the future."); // @custom

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;

        emit NewCampaign(_owner, _title, _description, _target, _deadline);

        numberOfCampaigns += 1;

        return (numberOfCampaigns - 1);
    }

    // @note payable!
    function donateToCampaign(uint256 _id) external payable returns (uint256) {
        require(_id < numberOfCampaigns, "There is no campaign with such an _id."); // @custom
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        // send the amount
        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amountCollected += amount;
        }

        emit NewDonation(msg.sender, _id, amount); // @custom

        return campaign.amountCollected;
    }

    function getDonators(uint256 _id) external view returns (address[] memory, uint256[] memory) {
        require(_id < numberOfCampaigns, "There is no campaign with such an _id."); // @custom
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns); // creating an empty array

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i]; // @custom
        }

        return allCampaigns;
    }
}
