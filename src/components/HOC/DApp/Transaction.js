/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { web3FromSource } from "@polkadot/extension-dapp";
import { ContractPromise } from "@polkadot/api-contract";
import { useSubstrate } from "./useSubstrate";
import Logging from "../../../utils/Logging";

const utils = {
    paramConversion: {
        num: [
            "Compact<Balance>",
            "BalanceOf",
            "u8", "u16", "u32", "u64", "u128",
            "i8", "i16", "i32", "i64", "i128"
        ]
    }
};

export default class TransactionUtil {
    static Transaction({
        accountPair = null,
        setStatus,
        type = "QUERY",
        attrs = null,
        api = null,
        setLoading = null,
    }) {

        Logging.Log("Transaction........");

        return new Promise((resolve, reject) => {
            // const [unsub, setUnsub] = useState(null);
            let unSub = null;
            let localSudoKey = null;
            let blockHash = "";
            const { palletRpc, callable, inputParams, paramFields } = attrs;

            const isQuery = () => type === "QUERY";
            const isSudo = () => type === "SUDO-TX";
            const isUncheckedSudo = () => type === "UNCHECKED-SUDO-TX";
            const isUnsigned = () => type === "UNSIGNED-TX";
            const isSigned = () => type === "SIGNED-TX";
            const isRpc = () => type === "RPC";
            const isConstant = () => type === "CONSTANT";

            const getFromAcct = async () => {
                const {
                    address,
                    meta: { source, isInjected }
                } = accountPair;
                let fromAcct;

                // signer is from Polkadot-js browser extension
                if (isInjected) {
                    const injected = await web3FromSource(source);

                    fromAcct = address;
                    api.setSigner(injected.signer);
                } else {
                    fromAcct = accountPair;
                }

                return fromAcct;
            };

            const txResHandler = ({ status }) => {
                /* eslint-disable no-else-return */

                if (status.isFinalized) {
                    // setIsLoading(false);
                    // setMessage(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`);
                    setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`);
                    blockHash = status.asFinalized.toString();
                    setLoading(false);

                    resolve(blockHash);
                }
                else if (status.isInBlock) {
                    blockHash = status.asInBlock.toString();
                    setStatus(`Transaction already included in Block ${blockHash}`);
                    setLoading(false);
                    resolve(blockHash);
                }
                else {
                    setStatus(`Current transaction status: ${status.type}`);
                    // setMessage(`Current transaction status: ${status.type}`);
                }
            };

            const txErrHandler = err => {
                setStatus(`😞 Transaction Failed: ${err.toString()}`);
                // setMessage(`😞 Transaction Failed: ${err.toString()}`);
                setLoading(false);
                reject(false);
            };

            const sudoTx = async () => {
                const fromAcct = await getFromAcct();
                const transformed = transformParams(paramFields, inputParams);
                // transformed can be empty parameters
                const txExecute = transformed
                    ? api.tx.sudo.sudo(api.tx[palletRpc][callable](...transformed))
                    : api.tx.sudo.sudo(api.tx[palletRpc][callable]());

                const unsub = txExecute.signAndSend(fromAcct, txResHandler)
                    .catch(txErrHandler);

                unSub = unsub;
            };

            const uncheckedSudoTx = async () => {
                const fromAcct = await getFromAcct();
                const txExecute =
                    api.tx.sudo.sudoUncheckedWeight(api.tx[palletRpc][callable](...inputParams), 0);

                const unsub = txExecute.signAndSend(fromAcct, txResHandler)
                    .catch(txErrHandler);

                unSub = unsub;
                // setUnsub(() => unsub);
            };

            const signedTx = async () => {
                const fromAcct = await getFromAcct();
                const transformed = transformParams(paramFields, inputParams);
                // transformed can be empty parameters

                const txExecute = transformed
                    ? api.tx[palletRpc][callable](...transformed)
                    : api.tx[palletRpc][callable]();

                const unsub = await txExecute.signAndSend(fromAcct, txResHandler)
                    .catch(txErrHandler);

                unSub = unsub;
                // setUnsub(() => unsub);
            };

            const unsignedTx = async () => {
                const transformed = transformParams(paramFields, inputParams);
                // transformed can be empty parameters

                Logging.Log("unsignedTx", api);

                const txExecute = transformed
                    ? api.tx[palletRpc][callable](...transformed)
                    : api.tx[palletRpc][callable]();

                const unsub = await txExecute.send(txResHandler)
                    .catch(txErrHandler);

                // setUnsub(() => unsub);
                unSub = unsub;

            };

            const queryResHandler = result =>
                result.isNone ? setStatus("None") : setStatus(result.toString());

            const query = async () => {
                const transformed = transformParams(paramFields, inputParams);

                const unsub = await api.query[palletRpc][callable](...transformed, queryResHandler);

                // setUnsub(() => unsub);
                unSub = unsub;

            };

            const rpc = async () => {
                const transformed = transformParams(paramFields, inputParams, { emptyAsNull: false });
                const unsub = await api.rpc[palletRpc][callable](...transformed, queryResHandler);

                // setUnsub(() => unsub);
                unSub = unsub;

            };

            const constant = () => {
                const result = api.consts[palletRpc][callable];

                result.isNone ? setStatus("None") : setStatus(result.toString());
            };

            const transaction = async () => {

                if (unSub) {
                    unSub();
                    unSub = null;
                }

                (isSudo() && sudoTx()) ||
                    (isUncheckedSudo() && uncheckedSudoTx()) ||
                    (isSigned() && signedTx()) ||
                    (isUnsigned() && unsignedTx()) ||
                    (isQuery() && query()) ||
                    (isRpc() && rpc()) ||
                    (isConstant() && constant());
            };

            const transformParams = (paramFields, inputParams, opts = { emptyAsNull: true }) => {
                // if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
                //   Otherwise, it will not be added

                const paramVal = inputParams.map(inputParam => {
                    // To cater the js quirk that `null` is a type of `object`.
                    if (typeof inputParam === "object" && inputParam !== null && typeof inputParam.value === "string") {
                        return inputParam.value.trim();
                    } else if (typeof inputParam === "string") {
                        return inputParam.trim();
                    }
                    return inputParam;
                });
                const params = paramFields.map((field, ind) => ({ ...field, value: paramVal[ind] || null }));

                return params.reduce((memo, { type = "string", value }) => {
                    if (value == null || value === "") return (opts.emptyAsNull ? [...memo, null] : memo);

                    let converted = value;

                    // Deal with a vector
                    if (type.indexOf("Vec<") >= 0) {
                        converted = converted.split(",").map(e => e.trim());
                        converted = converted.map(single => isNumType(type)
                            ? (single.indexOf(".") >= 0 ? Number.parseFloat(single) : Number.parseInt(single))
                            : single
                        );
                        return [...memo, converted];
                    }

                    // Deal with a single value
                    if (isNumType(type)) {
                        converted = converted.indexOf(".") >= 0 ? Number.parseFloat(converted) : Number.parseInt(converted);
                    }
                    return [...memo, converted];
                }, []);
            };

            const isNumType = type =>
                utils.paramConversion.num.some(el => type.indexOf(el) >= 0);

            const allParamsFilled = () => {
                if (paramFields.length === 0) { return true; }

                return paramFields.every((paramField, ind) => {
                    const param = inputParams[ind];

                    if (paramField.optional) { return true; }
                    if (param == null) { return false; }

                    const value = typeof param === "object" ? param.value : param;

                    return value !== null && value !== "";
                });
            };

            const isSudoer = acctPair => {
                if (!localSudoKey || !acctPair) { return false; }
                return acctPair.address === localSudoKey;
            };

            if (palletRpc
                || callable
                || allParamsFilled()
                ||
                ((isSudo()
                    || isUncheckedSudo())
                    && isSudoer(accountPair))) {
                setLoading(true);
                transaction();
            }
        });
    }

    static ExecuteContract({ accountPair = null,
        setStatus,
        type = "QUERY",
        attrs = null,
        api = null,
        abi = null,
        address = null,
        setLoading = null, }) {

        return new Promise((resolve, reject) => {
            // const [unsub, setUnsub] = useState(null);
            let unSub = null;
            let blockHash = "";
            const { contractRpc, callable, inputParams, paramFields } = attrs;

            // Attach to an existing contract with a known ABI and address
            const contract = new ContractPromise(api, abi, address);

            const isQuery = () => type === "QUERY";
            const isSigned = () => type === "SIGNED-TX";

            const getFromAcct = async () => {
                const {
                    address,
                    meta: { source, isInjected }
                } = accountPair;
                let fromAcct;

                // signer is from Polkadot-js browser extension
                if (isInjected) {
                    const injected = await web3FromSource(source);

                    fromAcct = address;
                    api.setSigner(injected.signer);
                } else {
                    fromAcct = accountPair;
                }

                return fromAcct;
            };

            const txResHandler = result => {
                /* eslint-disable no-else-return */

                const {
                    status
                } = result;

                if (status.isFinalized) {
                    // setIsLoading(false);
                    // setMessage(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`);
                    setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`);
                    blockHash = status.asFinalized.toString();
                    setLoading(false);

                    resolve(blockHash);
                }
                else if (status.isInBlock) {
                    blockHash = status.asInBlock.toString();
                    setStatus(`Transaction already included in Block ${blockHash}`);
                    setLoading(false);
                    resolve(blockHash);
                }
                else {
                    setStatus(`Current transaction status: ${status.type}`);
                    // setMessage(`Current transaction status: ${status.type}`);
                }
            };

            const txErrHandler = err => {
                setStatus(`😞 Transaction Failed: ${err.toString()}`);
                // setMessage(`😞 Transaction Failed: ${err.toString()}`);
                setLoading(false);
                reject(err);
            };

            const signedTx = async () => {
                const fromAcct = await getFromAcct();
                const transformed = transformParams(paramFields, inputParams);
                // transformed can be empty parameters

                const txExecute = transformed
                    ? contract.exec(...transformed)
                    : contract.exec();

                const unsub = await txExecute.signAndSend(fromAcct, txResHandler)
                    .catch(txErrHandler);

                unSub = unsub;
                // setUnsub(() => unsub);
            };

            const queryResHandler = result =>
                result.isNone ? setStatus("None") : setStatus(result.toString());

            const query = async () => {
                const transformed = transformParams(paramFields, inputParams);

                const unsub = await api.query[contractRpc][callable](...transformed, queryResHandler);

                // setUnsub(() => unsub);
                unSub = unsub;

            };

            const transaction = async () => {

                if (unSub) {
                    unSub();
                    unSub = null;
                }

                (isSigned() && signedTx()) ||
                    (isQuery() && query());
            };

            const transformParams = (paramFields, inputParams, opts = { emptyAsNull: true }) => {
                // if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
                //   Otherwise, it will not be added

                const paramVal = inputParams.map(inputParam => {
                    // To cater the js quirk that `null` is a type of `object`.
                    if (typeof inputParam === "object" && inputParam !== null && typeof inputParam.value === "string") {
                        return inputParam.value.trim();
                    } else if (typeof inputParam === "string") {
                        return inputParam.trim();
                    }
                    return inputParam;
                });

                const params = paramFields.map((field, ind) => ({ ...field, value: paramVal[ind] === 0 ? 0 : paramVal[ind] || null }));

                return params.reduce((memo, { type = "string", value }) => {
                    if (value == null || value === "") return (opts.emptyAsNull ? [...memo, null] : memo);

                    let converted = value;

                    // Deal with a vector
                    if (type.indexOf("Vec<") >= 0) {
                        converted = converted.split(",").map(e => e.trim());
                        converted = converted.map(single => isNumType(type)
                            ? (single.indexOf(".") >= 0 ? Number.parseFloat(single) : Number.parseInt(single))
                            : single
                        );
                        return [...memo, converted];
                    }

                    // Deal with a single value
                    if (isNumType(type)) {
                        converted = converted.indexOf(".") >= 0 ? Number.parseFloat(converted) : Number.parseInt(converted);
                    }
                    return [...memo, converted];
                }, []);
            };

            const isNumType = type =>
                utils.paramConversion.num.some(el => type.indexOf(el) >= 0);

            const allParamsFilled = () => {
                if (paramFields.length === 0) { return true; }

                return paramFields.every((paramField, ind) => {
                    const param = inputParams[ind];

                    if (paramField.optional) { return true; }
                    if (param == null) { return false; }

                    const value = typeof param === "object" ? param.value : param;

                    return value !== null && value !== "";
                });
            };

            if (contractRpc
                || callable
                || allParamsFilled()
            ) {
                setLoading(true);
                transaction();
            }
        });
    }

    static GetEventDetail(
        api = null,
        blockHash = null,
        eventMethod = null,
        eventType = null,
        abi = null
    ) {

        return new Promise((resolve, reject) => {

            const getEventDetail = async (blockHash, abi) => {
                const signedBlock = await api.rpc.chain.getBlock(blockHash);
                const allRecords = await api.query.system.events.at(blockHash);
                let events = [];

                signedBlock.block.extrinsics.forEach(({ method: { method, section } }, index) => {
                    allRecords
                        .filter(({ phase }) =>
                            phase.isApplyExtrinsic &&
                            phase.asApplyExtrinsic.eq(index)
                        )
                        .forEach(({ event }) => {
                            const types = event.typeDef;

                            if (event.method == eventMethod) {
                                if (eventMethod == "ContractExecution" && event.data.length === 2) {
                                    const [accountId, encoded] = event.data;

                                    if (abi) {
                                        const decoded = abi.decodeEvent(encoded.toU8a(true));

                                        events.push({
                                            type: decoded.event.identifier,
                                            args: decoded.event.args,
                                            value: decoded.args
                                        });
                                        
                                    }
                                } else {
                                    event.data.forEach((data, index) => {
                                        console.log(`${types[index].type}: ${data.toString()}`);
                                        if (types[index].type == eventType) {
                                            events.push({
                                                type: eventType,
                                                value: data.toString()
                                            });
                                        }
                                        // Loop through each of the parameters, displaying the type and data
                                        // return `${event.section}.${event.method}`;
                                    });
                                }                                
                            }
                        });
                });

                if (events.length > 0) {
                    resolve(events);
                }
                else {
                    reject("No event found");
                }
            };

            getEventDetail(blockHash, abi);
        });
    }
}