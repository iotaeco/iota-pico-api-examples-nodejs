import { ApiClient } from "@iota-pico/api/dist/client/apiClient";
import { ErrorHelper } from "@iota-pico/core/dist/helpers/errorHelper";
import * as networkConfig from "../networkConfig";

/**
 * Example of API attachToTangle.
 */
export async function attachToTangleExample(trunkTransaction: string, branchTransaction: string,
                                            minWeightMagnitude: number, trytes: string[]): Promise<void> {
    const networkEndPoint = networkConfig.getEndPoint();
    const networkClient = networkConfig.getNetworkClient(networkEndPoint);
    const apiClient = new ApiClient(networkClient, "1", networkConfig.getAdditionalHeaders());

    console.info(`==> Performing attachToTangle on ${networkEndPoint.getUri()}`);
    console.info();

    try {
        const response = await apiClient.attachToTangle({
            trunkTransaction,
            branchTransaction,
            minWeightMagnitude,
            trytes
        });
        console.log("<== Success");
        console.log();
        if (response.trytes && response.trytes.length > 0) {
            console.log(`\tTotal Trytes: ${response.trytes.length}`);
            console.log();
            response.trytes.slice(0, 50)
                .forEach(tryte => {
                    console.log(`\ttryte: ${tryte}`);
                });
            if (response.trytes.length > 50) {
                console.log(`\t...`);
                console.log(`\tlist truncated`);
            }
        } else {
            console.log(`\tNo Trytes Found`);
        }
    } catch (err) {
        console.error("<== Failed");
        console.error();
        console.error(ErrorHelper.format(err, true));
    }
}
