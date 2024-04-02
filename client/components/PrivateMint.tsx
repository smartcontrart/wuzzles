import { useState, useContext, useEffect } from "react";
import {
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import WuzzlesMint from "../contracts/WuzzlesMint.sol/WuzzlesMint.json";
import signedList from "../signedList.json";

export default function PrivateMint() {
  const [alert, setAlert] = useState({ display: false, message: "" });
  const [signedMessage, setSignedMessage] = useState({ v: "", r: "", s: "" });
  const { address, connector, isConnected } = useAccount();
  const { chain, chains } = useNetwork();

  useEffect(() => {
    const findSignedMessage = async (account: any) => {
      let signedMessage = null;
      for (let i = 0; i < signedList.length; i++) {
        let key = Object.keys(signedList[i])[0];
        if (key.toLowerCase() === address.toLowerCase()) {
          signedMessage = signedList[i][key];
        }
      }
      setSignedMessage(signedMessage);
    };
    console.log(signedMessage);
    findSignedMessage(address);
  }, [signedMessage, address, isConnected]);

  console.log(signedMessage.v, signedMessage.r, signedMessage.s);

  const { config } = usePrepareContractWrite({
    address:
      chain!.id === 11155111
        ? (process.env.NEXT_PUBLIC_WUZZLES_MINT_SEPOLIA as `0x${string}`)
        : (process.env.NEXT_PUBLIC_WUZZLES_MINT as `0x${string}`),
    abi: WuzzlesMint.abi,
    functionName: "privateMint",
    args: [signedMessage.v, signedMessage.r, signedMessage.s],
    value: BigInt(9 * 10 ** 15),
  });
  console.log(config);
  const { data, write } = useContractWrite(config);
  console.log(write);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <span className="grid align-center">
      {!isLoading ? (
        <button
          disabled={!write}
          className="w-80 bg-neutral-200 rounded mt-5 mb-2 text-xl disabled:opacity-20"
          onClick={() => write!()}
        >
          mint.
        </button>
      ) : (
        <div>Minting...</div>
      )}
      {isSuccess && (
        <div>
          Mint successful
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>
              See transaction
            </a>
          </div>
        </div>
      )}
    </span>
  );
}
