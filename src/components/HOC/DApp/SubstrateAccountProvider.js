/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */

import React, { useReducer, createContext, useContext, useEffect } from "react";
import store from "store";

const MY_ADDRESS = "bc.myAddress";

export function readMyAddress() {
    const myAddress = store.get(MY_ADDRESS);

    return myAddress;
}

function toString(value, _default) {
    return value && typeof value.toString === "function"
        ? value.toString()
        : _default;
}

const reducer = (state, action) => {
    const forget = () => {
        store.remove(MY_ADDRESS);
        return { ...state, address: undefined };
    };

    let address;

    switch (action.type) {
        case "reload":
            address = readMyAddress();
            return { ...state, address: undefined };

        case "setAddress":
            address = action.address;
            if (address !== state.address) {
                if (address) {
                    store.set(MY_ADDRESS, address);
                    return { ...state, address, inited: true };
                }

                return forget();

            }
            return state;

        case "setAccount": {
            const account = action.account;

            return { ...state, account };
        }

        case "forget":
            return forget();

        default:
            throw new Error("No action type provided");
    }
};

const initialState = {
    inited: false,
    address: undefined
};


export const MyAccountContext = createContext();

export function MyAccountProvider(props) {

    const [state, dispatch] = useReducer(reducer, initialState);

    const { inited, address } = state;

    useEffect(() => {
        if (!inited) {
            dispatch({ type: "reload" });
        }
    }, [inited]); // Don"t call this effect if `invited` is not changed

    const contextValue = {
        state,
        dispatch,
        setAddress: (address) => dispatch({ type: "setAddress", address }),
        signOut: () => dispatch({ type: "forget" })
    };

    return (
        <MyAccountContext.Provider value={contextValue}>
            {props.children}
        </MyAccountContext.Provider>
    );
}

export function useMyAccount() {
    return useContext(MyAccountContext);
}

export function useMyAddress() {
    return useMyAccount().state.address;
}

export default MyAccountProvider;