"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = __importDefault(require("commander"));
/**
 * Main CLI Interface
 */
async function run() {
    const packageJson = require("../package.json");
    const oldConsoleError = console.error;
    console.error = (error) => {
        oldConsoleError(error ? chalk_1.default.red(error) : "");
    };
    console.log(packageJson.description);
    console.log("".padStart(packageJson.description.length, "="));
    commander_1.default
        .option("--neighbors <comma separated uris>", "Neighbors to add/remove from your node e.g. udp://1.2.3.4:14600", (val) => val.split(","))
        .option("--bundles <comma separated hashes>", "Hashes to search for in bundles", (val) => val.split(","))
        .option("--addresses <comma separated hashes>", "Hashes to search for or get balances in addresses", (val) => val.split(","))
        .option("--tags <comma separated hashes>", "Hashes to search for in tags", (val) => val.split(","))
        .option("--approvees <comma separated hashes>", "Hashes to search for which confirm specified transaction", (val) => val.split(","))
        .option("--hashes <comma separated hashes>", "Hashes to return the trytes for", (val) => val.split(","))
        .option("--transactions <comma separated hashes>", "Hashes to get inclusion states for", (val) => val.split(","))
        .option("--tips <comma separated hashes>", "Hashes to get inclusion states for", (val) => val.split(","))
        .option("--threshold <int>", "Confirmation threshold", parseInt)
        .option("--depth <int>", "Number of bundles to go back to determine the transactions for approval", parseInt)
        .option("--trunkTransaction <hash>", "Trunk transaction to approve")
        .option("--branchTransaction <hash>", "Branch transaction to approve")
        .option("--minWeightMagnitude <int>", "Proof of Work intensity. Minimum value is 18", parseInt)
        .option("--trytes <comma separates trytes>", "List of trytes (raw transaction data) to attach/broadcast/store in the tangle", (val) => val.split(","))
        .option("--tails <comma separated hashes>", "Hashes for tails to check consistency", (val) => val.split(","))
        .version(packageJson.version);
    commander_1.default
        .command("getNodeInfo")
        .description("Returns information about your node.")
        .action(async () => {
        await runExample("getNodeInfo");
    });
    commander_1.default
        .command("getNeighbors")
        .description("Returns the set of neighbors you are connected with.")
        .action(async () => {
        await runExample("getNeighbors");
    });
    commander_1.default
        .command("addNeighbors")
        .option("--neighbors <uri>")
        .description("Add neighbors to your node.")
        .action(async (cmd) => {
        if (!cmd.parent || !cmd.parent.neighbors) {
            console.error("ERROR: neighbors option is required");
            return;
        }
        await runExample("addNeighbors", cmd.parent.neighbors);
    });
    commander_1.default
        .command("removeNeighbors")
        .option("--neighbors <uri>")
        .description("Remove neighbors from your node.")
        .action(async (cmd) => {
        if (!cmd.parent || !cmd.parent.neighbors) {
            console.error("ERROR: neighbor option is required");
            return;
        }
        await runExample("removeNeighbors", cmd.parent.neighbors);
    });
    commander_1.default
        .command("getTips")
        .description("Get the list of tips from the node.")
        .action(async () => {
        await runExample("getTips");
    });
    commander_1.default
        .command("findTransactions")
        .option("--bundles <comma separated hashes>")
        .option("--addresses <comma separated hashes>")
        .option("--tags <comma separated hashes>")
        .option("--approvees <comma separated hashes>")
        .description("Find the transactions which match the specified input.")
        .action(async (cmd) => {
        if (!cmd.parent || !(cmd.parent.bundles || cmd.parent.addresses || cmd.parent.tags || cmd.parent.approvees)) {
            console.error("ERROR: bundles/addresses/tags/approvees option is required");
            return;
        }
        await runExample("findTransactions", cmd.parent.bundles, cmd.parent.addresses, cmd.parent.tags, cmd.parent.approvees);
    });
    commander_1.default
        .command("getTrytes")
        .option("--hashes <comma separated hashes>")
        .description("Get the trytes for the hashes.")
        .action(async (cmd) => {
        if (!cmd.parent || !cmd.parent.hashes) {
            console.error("ERROR: hashes option is required");
            return;
        }
        await runExample("getTrytes", cmd.parent.hashes);
    });
    commander_1.default
        .command("getInclusionStates")
        .option("--transactions <comma separated hashes>")
        .option("--tips <comma separated hashes>")
        .description("Get the inclusion states of a set of transactions.")
        .action(async (cmd) => {
        if (!cmd.parent || !(cmd.parent.transactions || cmd.parent.tips)) {
            console.error("ERROR: transactions/tips option is required");
            return;
        }
        await runExample("getInclusionStates", cmd.parent.transactions || [], cmd.parent.tips || []);
    });
    commander_1.default
        .command("getBalances")
        .option("--addresses <comma separated hashes>")
        .option("--threshold <int>")
        .description("Get the balances of a set of transactions.")
        .action(async (cmd) => {
        if (!cmd.parent || !cmd.parent.addresses) {
            console.error("ERROR: addresses option is required");
            return;
        }
        await runExample("getBalances", cmd.parent.addresses, cmd.parent.threshold || 100);
    });
    commander_1.default
        .command("getTransactionsToApprove")
        .option("--depth <int>")
        .description("Tip selection which returns trunkTransaction and branchTransaction.")
        .action(async (cmd) => {
        if (!cmd.parent || cmd.parent.depth === undefined) {
            console.error("ERROR: depth option is required");
            return;
        }
        await runExample("getTransactionsToApprove", cmd.parent.depth);
    });
    commander_1.default
        .command("attachToTangle")
        .option("--trunkTransaction <hash>")
        .option("--branchTransaction <hash>")
        .option("--minWeightMagnitude <number>")
        .option("--trytes <comma separates trytes>")
        .description("Attaches the specified transactions (trytes) to the Tangle by doing Proof of Work.")
        .action(async (cmd) => {
        if (!cmd.parent || !(cmd.parent.trunkTransaction || cmd.parent.branchTransaction || cmd.parent.minWeightMagnitude === undefined || cmd.parent.trytes)) {
            console.error("ERROR: trunkTransaction/branchTransaction/minWeightMagnitude/trytes options are required");
            return;
        }
        await runExample("attachToTangle", cmd.parent.trunkTransaction, cmd.parent.branchTransaction, cmd.parent.minWeightMagnitude, cmd.parent.trytes);
    });
    commander_1.default
        .command("interruptAttachingToTangle")
        .description("Interrupts and completely aborts the attachToTangle process.")
        .action(async (cmd) => {
        await runExample("interruptAttachingToTangle");
    });
    commander_1.default
        .command("broadcastTransactions")
        .option("--trytes <comma separates trytes>")
        .description("Broadcast a list of transactions to all neighbors.")
        .action(async (cmd) => {
        if (!cmd.parent || !cmd.parent.trytes) {
            console.error("ERROR: trytes option is required");
            return;
        }
        await runExample("broadcastTransactions", cmd.parent.trytes);
    });
    commander_1.default
        .command("storeTransactions")
        .option("--trytes <comma separates trytes>")
        .description("Store transactions into the local storage.")
        .action(async (cmd) => {
        if (!cmd.parent || !cmd.parent.trytes) {
            console.error("ERROR: trytes option is required");
            return;
        }
        await runExample("storeTransactions", cmd.parent.trytes);
    });
    commander_1.default
        .command("getMissingTransactions")
        .description("Get transactions with missing references.")
        .action(async (cmd) => {
        await runExample("getMissingTransactions");
    });
    commander_1.default
        .command("checkConsistency")
        .option("--tails <comma separated hashes>")
        .description("Check the consistency of tail hashes.")
        .action(async (cmd) => {
        if (!cmd.parent || !cmd.parent.tails) {
            console.error("ERROR: tails option is required");
            return;
        }
        await runExample("checkConsistency", cmd.parent.tails);
    });
    commander_1.default
        .command("wereAddressesSpentFrom")
        .option("--addresses <comma separated hashes>")
        .description("Have the requested addresses been spent from already.")
        .action(async (cmd) => {
        if (!cmd.parent || !cmd.parent.addresses) {
            console.error("ERROR: addresses option is required");
            return;
        }
        await runExample("wereAddressesSpentFrom", cmd.parent.addresses);
    });
    commander_1.default
        .command("*", undefined, { noHelp: true })
        .action(() => {
        console.error(`Unknown Command: ${commander_1.default.args.join(" ")}`);
        commander_1.default.help();
    });
    commander_1.default.parse(process.argv);
    if (!process.argv.slice(2).length) {
        commander_1.default.help();
    }
}
exports.run = run;
async function runExample(api, ...args) {
    try {
        const oldConsoleInfo = console.info;
        console.info = (info) => {
            oldConsoleInfo(info ? chalk_1.default.cyan(info) : "");
        };
        const oldConsoleLog = console.log;
        console.log = (log) => {
            oldConsoleLog(log ? chalk_1.default.green(log) : "");
        };
        const module = await require(`./api/${api}Example`);
        const exampleMethod = module[`${api}Example`];
        exampleMethod(...args);
    }
    catch (err) {
        console.log(chalk_1.default.red(`Unable to load example ${api}.`));
    }
}
