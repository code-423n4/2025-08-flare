import { runDeployScript } from "../lib/deploy-scripts";
import { upgradeAgentVaultFactory, upgradeAgentVaultsAndPools, upgradeAssetManagerController, upgradeCollateralPoolFactory, upgradeCollateralPoolTokenFactory, upgradeFAsset, upgradeGovernedProxy } from "../lib/upgrade-contracts";

runDeployScript(async (deployScriptEnvironment) => {
    // const { hre, artifacts, contracts, deployer } = deployScriptEnvironment;
    await upgradeAssetManagerController(deployScriptEnvironment, true);
    await upgradeAgentVaultFactory(deployScriptEnvironment, true);
    await upgradeCollateralPoolFactory(deployScriptEnvironment, true);
    await upgradeCollateralPoolTokenFactory(deployScriptEnvironment, true);
    await upgradeFAsset(deployScriptEnvironment, true);
    await upgradeAgentVaultsAndPools(deployScriptEnvironment, true);
    await upgradeGovernedProxy(deployScriptEnvironment, "CoreVaultManager_FTestXRP", "CoreVaultManagerImplementation", "CoreVaultManager", true);
});
