import { useState, useContext, useEffect } from "react";
import { Suspense } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import clock from "../visuals/clock.gif";
import UserInterface from "./UserInterface";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, connector, isConnected } = useAccount();
  const [userConnected, setUserConnected] = useState(false);
  const [alert, setAlert] = useState({
    active: false,
    content: null,
    variant: null,
  });

  useEffect(() => {
    setUserConnected(isConnected);
  }, [isConnected]);

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
              <UserInterface />
            ) : (
              <p>Please connect your wallet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
