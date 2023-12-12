import { useState, useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { Network, Alchemy } from "alchemy-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import RepairInterface from "./RepairInterface";

export default function Repair() {
  const { address, connector, isConnected } = useAccount();
  const [clocksOwned, setClocksOwned] = useState([]);
  const [selection, setSelection] = useState(null);
  const [userConnected, setUserConnected] = useState(false);
  const { chain, chains } = useNetwork();

  useEffect(() => {
    setUserConnected(isConnected);

    const getClocks = async () => {
      const config = {
        apiKey: process.env.REACT_APP_ALCHEMY_KEY,
        network: chain!.id === 1 ? Network.ETH_MAINNET : Network.ETH_GOERLI,
      };
      const alchemy = new Alchemy(config);
      const response = await alchemy.nft.getNftsForOwner(
        address as `0x${string}`,
        {
          contractAddresses: [
            `${
              chain!.id === 5
                ? process.env.NEXT_PUBLIC_KT_GOERLI
                : process.env.NEXT_PUBLIC_KT
            }`,
          ],
        }
      );
      setClocksOwned(response.ownedNfts);
    };
    getClocks();
  }, [address, isConnected]);

  function select(clock: any) {
    setSelection(clock);
  }

  return (
    <div className="">
      <h1 className="text-9xl text-center">Killing Time</h1>
      <div className="text-l text-center m-10">
        Smokestacks and Smartcontrart&apos;s clocks after-sales department
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 mt-5 items-center">
        <div className="items-center">
          <div className="text-center mb-5 text-2xl font-semibold">
            Your clocks
          </div>
          <div className="flex justify-center">
            {clocksOwned.length > 0 ? (
              clocksOwned.map((clock: any, idx: number) => (
                <Image
                  className={`mx-5 ${
                    selection && selection.tokenId === clock.tokenId
                      ? "border-solid border-2 border-white"
                      : null
                  }`}
                  alt="clock_image"
                  key={idx}
                  src={clock.image.cachedUrl}
                  width={100}
                  height={100}
                  onClick={() => select(clock)}
                />
              ))
            ) : (
              <div>
                You don&apos;t own any clocks yet, check{" "}
                <Link className="underline" href="/">
                  here
                </Link>{" "}
                if you can still mint some!
              </div>
            )}
          </div>
        </div>
        <div className="text-l">
          <div className="grid justify-items-center lg:justify-items-start m-5">
            <span>Something happened to your clock?</span>
            <br />
            <br />
            <span>That&apos;s embarassing... Sorry about that!</span>
            <br />
            <br />
            <span>
              We know they are fragile, but it&apos;s all good. You can repair
              it here! And it&apos;s free (only gas)
            </span>
            <br />
            <br />
            <span>
              Select the clock you want to repair and simply click: Repair!
            </span>
            <br />
            <br />
            <span>
              If your clock is insured, you can also activate the frame mode.
              The frame mode will slow time. Your clock will freeze itself and
              update every block!
            </span>
            <br />
          </div>
        </div>
        <div className="grid justify-items-center my-10">
          {userConnected ? (
            <RepairInterface clock={selection} />
          ) : (
            <p>Please connect your wallet</p>
          )}
        </div>
      </div>
    </div>
  );
}
