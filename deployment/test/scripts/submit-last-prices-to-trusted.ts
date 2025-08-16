import { runDeployScript } from "../../lib/deploy-scripts";

type TrustedFeed = {
    id: string;
    value: number | BN | string;
    decimals: number | BN | string;
};

export async function latestBlockTimestamp() {
    const block = await web3.eth.getBlock("latest");
    return Number(block.timestamp);
}

runDeployScript(async ({ hre, artifacts, contracts, deployer }) => {
    const FtsoV2PriceStore = artifacts.require("FtsoV2PriceStore");
    const fps = await FtsoV2PriceStore.at(contracts.getAddress("FtsoV2PriceStore"));

    const ts = await latestBlockTimestamp();
    const roundId = Math.floor((ts - 1658429955) / 90) - 1;

    // console.log(roundId, String(await fps.lastPublishedVotingRoundId()));
    const feeds: TrustedFeed[] = [];
    for (const symbol of await fps.getSymbols()) {
        const price = await fps.getPrice(symbol);
        // console.log(symbol, await fps.getFeedId(symbol), String(price[0]), String(price[2]));
        feeds.push({ id: await fps.getFeedId(symbol), value: String(price[0]), decimals: String(price[2]) });
    }
    // console.log(feeds);

    await fps.submitTrustedPrices(roundId, feeds);
});