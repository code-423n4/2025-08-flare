# Flare FAssets audit details
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
    - Wardens are encouraged to submit High-risk submissions affecting live code promptly, to ensure timely disclosure of such vulnerabilities to the sponsor and guarantee payout in the case where a sponsor patches a live critical during the audit.
    - Submissions will be hidden from all wardens (SR and non-SR alike) by default, to ensure that no sensitive issues are erroneously shared.
    - If the submissions include findings affecting live code, there will be no post-judging QA phase. This ensures that awards can be distributed in a timely fashion, without compromising the security of the project. (Senior members of C4 staff will review the judges’ decisions per usual.)
    - By default, submissions will not be made public until the report is published.
    - Exception: if the sponsor indicates that no submissions affect live code, then we’ll make submissions visible to all authenticated wardens, and open PJQA to SR wardens per the usual C4 process.
    - [The "live criticals" exception](https://docs.code4rena.com/awarding#the-live-criticals-exception) therefore applies.

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


FAssets bring non-smart contract assets like XRP into DeFi — securely, scalably, and with full custody retained.

This repository is a implementation of the system: solidity contracts for *Flare Foundation* FAsset.

## Details

The FAsset contracts are used to mint assets on top of Flare. The system is designed to handle chains which don’t have smart contract capabilities. Initially, FAsset system will support XRP native asset on XRPL. At a later date BTC, DOGE, add tokens from other blockchains will be added.

The minted FAssets are secured by collateral, which is in the form of ERC20 tokens on Flare/Songbird chain and native tokens (FLR/SGB). The collateral is locked in contracts that guarantee that minted tokens can always be redeemed for underlying assets or compensated by collateral. Underlying assets can also be transferred to Core Vault, a vault on the underlying network. When the underlying is on the Core Vault, the agent doesn’t need to back it with collateral so they can mint again or decide to withdraw this collateral.


Two novel protocols, available on Flare and Songbird blockchains, enable the FAsset system to operate:

- **FTSO** contracts which provide decentralized price feeds for multiple tokens.
- Flare’s **FDC**, which bridges payment data from any connected chain.


## Links

- **Previous audits:**  https://dev.flare.network/support/audits
- **Documentation:** https://dev.flare.network/fassets/overview
- **Tests with sample attack scenarios:** https://github.com/code-423n4/2025-08-flare/blob/main/test/integration/assetManager/AttackScenarios.ts
- **Website:** https://flare.network/
- **X/Twitter:** https://x.com/FlareNetworks

---

# Scope

### Tokens in scope

The FAssets system is able to support wrapped tokens for XRP, BTC and DOGE. However, the initial deployment will only have XRP (FXRP) enabled and that will be the sole scope of this audit competition. Any attacks related to FBTC, FDOGE, or UTXO-based logic in general, are out of scope.

### Files in scope

*See [scope.txt](https://github.com/code-423n4/2025-08-flare/blob/main/scope.txt)*

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

# Additional context

## Areas of concern (where to focus for bugs)
- Bugs in Core Vault logic and interaction
- Bugs in smart contracts, protocol bugs.
- Accounting bugs, mostly when interacting cross chain.

## Main invariants

See [System Design](SystemDesign.md).

## All trusted roles in the protocol

| Role                                | Description                       |
| --------------------------------------- | ---------------------------- |
| Governance (multi-sig)                          | controls protocol settings               |
| Agents                             |  provide minting and redeeming services. While Agents undergo KYC, they cannot be considered fully trusted—especially if significant potential gains could incentivize malicious behavior.                       |

Note that vulnerabilities requiring access to an Agent role without additional modifications to the privileges attributed are open to be downgraded by one level of severity.

## Running tests

```shell
# Clone repository:
git clone https://github.com/code-423n4/2025-08-flare.git
cd 2025-08-flare

# Install dependencies & compile Solidity code:
yarn
yarn c
```

Run tests:
* `yarn testHH` - all tests in Hardhat environment (includes following two types of tests).
* `yarn test_unit_hh` - only unit tests in hardhat environment.
* `yarn test_integration_hh` - only integration tests in hardhat environment.

Check test coverage:
```shell
yarn test-with-coverage
```

## Miscellaneous
Employees of Flare and employees' family members are ineligible to participate in this audit.

Code4rena's rules cannot be overridden by the contents of this README. In case of doubt, please check with C4 staff.
