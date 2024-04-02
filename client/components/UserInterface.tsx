import { useState, useContext, useEffect } from "react";
import {
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  readContracts,
} from "wagmi";
import WuzzlesMint from "../contracts/WuzzlesMint.sol/WuzzlesMint.json";
import Wuzzles from "../contracts/Wuzzles.sol/Wuzzles.json";
import PrivateMint from "./PrivateMint";
import PublicMint from "./PublicMint";

export default function UserInterface() {
  const [mintPrice, setMintPrice] = useState(0);
  const [supply, setSupply] = useState(0);
  const [privateMint, setPrivateMint] = useState(false);
  const [publicMint, setPublicMint] = useState(false);

  const { chain, chains } = useNetwork();

  useEffect(() => {
    const getSupply = async () => {
      try {
        const data = await readContracts({
          contracts: [
            {
              address:
                chain!.id === 11155111
                  ? (process.env.NEXT_PUBLIC_WUZZLES_SEPOLIA as `0x${string}`)
                  : (process.env.NEXT_PUBLIC_WUZZLES as `0x${string}`),
              abi: Wuzzles.abi,
              functionName: "_tokenId",
            },
          ],
        });
        setSupply(data[0].result as number);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    const privateMintStatus = async () => {
      try {
        const data = await readContracts({
          contracts: [
            {
              address:
                chain!.id === 11155111
                  ? (process.env
                      .NEXT_PUBLIC_WUZZLES_MINT_SEPOLIA as `0x${string}`)
                  : (process.env.NEXT_PUBLIC_WUZZLES_MINT as `0x${string}`),
              abi: WuzzlesMint.abi,
              functionName: "_privateMintOpened",
            },
          ],
        });
        setPrivateMint(data[0].result as boolean);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    const publicMintStatus = async () => {
      try {
        const data = await readContracts({
          contracts: [
            {
              address:
                chain!.id === 11155111
                  ? (process.env
                      .NEXT_PUBLIC_WUZZLES_MINT_SEPOLIA as `0x${string}`)
                  : (process.env.NEXT_PUBLIC_WUZZLES_MINT as `0x${string}`),
              abi: WuzzlesMint.abi,
              functionName: "_publicMintOpened",
            },
          ],
        });
        setPublicMint(data[0].result as boolean);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMintPrice = async () => {
      try {
        const data = await readContracts({
          contracts: [
            {
              address:
                chain!.id === 11155111
                  ? (process.env
                      .NEXT_PUBLIC_WUZZLES_MINT_SEPOLIA as `0x${string}`)
                  : (process.env.NEXT_PUBLIC_WUZZLES_MINT as `0x${string}`),
              abi: WuzzlesMint.abi,
              functionName: "_price",
            },
          ],
        });
        if ((data[0].result as number) >= 0) {
          setMintPrice(data[0].result as number);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getSupply();
    privateMintStatus();
    publicMintStatus();
    fetchMintPrice();
  }, [chain, publicMint, privateMint]);

  return (
    <div className="flex flex-col bg-white self-center rounded-xl text-black p-3">
      <div className="flex flex-row justify-between text-xl">
        <div>0.009 eth</div>
        <div>{Math.max(0, Number(supply) - 1)}/900 minted.</div>
      </div>
      <div className="w-72 md:w-96 bg-neutral-200 rounded h-2"></div>
      <div className="flex flex-row justify-center">
        {chain.id !== 8453 ? (
          <div className="text-xl">Please connect to Base</div>
        ) : publicMint ? (
          <PublicMint />
        ) : privateMint && !publicMint ? (
          <PrivateMint />
        ) : null}
      </div>
      <div className="flex flex-row">
        <div className="text-xs">max 1 per wallet</div>
      </div>
    </div>
  );
}
