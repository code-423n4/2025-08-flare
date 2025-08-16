# Repo setup

## ⭐️ Sponsor: Add code to this repo

- [ ] Create a PR to this repo with the below changes:
- [ ] Confirm that this repo is a self-contained repository with working commands that will build (at least) all in-scope contracts, and commands that will run tests producing gas reports for the relevant contracts.
- [ ] Please have final versions of contracts and documentation added/updated in this repo **no less than 48 business hours prior to audit start time.**
- [ ] Be prepared for a 🚨code freeze🚨 for the duration of the audit — important because it establishes a level playing field. We want to ensure everyone's looking at the same code, no matter when they look during the audit. (Note: this includes your own repo, since a PR can leak alpha to our wardens!)

## ⭐️ Sponsor: Repo checklist

- [ ] Modify the [Overview](#overview) section of this `README.md` file. Describe how your code is supposed to work with links to any relevant documentation and any other criteria/details that the auditors should keep in mind when reviewing. (Here are two well-constructed examples: [Ajna Protocol](https://github.com/code-423n4/2023-05-ajna) and [Maia DAO Ecosystem](https://github.com/code-423n4/2023-05-maia))
- [ ] Optional: pre-record a high-level overview of your protocol (not just specific smart contract functions). This saves wardens a lot of time wading through documentation.
- [ ] Review and confirm the details created by the Scout (technical reviewer) who was assigned to your contest. *Note: any files not listed as "in scope" will be considered out of scope for the purposes of judging, even if the file will be part of the deployed contracts.*  

---

# Flare audit details
- Total Prize Pool: $190,000 in USDC
  - HM awards: up to $168,000 in USDC
    - If no valid Highs or Mediums are found, the HM pool is $0 
  - QA awards: $7,000 in USDC
  - Judge awards: $3,500 in USDC
  - Scout awards: $500 in USDC
  - Mitigation Review: $11,000 in USDC
- [Read our guidelines for more details](https://docs.code4rena.com/competitions)
- Starts August 18, 2025 20:00 UTC
- Ends September 22, 2025 20:00 UTC

**❗ Important notes for wardens** 
1. Since this audit includes live/deployed code, **all submissions will be treated as sensitive**:
    - [The "live criticals" exception](https://docs.code4rena.com/awarding#the-live-criticals-exception) therefore applies. 
    - Wardens are encouraged to submit High-risk submissions affecting live code promptly, to ensure timely disclosure of such vulnerabilities to the sponsor and guarantee payout in the case where a sponsor patches a live critical during the audit.
    - Submissions will be hidden from all wardens (SR and non-SR alike) by default, to ensure that no sensitive issues are erroneously shared.
    - If the submissions include findings affecting live code, there will be no post-judging QA phase. This ensures that awards can be distributed in a timely fashion, without compromising the security of the project. (Senior members of C4 staff will review the judges’ decisions per usual.)
    - By default, submissions will not be made public until the report is published.
    - Exception: if the sponsor indicates that no submissions affect live code, then we’ll make submissions visible to all authenticated wardens, and open PJQA to SR wardens per the usual C4 process.
2. A coded, runnable PoC is required for all High/Medium submissions to this audit. 
    - This repo includes a basic template to run the test suite.
    - PoCs must use the test suite provided in this repo.
    - Your submission will be marked as Insufficient if the POC is not runnable and working with the provided test suite.
    - Exception: PoC is optional (though recommended) for wardens with signal ≥ 0.68.
3. Judging phase risk adjustments (upgrades/downgrades):
    - High- or Medium-risk submissions downgraded by the judge to Low-risk (QA) will be ineligible for awards.
    - Upgrading a Low-risk finding from a QA report to a Medium- or High-risk finding is not supported.
    - As such, wardens are encouraged to select the appropriate risk level carefully during the submission phase.

## Automated Findings / Publicly Known Issues

The 4naly3er report can be found [here](https://github.com/code-423n4/2025-08-flare/blob/main/4naly3er-report.md).

_Note for C4 wardens: Anything included in this `Automated Findings / Publicly Known Issues` section is considered a publicly known issue and is ineligible for awards._


# Overview

[ ⭐️ SPONSORS: add info here ]

## Links

- **Previous audits:**  https://dev.flare.network/support/audits
  - ✅ SCOUTS: If there are multiple report links, please format them in a list.
- **Documentation:** https://dev.flare.network/fassets/overview
- **Website:** https://flare.network/
- **X/Twitter:** https://x.com/FlareNetworks

---

# Scope

[ ✅ SCOUTS: add scoping and technical details here ]

### Files in scope
- ✅ This should be completed using the `metrics.md` file
- ✅ Last row of the table should be Total: SLOC
- ✅ SCOUTS: Have the sponsor review and and confirm in text the details in the section titled "Scoping Q amp; A"

*For sponsors that don't use the scoping tool: list all files in scope in the table below (along with hyperlinks) -- and feel free to add notes to emphasize areas of focus.*

| Contract | SLOC | Purpose | Libraries used |  
| ----------- | ----------- | ----------- | ----------- |
| [contracts/folder/sample.sol](https://github.com/code-423n4/repo-name/blob/contracts/folder/sample.sol) | 123 | This contract does XYZ | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |

### Files out of scope
✅ SCOUTS: List files/directories out of scope

# Additional context

## Areas of concern (where to focus for bugs)
Bugs in Core Vault logic and interaction. Bugs in smart contracts, protocol bugs. Accounting bugs, mostly when interacting cross chain.

✅ SCOUTS: Please format the response above 👆 so its not a wall of text and its readable.

## Main invariants

TODO

✅ SCOUTS: Please format the response above 👆 so its not a wall of text and its readable.

## All trusted roles in the protocol

- Governance (multi-sig): controls protocol settings.
- Agents: provide minting and redeeming services. While Agents undergo KYC, they cannot be considered fully trusted—especially if significant potential gains could incentivize malicious behavior.

✅ SCOUTS: Please format the response above 👆 using the template below👇

| Role                                | Description                       |
| --------------------------------------- | ---------------------------- |
| Owner                          | Has superpowers                |
| Administrator                             | Can change fees                       |

✅ SCOUTS: Please format the response above 👆 so its not a wall of text and its readable.

## Running tests

Clone repository (TODO: check correct link):
```
git clone https://github.com/code-423n4/2025-08-flare.git
```

Install dependencies & compile Solidity code:
```
yarn
yarn c
```

Run tests:
* `yarn testHH` - all tests in Hardhat environment (includes following two types of tests).
* `yarn test_unit_hh` - only unit tests in hardhat environment.
* `test_integration_hh` - only integration tests in hardhat environment.

Check test coverage:
```
yarn cov
```

✅ SCOUTS: Please format the response above 👆 using the template below👇

```bash
git clone https://github.com/code-423n4/2023-08-arbitrum
git submodule update --init --recursive
cd governance
foundryup
make install
make build
make sc-election-test
```
To run code coverage
```bash
make coverage
```

✅ SCOUTS: Add a screenshot of your terminal showing the test coverage

## Miscellaneous
Employees of Flare and employees' family members are ineligible to participate in this audit.

Code4rena's rules cannot be overridden by the contents of this README. In case of doubt, please check with C4 staff.

TODO

✅ SCOUTS: Please format the response above 👆 so its not a wall of text and its readable.


# Scope

*See [scope.txt](https://github.com/code-423n4/2025-08-flare/blob/main/scope.txt)*

### Files in scope


| File   | Logic Contracts | Interfaces | nSLOC | Purpose | Libraries used |
| ------ | --------------- | ---------- | ----- | -----   | ------------ |
| /contracts/assetManager/facets/AgentAlwaysAllowedMintersFacet.sol | 1| **** | 19 | |@openzeppelin/contracts/utils/structs/EnumerableSet.sol|
| /contracts/assetManager/facets/AgentCollateralFacet.sol | 1| **** | 121 | |@openzeppelin/contracts/token/ERC20/IERC20.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/AgentInfoFacet.sol | 1| **** | 130 | |@openzeppelin/contracts/token/ERC20/IERC20.sol<br>@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/AgentPingFacet.sol | 1| **** | 13 | ||
| /contracts/assetManager/facets/AgentSettingsFacet.sol | 1| **** | 109 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/AgentVaultAndPoolSupportFacet.sol | 1| **** | 40 | |@openzeppelin/contracts/token/ERC20/IERC20.sol|
| /contracts/assetManager/facets/AgentVaultManagementFacet.sol | 1| **** | 186 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/AssetManagerBase.sol | 1| **** | 38 | ||
| /contracts/assetManager/facets/AssetManagerDiamondCutFacet.sol | 1| **** | 10 | ||
| /contracts/assetManager/facets/AssetManagerInit.sol | 1| **** | 45 | |@flarenetwork/flare-periphery-contracts/flare/IGovernanceSettings.sol<br>@openzeppelin/contracts/utils/introspection/IERC165.sol|
| /contracts/assetManager/facets/AvailableAgentsFacet.sol | 1| **** | 98 | |@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/ChallengesFacet.sol | 1| **** | 126 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/CollateralReservationsFacet.sol | 1| **** | 121 | |@openzeppelin/contracts/utils/math/SafeCast.sol<br>@openzeppelin/contracts/utils/structs/EnumerableSet.sol|
| /contracts/assetManager/facets/CollateralTypesFacet.sol | 1| **** | 48 | |@openzeppelin/contracts/token/ERC20/IERC20.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/CoreVaultClientFacet.sol | 1| **** | 156 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol<br>@openzeppelin/contracts/utils/math/Math.sol|
| /contracts/assetManager/facets/CoreVaultClientSettingsFacet.sol | 1| **** | 105 | |@openzeppelin/contracts/utils/introspection/IERC165.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/EmergencyPauseFacet.sol | 1| **** | 60 | |@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/EmergencyPauseTransfersFacet.sol | 1| **** | 62 | |@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/LiquidationFacet.sol | 1| **** | 110 | |@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/MintingDefaultsFacet.sol | 1| **** | 82 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol|
| /contracts/assetManager/facets/MintingFacet.sol | 1| **** | 135 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/RedemptionConfirmationsFacet.sol | 1| **** | 124 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/RedemptionDefaultsFacet.sol | 1| **** | 74 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/RedemptionRequestsFacet.sol | 1| **** | 170 | |@openzeppelin/contracts/utils/math/Math.sol<br>@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/RedemptionTimeExtensionFacet.sol | 1| **** | 40 | |@openzeppelin/contracts/utils/introspection/IERC165.sol|
| /contracts/assetManager/facets/SettingsManagementFacet.sol | 1| **** | 326 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/SettingsReaderFacet.sol | 1| **** | 33 | |@openzeppelin/contracts/token/ERC20/IERC20.sol|
| /contracts/assetManager/facets/SystemInfoFacet.sol | 1| **** | 104 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/SystemStateManagementFacet.sol | 1| **** | 21 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/UnderlyingBalanceFacet.sol | 1| **** | 89 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/facets/UnderlyingTimekeepingFacet.sol | 1| **** | 18 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol|
| /contracts/assetManager/implementation/AssetManager.sol | 1| **** | 10 | ||
| /contracts/assetManager/library/AgentBacking.sol | 1| **** | 65 | ||
| /contracts/assetManager/library/AgentCollateral.sol | 1| **** | 138 | |@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/token/ERC20/IERC20.sol|
| /contracts/assetManager/library/AgentPayout.sol | 1| **** | 39 | |@openzeppelin/contracts/utils/math/Math.sol|
| /contracts/assetManager/library/AgentUpdates.sol | 1| **** | 73 | |@openzeppelin/contracts/utils/math/SafeCast.sol<br>@openzeppelin/contracts/token/ERC20/IERC20.sol|
| /contracts/assetManager/library/Agents.sol | 1| **** | 123 | |@openzeppelin/contracts/utils/math/SafeCast.sol<br>@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/token/ERC20/IERC20.sol|
| /contracts/assetManager/library/CollateralTypes.sol | 1| **** | 128 | |@openzeppelin/contracts/utils/math/SafeCast.sol<br>@openzeppelin/contracts/token/ERC20/IERC20.sol|
| /contracts/assetManager/library/Conversion.sol | 1| **** | 102 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/library/CoreVaultClient.sol | 1| **** | 113 | |@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol<br>@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol|
| /contracts/assetManager/library/Globals.sol | 1| **** | 36 | ||
| /contracts/assetManager/library/Liquidation.sol | 1| **** | 104 | |@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/library/LiquidationPaymentStrategy.sol | 1| **** | 39 | |@openzeppelin/contracts/utils/math/Math.sol|
| /contracts/assetManager/library/Minting.sol | 1| **** | 72 | |@openzeppelin/contracts/token/ERC20/IERC20.sol|
| /contracts/assetManager/library/RedemptionDefaults.sol | 1| **** | 82 | |@openzeppelin/contracts/utils/math/Math.sol|
| /contracts/assetManager/library/RedemptionQueueInfo.sol | 1| **** | 43 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/library/RedemptionRequests.sol | 1| **** | 95 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/library/Redemptions.sol | 1| **** | 112 | ||
| /contracts/assetManager/library/SettingsInitializer.sol | 1| **** | 80 | ||
| /contracts/assetManager/library/SettingsUpdater.sol | 1| **** | 27 | ||
| /contracts/assetManager/library/SettingsValidators.sol | 1| **** | 25 | ||
| /contracts/assetManager/library/TransactionAttestation.sol | 1| **** | 52 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol|
| /contracts/assetManager/library/UnderlyingBalance.sol | 1| **** | 32 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/library/UnderlyingBlockUpdater.sol | 1| **** | 39 | |@openzeppelin/contracts/utils/math/SafeCast.sol<br>@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol|
| /contracts/assetManager/library/data/Agent.sol | 1| **** | 89 | |@openzeppelin/contracts/utils/structs/EnumerableSet.sol|
| /contracts/assetManager/library/data/AssetManagerState.sol | 1| **** | 44 | ||
| /contracts/assetManager/library/data/Collateral.sol | 1| **** | 18 | ||
| /contracts/assetManager/library/data/CollateralReservation.sol | 1| **** | 25 | ||
| /contracts/assetManager/library/data/CollateralTypeInt.sol | 1| **** | 17 | |@openzeppelin/contracts/token/ERC20/IERC20.sol|
| /contracts/assetManager/library/data/PaymentConfirmations.sol | 1| **** | 31 | |@flarenetwork/flare-periphery-contracts/flare/IFdcVerification.sol|
| /contracts/assetManager/library/data/PaymentReference.sol | 1| **** | 52 | ||
| /contracts/assetManager/library/data/Redemption.sol | 1| **** | 33 | ||
| /contracts/assetManager/library/data/RedemptionQueue.sol | 1| **** | 88 | ||
| /contracts/assetManager/library/data/RedemptionTimeExtension.sol | 1| **** | 37 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/library/data/UnderlyingAddressOwnership.sol | 1| **** | 19 | ||
| /contracts/assetManager/library/mock/ConversionMock.sol | 1| **** | 24 | |@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/assetManager/library/mock/RedemptionQueueMock.sol | 1| **** | 15 | ||
| /contracts/governance/implementation/Governed.sol | 1| **** | 8 | |@flarenetwork/flare-periphery-contracts/flare/IGovernanceSettings.sol|
| /contracts/governance/implementation/GovernedBase.sol | 1| **** | 133 | |@flarenetwork/flare-periphery-contracts/flare/IGovernanceSettings.sol|
| /contracts/governance/implementation/GovernedProxyImplementation.sol | 1| **** | 8 | ||
| /contracts/governance/implementation/GovernedUUPSProxyImplementation.sol | 1| **** | 22 | |@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol|
| /contracts/fassetToken/implementation/CheckPointable.sol | 1| **** | 77 | ||
| /contracts/fassetToken/implementation/FAsset.sol | 1| **** | 125 | |@openzeppelin/contracts/token/ERC20/ERC20.sol<br>@openzeppelin/contracts/token/ERC20/IERC20.sol<br>@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol<br>@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol<br>@openzeppelin/contracts/utils/introspection/IERC165.sol<br>@openzeppelin/contracts/interfaces/IERC5267.sol<br>@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol<br>@flarenetwork/flare-periphery-contracts/flare/token/interfaces/IICleanable.sol|
| /contracts/fassetToken/implementation/FAssetProxy.sol | 1| **** | 18 | |@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol|
| /contracts/fassetToken/library/CheckPointHistory.sol | 1| **** | 88 | |@openzeppelin/contracts/utils/math/Math.sol<br>@openzeppelin/contracts/utils/math/SafeCast.sol|
| /contracts/fassetToken/library/CheckPointsByAddress.sol | 1| **** | 38 | ||
| /contracts/utils/Imports_Solidity_0_6.sol | ****| **** | 2 | |@gnosis.pm/mock-contract/contracts/MockContract.sol|
| /contracts/utils/library/MathUtils.sol | 1| **** | 19 | ||
| /contracts/utils/library/MerkleTree.sol | 1| **** | 69 | ||
| /contracts/utils/library/SafeMath64.sol | 1| **** | 22 | ||
| /contracts/utils/library/SafePct.sol | 1| **** | 30 | ||
| /contracts/utils/library/Transfers.sol | 1| **** | 22 | ||
| **Totals** | **81** | **** | **5615** | | |

### Files out of scope

*See [out_of_scope.txt](https://github.com/code-423n4/2025-08-flare/blob/main/out_of_scope.txt)*

| File         |
| ------------ |
| ./contracts/agentOwnerRegistry/implementation/AgentOwnerRegistry.sol |
| ./contracts/agentOwnerRegistry/implementation/AgentOwnerRegistryProxy.sol |
| ./contracts/agentVault/implementation/AgentVault.sol |
| ./contracts/agentVault/implementation/AgentVaultFactory.sol |
| ./contracts/agentVault/interfaces/IIAgentVault.sol |
| ./contracts/agentVault/interfaces/IIAgentVaultFactory.sol |
| ./contracts/agentVault/mock/AgentVaultMock.sol |
| ./contracts/assetManager/interfaces/IIAssetManager.sol |
| ./contracts/assetManager/interfaces/IISettingsManagement.sol |
| ./contracts/assetManager/mock/AssetManagerMock.sol |
| ./contracts/assetManager/mock/DistributionToDelegatorsMock.sol |
| ./contracts/assetManager/mock/MaliciousDistributionToDelegators.sol |
| ./contracts/assetManager/mock/MaliciousExecutor.sol |
| ./contracts/assetManager/mock/MaliciousMintExecutor.sol |
| ./contracts/assetManager/mock/MaliciousRewardManager.sol |
| ./contracts/assetManager/mock/MintingProxyMock.sol |
| ./contracts/assetManager/mock/RewardManagerMock.sol |
| ./contracts/assetManagerController/implementation/AssetManagerController.sol |
| ./contracts/assetManagerController/implementation/AssetManagerControllerProxy.sol |
| ./contracts/assetManagerController/interfaces/IIAssetManagerController.sol |
| ./contracts/collateralPool/implementation/CollateralPool.sol |
| ./contracts/collateralPool/implementation/CollateralPoolFactory.sol |
| ./contracts/collateralPool/implementation/CollateralPoolToken.sol |
| ./contracts/collateralPool/implementation/CollateralPoolTokenFactory.sol |
| ./contracts/collateralPool/interfaces/IICollateralPool.sol |
| ./contracts/collateralPool/interfaces/IICollateralPoolFactory.sol |
| ./contracts/collateralPool/interfaces/IICollateralPoolToken.sol |
| ./contracts/collateralPool/interfaces/IICollateralPoolTokenFactory.sol |
| ./contracts/coreVaultManager/implementation/CoreVaultManager.sol |
| ./contracts/coreVaultManager/implementation/CoreVaultManagerProxy.sol |
| ./contracts/coreVaultManager/interfaces/IICoreVaultManager.sol |
| ./contracts/diamond/facets/DiamondLoupeFacet.sol |
| ./contracts/diamond/implementation/Diamond.sol |
| ./contracts/diamond/interfaces/IDiamond.sol |
| ./contracts/diamond/interfaces/IDiamondCut.sol |
| ./contracts/diamond/interfaces/IDiamondLoupe.sol |
| ./contracts/diamond/library/LibDiamond.sol |
| ./contracts/diamond/mock/DiamondCutFacet.sol |
| ./contracts/diamond/mock/DiamondInit.sol |
| ./contracts/diamond/mock/MockDiamond.sol |
| ./contracts/diamond/mock/Test1Facet.sol |
| ./contracts/diamond/mock/Test2Facet.sol |
| ./contracts/diamond/mock/TestLib.sol |
| ./contracts/fassetToken/interfaces/IICheckPointable.sol |
| ./contracts/fassetToken/interfaces/IIFAsset.sol |
| ./contracts/fassetToken/mock/CheckPointHistoryMock.sol |
| ./contracts/fassetToken/mock/CheckPointableMock.sol |
| ./contracts/fassetToken/mock/CheckPointsByAddressMock.sol |
| ./contracts/fdc/mock/FdcHubMock.sol |
| ./contracts/fdc/mock/FdcRequestFeeConfigurationsMock.sol |
| ./contracts/fdc/mock/FdcVerificationMock.sol |
| ./contracts/fdc/mock/RelayMock.sol |
| ./contracts/flareSmartContracts/implementation/AddressUpdatable.sol |
| ./contracts/flareSmartContracts/interfaces/IAddressUpdatable.sol |
| ./contracts/flareSmartContracts/interfaces/IWNat.sol |
| ./contracts/flareSmartContracts/mock/AddressUpdatableMock.sol |
| ./contracts/flareSmartContracts/mock/AddressUpdaterMock.sol |
| ./contracts/flareSmartContracts/mock/GovernanceSettingsMock.sol |
| ./contracts/flareSmartContracts/mock/WNatMock.sol |
| ./contracts/ftso/implementation/FtsoV2PriceStore.sol |
| ./contracts/ftso/implementation/FtsoV2PriceStoreProxy.sol |
| ./contracts/ftso/interfaces/IPriceChangeEmitter.sol |
| ./contracts/ftso/interfaces/IPricePublisher.sol |
| ./contracts/ftso/interfaces/IPriceReader.sol |
| ./contracts/ftso/mock/FakePriceReader.sol |
| ./contracts/ftso/mock/FtsoV2PriceStoreMock.sol |
| ./contracts/governance/interfaces/IGoverned.sol |
| ./contracts/governance/mock/GovernedMock.sol |
| ./contracts/governance/mock/GovernedWithTimelockMock.sol |
| ./contracts/userInterfaces/IAgentAlwaysAllowedMinters.sol |
| ./contracts/userInterfaces/IAgentOwnerRegistry.sol |
| ./contracts/userInterfaces/IAgentPing.sol |
| ./contracts/userInterfaces/IAgentVault.sol |
| ./contracts/userInterfaces/IAssetManager.sol |
| ./contracts/userInterfaces/IAssetManagerController.sol |
| ./contracts/userInterfaces/IAssetManagerEvents.sol |
| ./contracts/userInterfaces/ICollateralPool.sol |
| ./contracts/userInterfaces/ICollateralPoolToken.sol |
| ./contracts/userInterfaces/ICoreVaultClient.sol |
| ./contracts/userInterfaces/ICoreVaultClientSettings.sol |
| ./contracts/userInterfaces/ICoreVaultManager.sol |
| ./contracts/userInterfaces/IFAsset.sol |
| ./contracts/userInterfaces/IRedemptionTimeExtension.sol |
| ./contracts/userInterfaces/data/AgentInfo.sol |
| ./contracts/userInterfaces/data/AgentSettings.sol |
| ./contracts/userInterfaces/data/AssetManagerSettings.sol |
| ./contracts/userInterfaces/data/AvailableAgentInfo.sol |
| ./contracts/userInterfaces/data/CollateralReservationInfo.sol |
| ./contracts/userInterfaces/data/CollateralType.sol |
| ./contracts/userInterfaces/data/RedemptionRequestInfo.sol |
| ./contracts/userInterfaces/data/RedemptionTicketInfo.sol |
| ./contracts/utils/interfaces/IUUPSUpgradeable.sol |
| ./contracts/utils/interfaces/IUpgradableContractFactory.sol |
| ./contracts/utils/interfaces/IUpgradableProxy.sol |
| ./contracts/utils/mock/CustomErrorMock.sol |
| ./contracts/utils/mock/ERC20Mock.sol |
| ./contracts/utils/mock/FakeERC20.sol |
| ./contracts/utils/mock/MathUtilsMock.sol |
| ./contracts/utils/mock/MerkleTreeMock.sol |
| ./contracts/utils/mock/MockProxyFactory.sol |
| ./contracts/utils/mock/SafeMath64Mock.sol |
| ./contracts/utils/mock/SafePctMock.sol |
| ./contracts/utils/mock/SuicidalMock.sol |
| ./contracts/utils/mock/TestUUPSProxyImpl.sol |
| ./contracts/utils/mock/TransfersMock.sol |
| ./test-forge/collateralPool/implementation/CollateralPool.t.sol |
| ./test-forge/collateralPool/implementation/CollateralPoolHandler.t.sol |
| ./test-forge/coreVaultManager/implementation/CoreVaultManager.t.sol |
| ./test-forge/coreVaultManager/implementation/CoreVaultManagerHandler.t.sol |
| ./test-forge/ftso/implementation/FtsoV2PriceStore.t.sol |
| ./test-forge/ftso/implementation/FtsoV2PriceStoreHandler.t.sol |
| ./test-forge/ftso/implementation/FtsoV2PriceStoreInvariant.t.sol |
| Totals: 112 |

