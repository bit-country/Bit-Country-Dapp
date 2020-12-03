/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { web3FromSource } from "@polkadot/extension-dapp";

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

function TxButton({
    accountPair = null,
    label,
    setStatus,
    color = "blue",
    style = null,
    type = "QUERY",
    attrs = null,
    disabled = false,
    submitAction = null
}) {
    //Hooks
    const { api } = useSubstrate();
    const [unsub, setUnsub] = useState(null);
    const [sudoKey, setSudoKey] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { palletRpc, callable, inputParams, paramFields } = attrs;

    const isQuery = () => type === "QUERY";
    const isSudo = () => type === "SUDO-TX";
    const isUncheckedSudo = () => type === "UNCHECKED-SUDO-TX";
    const isUnsigned = () => type === "UNSIGNED-TX";
    const isSigned = () => type === "SIGNED-TX";
    const isRpc = () => type === "RPC";
    const isConstant = () => type === "CONSTANT";

    const loadSudoKey = () => {
        (async function () {
            if (!api) { return; }
            const sudoKey = await api.query.sudo.key();

            sudoKey.isEmpty ? setSudoKey(null) : setSudoKey(sudoKey.toString());
        })();
    };

    useEffect(loadSudoKey, [api]);

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
        if (status.isFinalized) {
            setIsLoading(false);
            setMessage(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`);
            setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`);
        }
        else {
            setStatus(`Current transaction status: ${status.type}`);
            setMessage(`Current transaction status: ${status.type}`);
        }
    };

    const txErrHandler = err => {
        setStatus(`😞 Transaction Failed: ${err.toString()}`);
        setMessage(`😞 Transaction Failed: ${err.toString()}`);
        setIsLoading(false);
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

        setUnsub(() => unsub);
    };

    const uncheckedSudoTx = async () => {
        const fromAcct = await getFromAcct();
        const txExecute =
            api.tx.sudo.sudoUncheckedWeight(api.tx[palletRpc][callable](...inputParams), 0);

        const unsub = txExecute.signAndSend(fromAcct, txResHandler)
            .catch(txErrHandler);

        setUnsub(() => unsub);
    };

    const signedTx = async () => {
        const fromAcct = await getFromAcct();
        const transformed = transformParams(paramFields, inputParams);
        // transformed can be empty parameters

        Logging.Log("fromAcct", fromAcct);
        Logging.Log("signedTx", transformed);
        const txExecute = transformed
            ? api.tx[palletRpc][callable](...transformed)
            : api.tx[palletRpc][callable]();

        const unsub = await txExecute.signAndSend(fromAcct, txResHandler)
            .catch(txErrHandler);

        setUnsub(() => unsub);
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

        setUnsub(() => unsub);
    };

    const queryResHandler = result =>
        result.isNone ? setStatus("None") : setStatus(result.toString());

    const query = async () => {
        const transformed = transformParams(paramFields, inputParams);

        const unsub = await api.query[palletRpc][callable](...transformed, queryResHandler);

        setUnsub(() => unsub);
    };

    const rpc = async () => {
        const transformed = transformParams(paramFields, inputParams, { emptyAsNull: false });
        const unsub = await api.rpc[palletRpc][callable](...transformed, queryResHandler);

        setUnsub(() => unsub);
    };

    const constant = () => {
        const result = api.consts[palletRpc][callable];

        result.isNone ? setStatus("None") : setStatus(result.toString());
    };

    const transaction = async () => {
        Logging.Log("submit action", submitAction);

        if (submitAction) {
            submitAction();
        }
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
        if (!sudoKey || !acctPair) { return false; }
        return acctPair.address === sudoKey;
    };

    return (
        <>
            <Button
              type="primary"
              shape="round"
              size={"large"}
              color={color}
              style={style}
              onClick={transaction}
              disabled={disabled
                    || !palletRpc
                    || !callable
                    || !allParamsFilled()
                    ||
                    ((isSudo()
                        || isUncheckedSudo())
                        && !isSudoer(accountPair))}
            >
                {label}
            </Button>
            <Modal
              visible={isLoading}
              title={"Sending transaction"}
              footer={[]}
            >
                {message}
            </Modal>
        </>
    );
}

export default React.memo(TxButton);