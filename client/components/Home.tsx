import { useState, useContext, useEffect } from "react";
import { Suspense } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import clock from "../visuals/clock.gif";
import UserInterface from "./UserInterface";
import KillingTimeMint from "../contracts/KillingTimeMint.sol/KillingTimeMint.json";
import {
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  readContracts,
} from "wagmi";

export default function Home() {
  const { address, connector, isConnected } = useAccount();
  const [userConnected, setUserConnected] = useState(false);
  const [dropStatus, setDropStatus] = useState(false);
  const { chain, chains } = useNetwork();

  useEffect(() => {
    const fetchDropStatus = async () => {
      try {
        console.log("address:");
        console.log(process.env.NEXT_PUBLIC_KT_MINT);
        const data = await readContracts({
          contracts: [
            {
              address:
                chain!.id === 5
                  ? (process.env.NEXT_PUBLIC_KT_MINT_GOERLI as `0x${string}`)
                  : (process.env.NEXT_PUBLIC_KT_MINT as `0x${string}`),
              abi: KillingTimeMint.abi,
              functionName: "_mintOpened",
            },
          ],
        });
        console.log("data");
        console.log(data);
        setDropStatus(data[0].result as boolean);
      } catch (error) {
        console.error(error);
      }
    };
    setUserConnected(isConnected);
    fetchDropStatus();
    console.log("dropStatus");
    console.log(dropStatus);
  }, [isConnected, chain]);

  useEffect(() => {}, [isConnected]);

  return (
    <div className="">
      <h1 className="text-9xl text-center">Killing Time</h1>
      <div className="text-l text-center m-10">
        an NFT collection by Smokestacks and Smartcontrart
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 items-center">
        <div className="grid justify-items-center">
          <Image
            src={clock}
            className="NFT_visual"
            alt="clock"
            style={{ maxHeight: "100%" }}
          />
        </div>
        <div className="text-l">
          <div className="grid justify-items-center lg:justify-items-start m-5">
            <span>Time is the most valuable asset. </span>
            <br />
            <span>
              I would suggest moving this to a hardware wallet asap...
            </span>
            <br />
            <span>
              But... be careful when transporting it, if you don’t get
              insurance.
            </span>
            <br />
            <span>
              Smokestacks and Smartcontract are not responsible for any damages
              that may incur to uninsured works during transport and delivery...
            </span>
            <span>
              These are extremely fragile and must be handled with care.
            </span>
            <br />
            <span>
              If it breaks, we provide free after-sale services. Just come back
              here to get it repaired
            </span>
            <br />
            <span>
              We however guarantee that if an insured breaks, it will only
              happen once...
            </span>
          </div>
          <div className="grid justify-items-center my-10">
            {userConnected ? (
              dropStatus ? (
                <UserInterface />
              ) : (
                <div>Drop closed</div>
              )
            ) : (
              <p>Please connect your wallet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
