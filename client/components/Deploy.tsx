import { useState } from "react";
import {
  useConnect,
  useWalletClient,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useAccount } from "wagmi";
import KillingTime from "../contracts/KillingTime.sol/KillingTime.json";

export default function Deploy() {
  const contractAbi = KillingTime.abi; // ... Your contract ABI
  const contractBytecode = KillingTime.bytecode; // ... Your contract bytecode
  const { address, connector, isConnected } = useAccount();
  const [userConnected, setUserConnected] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [alert, setAlert] = useState({
    active: false,
    content: null,
    variant: null,
  });

  async function onSubmit() {
    const hash = await walletClient?.deployContract({
      abi: KillingTime.abi,
      bytecode: KillingTime.bytecode as `0x${string}`,
      args: [],
    });
    // setHash(hash);
  }

  return (
    <div className="grid justify-items-center">
      <h1 className="text-9xl text-center">Welcome Smokestack </h1>
      <h2 className="text-l text-center m-10">
        Ready to kill some time? Click the button....
      </h2>
      <button
        className="border-solid border-2 p-2"
        width="500"
        onClick={() => onSubmit()}
      >
        Kill Time
      </button>
    </div>
  );
}
