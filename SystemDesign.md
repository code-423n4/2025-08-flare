# FAssets System Design

The following provides a description of the high-level components of the system and how they interact, including details like a function's externally controllable inputs and how an attacker could leverage each input to cause harm or which invariants or constraints of the system are critical and must always be upheld.

## AssetManager

### Component: Reserve collateral
#### Description
This component is responsible for reserving collateral to mint the FAssets after the underlying payment is completed. The reservation collateral flow is as follows:

1. The minter picks an agent from the publicly available agent list (or if the agent has always allowed the minter by adding the minter to the `alwaysAllowedMinters` by calling `addAlwaysAllowedMinterForAgent`).
2. The minter sends a collateral reservation transaction (CRT), which includes the
   following:
    - `_agentVault`, the agent-vault address
    - `_lots`, the number of lots for which to reserve collateral
    - `_maxMintingFeeBIPS`, the maximum minting fee (BIPS) that can be charged by the agent
    - `_executor`, the account that is allowed to execute minting (besides minter and agent)
3. The contract locks the agent's collateral until the underlying payment is proved or disproved.
4. The function `reserveCollateral` emits the `IAssetManagerEvents.CollateralReserved` event, which contains relevant information for the CRT.

#### Invariants
The following invariants must hold true during the process:
1. An agent must be whitelisted.
2. Minting should not be paused.
3. Either the agent should be available or the minter should be whitelisted by the agent.
4. There should be enough free collateral in the agent's vault or pool to mint the required lots.
5. The agent status should be `NORMAL`.
6. The provided `_maxMintingFeeBIPS` should be greater than the agent's `feeBIPS`.
7. For public minting, the native tokens provided should be greater than the collateral reservation fee.
8. The lots requested should not exceed the global minting cap.

### Component: Minting
#### Description
This component is responsible for minting FAssets. There are three types of minting:

1. **Public minting using CRT**. A minter reserves collateral, and after transferring, the underlying would get the minted FAssets.
2. **Self-mint**. An agent can mint tokens to themselves by transferring tokens to the underlying address. This is a one-step process and does not require collateral reservation.
3. **Mint from underlying**. An agent can mint tokens if there are any free underlying tokens.

#### Invariants

The following invariants must hold true for minting:

##### For minting using CRT (public minting via `executeMinting`)
1. CRT must exist and be in `ACTIVE` status via `Minting.getCollateralReservation(_crtId, true)`.
2. The payment proof must be valid and verifiable via `TransactionAttestation.verifyPaymentSuccess()`.
3. Only authorized parties can execute minter, executor, or agent owner via the `OnlyMinterExecutorOrAgent()` check.
4. The payment reference must match the exact CRT ID via `PaymentReference.minting(_crtId)` validation.
5. The payment must be sent to the agent's underlying address via `agent.underlyingAddressHash` verification.
6. The payment amount must cover the mint value plus the agent fee via `receivedAmount = mintValueUBA + crt.underlyingFeeUBA`.
7. The payment block number must be at or after CRT creation via `blockNumber >= crt.firstUnderlyingBlock`.
8. The payment must not be double-spent via the `paymentConfirmations.confirmIncomingPayment()` check.
9. The agent's reserved collateral must be properly released after successful minting.

##### For self-minting (`SELF_MINT`)
1. The agent must be whitelisted via `Agents.requireWhitelistedAgentVaultOwner(agent)`.
2. Only the agent-vault owner can self-mint via `Agents.requireAgentVaultOwner(agent)`.
3. Minting must not be paused via `state.mintingPausedAt == 0`.
4. The agent status must be `NORMAL` via `agent.status == Agent.Status.NORMAL`.
5. The agent must have sufficient free collateral via `collateralData.freeCollateralLots(agent) >= _lots`.
6. The minting cap must not be exceeded via `Minting.checkMintingCap()`.
7. The payment reference must be in self-mint format via `PaymentReference.selfMint(_agentVault)`.
8. The payment must be sent to the agent's underlying address via `agent.underlyingAddressHash` verification.
9. The payment amount must cover the mint value plus the pool fee via `receivedAmount = mintValueUBA + poolFeeUBA`.
10. The payment must be made after agent creation via `blockNumber > agent.underlyingBlockAtCreation`.
11. The payment must not be double-spent via the `paymentConfirmations.confirmIncomingPayment()` check.
12. Zero lots are allowed to convert stuck funds to free underlying balance.

##### For minting from free underlying (`FROM_FREE_UNDERLYING`)
1. The agent must be whitelisted via `Agents.requireWhitelistedAgentVaultOwner(agent)`.
2. Only the agent-vault owner can mint via `Agents.requireAgentVaultOwner(agent)`.
3. Minting must not be paused via `state.mintingPausedAt == 0`.
4. Must mint nonzero lots via `_lots > 0`.
5. The agent status must be `NORMAL` via `agent.status == Agent.Status.NORMAL`.
6. The agent must have sufficient free collateral via `collateralData.freeCollateralLots(agent) >= _lots`.
7. The minting cap must not be exceeded via `Minting.checkMintingCap()`.
8. The agent must have sufficient free underlying balance via `requiredUnderlyingAfter <= agent.underlyingBalanceUBA`.

### Component: Minting Default
#### Description
This component is used in the case there are any defaults in the minting process. There could be two potential ways of triggering a minting default:
1. **Payment default**. The minter does not pay the amount to the agent's underlying address, and the last underlying block for the CRT has passed.
2. **Unstick minting**. This is used if the payment/nonpayment proofs are no longer available (more than 24 hours have passed).

#### Invariants
The following invariants must hold true:
##### Payment default (`mintingPaymentDefault`)
1. CRT must exist and be in `ACTIVE` status via `Minting.getCollateralReservation(_crtId, true)`.
2. Only agent-vault owner can call via `Agents.requireAgentVaultOwner(agent)`.
3. Non-payment proof must be valid via `TransactionAttestation.verifyReferencedPaymentNonexistence()`.
4. Payment reference must match CRT ID via `PaymentReference.minting(_crtId)`.
5. Destination must be the agent's address via `agent.underlyingAddressHash`.
6. Amount must match CRT value plus the fee via `underlyingValueUBA + crt.underlyingFeeUBA`.
7. Overflow block must be after the CRT deadline via `firstOverflowBlockNumber > crt.lastUnderlyingBlock`.
8. Proof window must cover CRT period via `minimalBlockNumber <= crt.firstUnderlyingBlock`.

##### Unstick minting (`unstickMinting`)
1. CRT must exist and be in `ACTIVE` status via `Minting.getCollateralReservation(_crtId, true)`.
2. Only agent-vault owner can call via `Agents.requireAgentVaultOwner(agent)`.
3. Block-height proof must be valid via `TransactionAttestation.verifyConfirmedBlockHeightExists()`.
4. Query window must be past CRT deadline via `lowestQueryWindowBlockNumber > crt.lastUnderlyingBlock`.
5. Attestation window must have expired via `lowestQueryWindowBlockTimestamp + attestationWindowSeconds <= blockTimestamp`.
6. Agent must provide enough NAT to burn equivalent collateral via `msg.value >= _burnedNatWei`.

### Component: Redemption request
#### Description
This component handles the creation of redemption requests where FAsset holders burn their tokens to receive underlying currency from agents. Here is how the redemption flow looks:
1. A redeemer calls `redeem()` with lots, underlying address, and executor.
2. The system processes available redemption tickets from the queue.
3. Redemption requests for selected agents are created.
4. The agent receives the redemption request and must pay the underlying currency.

#### Invariants
The following invariants must hold true:
1. An emergency must not be paused via the `notEmergencyPaused` modifier.
2. The redemption amount must be nonzero via the `RedeemZeroLots()` check.
3. The redeemer underlying address must be valid and under 128 bytes.
4. Cannot redeem to agent's own address via `CannotRedeemToAgentsAddress()` check.
5. Must have available redemption tickets in queue.
6. An executor fee requires valid executor address via the `ExecutorFeeWithoutExecutor()` check.
7. FAssets must be burned from redeemer's (`msg.sender`'s) balance.
8. Redemption requests must be properly created with unique IDs.

### Component: Redemption confirmation
#### Description

This component handles the confirmation of redemption payments by agents, validating that the correct underlying currency was sent to redeemers. The redemption confirmation flow is as follows:

1. An agent pays underlying tokens to a redeemer's address.
2. The agent calls `confirmRedemptionPayment()` with payment proof.
3. The system validates payment against redemption-request parameters.
4. The system updates the state based on payment status (`SUCCESS`/`FAILED`/`BLOCKED`).
5. The agent's collateral is released, and the underlying balance is updated.

#### Invariants
The following invariants must hold true:
1. A redemption request must exist and be active.
2. Only agent or others (after time-out) can confirm via authorization check.
3. The payment proof must be valid via `TransactionAttestation.verifyPayment()`.
4. The payment reference must match the redemption ID via `PaymentReference.redemption()`.
5. The payment block must be after request creation via `blockNumber >= request.firstUnderlyingBlock`.
6. The payment source must be the agent's address via `agent.underlyingAddressHash`.
7. The payment receiver cannot be the agent's address via the `InvalidReceivingAddressSelected()` check.
8. Payment validation must pass for `SUCCESS`/`BLOCKED` status.
9. The agent's backing must be properly released via `AgentBacking.endRedeemingAssets()`.

### Component: Redemption default
#### Description
This component handles situations where agents fail to make redemption payments within the required time frame, allowing redeemers to claim collateral compensation. The redemption default flow is as follows:
1. An agent fails to pay the redemption within the deadline.
2. An authorized party calls `redemptionPaymentDefault()` with non-payment proof.
3. The system validates that the payment window has expired.
4. The redeemer receives collateral compensation from the agent.
5. The agent's collateral is slashed, and the redemption request is closed.

In the case that enough time has passed such that the proof is unavailable, the agent could call `finishRedemptionWithoutPayment` to close the redemption request.

#### Invariants
The following invariants must hold true:
1. A redemption request must exist and be `ACTIVE`.
2. Non-payment proof must be valid via `TransactionAttestation.verifyReferencedPaymentNonexistence()`.
3. A payment reference must match the redemption ID.
4. The destination must be the redeemer's underlying address.
5. The amount must match the expected redemption value minus the fee.
6. The overflow block must be after the redemption deadline.
7. The proof window must cover the redemption period.
8. Only authorized parties can trigger default (redeemer, executor, or agent) or others after time-out.

### Component: Underlying balance
##### Description

This component manages agents' underlying currency balances, tracking deposits and
withdrawals and ensuring sufficient backing for minted FAssets.

Balance management involves the following:
1. **Top-up**. Agents can add underlying currency via `confirmTopUp()`.
2. **Withdrawal announcement**. Agents must announce withdrawals via `announceUnderlyingWithdrawal()`.
3. **Withdrawal confirmation**. Anyone can validate actual withdrawals via `confirmUnderlyingWithdrawal()`.
4. **Cancel-announcements tracking**. Agents can cancel announcements via `cancelUnderlyingWithdrawal()`.

#### Invariants
The following invariants must hold true:

##### For top-up
1. Only the agent-vault owner can top up.
2. Payment must be to the agent's underlying address.
3. The payment reference must be in top-up format via `PaymentReference.topup()`.
4. The payment must be after agent creation.
5. The payment must not be double-spent.

##### For withdrawal announcement
1. Only the agent-vault owner can announce.
2. There is no existing active withdrawal announcement.
3. Generate unique announcement ID and payment reference.

##### For withdrawal confirmation
1. Must have active withdrawal announcement.
2. The payment reference must match announcement.
3. The payment source must be the agent's address.
4. Only agent or others (after time-out) can confirm.
5. Source decreasing transaction must be recorded to prevent challenges.

##### For canceling confirmations
1. There must be active announcements from the agent.

### Component: Liquidation
#### Description
This component handles agent liquidation when collateral ratios fall below minimum requirements or the underlying balance becomes insufficient. The liquidation could either be of the type `LIQUIDATION` (could be recovered) or `FULL_LIQUIDATION` (could not be recovered).
A full liquidation could be started if the underlying balance of the agent falls below the required underlying amount or if someone proves an illegal payment from the agent's underlying address. A partial liquidation starts if the pool or vault is underwater. This type of liquidation ends if there is a deposit of collateral, which calls `updateCollateral` and ends liquidation if the agent is healthy again.

#### Invariants
The following invariants must hold true:
1. Must not be emergency-paused.
2. An agent must be in the liquidation state or meet liquidation conditions.
3. Vault and pool collateral ratios must be properly calculated.
4. Liquidation factors must be applied correctly for premium calculation.
5. Agent responsibility must be calculated based on collateral underwater flags.
6. Agent status must be updated to healthy if collateral becomes sufficient.

### Component: Challenges
#### Description
This component allows anyone to challenge agents for illegal behavior on the underlying chain, triggering immediate full liquidation and rewarding challengers.

These are the challenge types:
1. **Illegal payment challenge**. An agent makes a payment without a valid reference.
2. **Double-payment challenge**. An agent uses the same payment reference twice.
3. **Free-balance negative challenge**. An agent's payments exceed the available balance.

#### Invariants
The following invariants must hold true:

##### For the illegal payment challenge
1. An agent must not be in full liquidation already.
2. The payment proof must be valid.
3. Payment must originate from the agent's address.
4. The payment reference must be invalid (no matching redemption/announcement).
5. Payment must not be already confirmed.

##### For the double-payment challenge
1. An agent must not be in full liquidation already.
2. Both payment proofs must be valid.
3. Payments must be distinct transactions.
4. Both payments must originate from the agent's address.
5. Payment references must be identical.

##### For the free-balance negative challenge
1. An agent must not be in full liquidation already.
2. All payment proofs must be valid.
3. No duplicate transactions are allowed.
4. All payments must originate from the agent's address.
5. Total spent amount must exceed available free balance.

### Component: Collateral withdrawal
#### Description
This component manages the announcement and execution of collateral withdrawals by agents,
ensuring sufficient collateral remains for backing. The withdrawal flow is as follows:
1. An agent announces withdrawal via `announceVaultCollateralWithdrawal()` or `announceAgentPoolTokenRedemption()`.
2. They must wait `withdrawalWaitMinSeconds` before withdrawal.
3. The agent vault calls `beforeCollateralWithdrawal()` during withdrawal.
4. The system ensures sufficient collateral remains and proper timing.

##### Invariants
The following invariants must hold true:
1. Only the agent-vault owner can announce withdrawals.
2. The agent must be in `NORMAL` status or with no backing.
3. The withdrawal amount must not exceed free collateral.
4. Withdrawal must occur within the allowed time window.
5. The remaining collateral must maintain minimum ratios.

### Component: Core vault
#### Description
This component manages transfers between agents and the core vault system, allowing agents to transfer backing or request returns.

These are the core vault operations:
1. **Transfer to core vault**. An agent transfers backing to the core vault via `transferToCoreVault()`.
2. **Request return**. An agent requests a return from the core vault via `requestReturnFromCoreVault()`.
3. **Confirm return**. An agent confirms the core vault payment via `confirmReturnFromCoreVault()`.
4. **Cancellation**. Pending requests can be canceled.

#### Invariants
The following invariants must hold true:

##### For transfer to core vault
1. Core vault must be enabled.
2. Only the agent-vault owner can transfer.
3. The agent must not be in full liquidation.
4. The transfer amount must be positive.
5. The agent must have sufficient underlying balance.
6. Only one active transfer is allowed per agent.
7. Must have sufficient redemption tickets to close.

##### For request return
1. Core vault must be enabled.
2. An agent's address must be allowed by the core vault.
3. There is no existing active return request.
4. The agent must be in `NORMAL` status.
5. The agent must have sufficient free collateral.
6. Core vault must have sufficient available balance.

##### For confirm return
1. Must have active return request.
2. Payment must be from core vault address.
3. Payment must be to agent's address.
4. Payment reference must match request ID.
5. Payment must not be double-spent.

##### For cancellation
1. Must have active return request.

## Agent vault

#### Description
Agent vaults are dedicated smart contracts that hold an agent's collateral and ensure that it can only be withdrawn when it is not backing any FAssets. The core vault's functionality is as follows:
1. **Collateral management**. This includes deposit and withdrawals of vault collateral tokens.
2. **Pool operations**. This includes buying/redeeming collateral pool tokens and collecting  fees.
3. **Access control**. Only the agent owner or `AssetManager` can perform operations.
4. **Asset transfer**. Any tokens (apart from the vault collateral and pool tokens) can be withdrawn.
5. **Upgrade capability**. The UUPS upgradable proxy pattern is controlled by `AssetManager`.

#### Invariants
The following invariants must hold true:
1. Only the agent-vault owner can call owner-restricted functions via the `isOwner()` check.
2. Only `AssetManager` can call manager-restricted functions via the `onlyAssetManager` modifier.
3. Collateral withdrawals must be properly announced, and any withdrawal/pool exit calls `beforeCollateralWithdrawal()` to ensure that only free collateral is withdrawn.
4. Destroyed vaults bypass collateral withdrawal restrictions.
5. External token transfers are blocked for locked collateral tokens via the `isLockedVaultToken()` check.
6. All payout operations must be initiated by `AssetManager` only.
7. There is reentrancy protection via the `nonReentrant` modifier on critical functions.
8. Upgrade authorization is restricted to `AssetManager` only.


## Collateral pool
#### Description
The collateral pool holds native tokens, and it mints pool tokens to the depositors. The collateral pool allows anybody to participate in the FAsset system and earn FAsset fees, and it is also used as an additional source of collateral for liquidations and failed redemptions at the times of rapid price fluctuations.

The core functionality of the collateral pool is defined as follows:
1. **Pool entry/exit**. Users deposit native tokens to receive pool tokens with timelock restrictions.
2. **Fee distribution**. FAsset fees are distributed proportionally to pool-token holders.
3. **Self-close exit**. Users exit the pool by liquidating the given amount of pool tokens and redeeming FAssets in a way that preserves CR.

#### Invariants
The following invariants must hold true:
1. There is a minimum entry amount of 1 WNAT via the `MIN_NAT_TO_ENTER` constant.
2. The pool-token supply cannot drop below 1 WNAT equivalent via `MIN_TOKEN_SUPPLY_AFTER_EXIT`.
3. The remaining collateral after exit must be at least 1 WNAT via `MIN_NAT_BALANCE_AFTER_EXIT`.
4. Only AssetManager can trigger payouts via the `onlyAssetManager` modifier.
5. Pool-token timelock periods must be respected for exits.
6. Fee-debt calculations must maintain consistency across entry/exit operations.
7. Exit collateral ratio requirements must be met via `exitCollateralRatioBIPS` validation.


## Core vault manager

#### Description
The core vault manager facilitates efficient redemption by managing a vault where agents can temporarily transfer their underlying assets. When the underlying is on the CV, the agent does not need to back it with collateral, so they can mint again or decide to withdraw this collateral. As per  the documentation, the CV will be managed by a multi-sig address with multiple signers.
Below is the core functionality of the core vault manager:
1. **Payment confirmation**. It verifies and records payments to the core vault.
2. **Transfer requests**. It handles agent requests to transfer assets to/from the core vault.
3. **Escrow management**. It implements a time-based escrow system for security.
4. **Access control**. This includes governance-controlled allowed addresses and triggering accounts.

#### Invariants
The following invariants must hold true:
1. Only AssetManager can request transfers via the `onlyAssetManager` modifier.
2. Payments must be verified via the FDC verification contract.
3. A core vault address must match the expected hash via `coreVaultAddressHash` validation.
4. Transfer amounts must be positive and within available funds.
5. Cancelable transfers are limited to one per agent.
6. The emergency pause must be respected via the `notPaused` modifier.
7. Escrow timing must be properly enforced for security.
8. Payment references must be unique to prevent double-spending.


## FAsset token

#### Description
FAsset tokens are ERC-20–compatible synthetic assets that represent underlying assets and include checkpoint functionality. Shown below is the core functionality of the FAsset token contract:
1. **Minting/burning**. Only `AssetManager` can mint/burn tokens.
2. **Transfer controls**. This includes the emergency-pause mechanism for transfer restrictions.
3. **Checkpoint tracking**. This includes historical balance tracking.
4. **Permit support**. This includes `ERC20Permit` for gasless approvals.
5. **Upgrade control**. It is UUPS upgradable with `AssetManager` authorization.

#### Invariants
The following invariants must hold true:
1. Only `AssetManager` can mint/burn tokens via the `onlyAssetManager` modifier.
2. Transfer restrictions must be enforced during emergency pause.
3. Balance sufficiency must be checked before transfers via `_beforeTokenTransfer`.
4. Self-transfers are prohibited via the `CannotTransferToSelf` check.
5. Checkpoint history must be updated on every transfer.
6. Emergency pause allows mint/burn but blocks transfers.
7. Cleanup operations require proper authorization.
8. Upgrades can only be authorized by `AssetManager`.


## FTSO

#### Description
The Flare Time Series Oracle (FTSO) price store provides price-feed data for FAsset collateral calculations. It aggregates both FTSO scaling prices and trusted provider prices to ensure reliable price information. Shown below is the core functionality of the FTSO contract:
1. **Price publishing**. It publishes verified FTSO prices with Merkle proof validation.
2. **Trusted provider prices**. It submits and aggregates prices from trusted sources.
3. **Price calculations**. It combines FTSO and trusted prices for final-price determination.
4. **Feed management**. It supports multiple price feeds for different assets.
5. **Governance controls**. It manages trusted providers and price-validation parameters.

#### Invariants
The following invariants must hold true:
1. Price proofs must be valid Merkle proofs verified against the relay contract.
2. Voting round IDs must be sequential and properly ordered.
3. Price values must be non-negative.
4. Trusted provider submissions require authorized provider status.
5. Price-feed IDs must match expected configuration.
6. Submission windows must be properly enforced.
7. Trusted provider thresholds must be met for price updates.
8. Price spreads must be within acceptable bounds.


## Governance

#### Description
The governance system provides time-locked administrative control over FAsset protocol parameters and upgrades. It implements a two-phase governance model with an initial setup phase and production mode with mandatory timelocks. Shown below is the core functionality of the governance contract:
1. **Timelock management**. It queues and executes governance calls with mandatory  delays.
2. **Production mode**. It switches from initial governance to production governance with timelocks.
3. **Call execution**. It executes previously timelocked governance calls via authorized executors.
4. **Emergency controls**. It cancels pending timelocked calls when necessary.
5. **Access control**. It separates governance and executor roles for security.

#### Invariants
The following invariants must hold true:
1. Timelocked calls require proper timelock expiration before execution.
2. Only governance can initiate timelock calls via the `onlyGovernance` modifier.
3. Only executors can execute timelocked calls via the `isExecutor()` check.
4. Production mode cannot be reverted once activated.
5. Immediate governance calls require nonproduction mode.
6. Call hashes must be properly tracked to prevent replay attacks.
7. Executor authorization must be validated through governance settings.
