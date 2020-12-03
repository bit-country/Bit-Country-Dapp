import { useContext } from "react";
import { SubstrateContext } from "./SubstrateWrapper";

export const useSubstrate = () => {
  const [ state, dispatch ] = useContext(SubstrateContext);

  return { ...state, dispatch };
};

export default useSubstrate;