import { useState, useContext, useEffect } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import KillingTime from "../contracts/KillingTime.sol/KillingTime.json";

export default function FrameButton({ clock }: any) {
  const [alert, setAlert] = useState({ display: false, message: "" });

  const displayAlert = (message: string) => {
    const updatedAlert = { display: true, message: message };
    setAlert(updatedAlert);

    setTimeout(() => {
      setAlert({ display: false, message: "" });
    }, 5000);
  };

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_KT_CONTRACT_ADDRESS as `0x${string}`,
    abi: KillingTime.abi,
    functionName: "toggleFrameClock",
    args: [clock ? clock.tokenId : null],
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <span className="grid align-center">
      {!isLoading ? (
        <button
          className="border-solid border-2 p-2 w-24 m-2"
          onClick={() => write()}
        >
          Frame
        </button>
      ) : (
        <div>Framing...</div>
      )}
      {isSuccess && (
        <div>
          Clock successfully framed
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>
              See transaction
            </a>
          </div>
        </div>
      )}
      <p>{alert.message}</p>
    </span>
  );
}
