import { useState, useContext, useEffect } from "react";
import {
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  readContracts,
} from "wagmi";
import KillingTimeMint from "../contracts/KillingTimeMint.sol/KillingTimeMint.json";

export default function UserInterface({ userBalanceData }) {
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [mintPrice, setMintPrice] = useState(0);
  const [insurance, setInsurance] = useState(false);
  const [alert, setAlert] = useState({ display: false, message: "" });

  const { chain, chains } = useNetwork();

  const displayAlert = (message: string) => {
    const updatedAlert = { display: true, message: message };
    setAlert(updatedAlert);

    setTimeout(() => {
      setAlert({ display: false, message: "" });
    }, 5000);
  };

  useEffect(() => {
    const fetchInsurancePrice = async () => {
      try {
        const data = await readContracts({
          contracts: [
            {
              address:
                chain!.id === 5
                  ? (process.env.NEXT_PUBLIC_KT_MINT_GOERLI as `0x${string}`)
                  : (process.env.NEXT_PUBLIC_KT_MINT as `0x${string}`),
              abi: KillingTimeMint.abi,
              functionName: "_insurancePrice",
            },
          ],
        });
        setInsurancePrice(data[0].result as number);
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
                chain!.id === 5
                  ? (process.env.NEXT_PUBLIC_KT_MINT_GOERLI as `0x${string}`)
                  : (process.env.NEXT_PUBLIC_KT_MINT as `0x${string}`),
              abi: KillingTimeMint.abi,
              functionName: "_price",
            },
          ],
        });
        setMintPrice(data[0].result as number);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInsurancePrice();
    fetchMintPrice();
  }, [chain]);

  function handleChange() {
    setInsurance(!insurance);
  }

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address:
      chain!.id === 5
        ? (process.env.NEXT_PUBLIC_KT_MINT_GOERLI as `0x${string}`)
        : (process.env.NEXT_PUBLIC_KT_MINT as `0x${string}`),
    abi: KillingTimeMint.abi,
    functionName: "mint",
    args: [insurance],
    value: BigInt(insurance ? mintPrice + insurancePrice : mintPrice),
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <span className="grid align-center">
      <div className="mb-2">
        <input type="checkbox" onChange={handleChange} />
        <label className="mx-5">
          Add insurance for {Number(insurancePrice) / 10 ** 18} ETH
        </label>
      </div>
      {!isLoading ? (
        userBalanceData.value >=
        (insurance ? Number(mintPrice + insurancePrice) : Number(mintPrice)) ? (
          <button className="border-solid border-2 p-2" onClick={() => write()}>
            {`Mint for ${
              insurance
                ? Number(mintPrice + insurancePrice) / 10 ** 18
                : Number(mintPrice) / 10 ** 18
            } ETH`}
          </button>
        ) : (
          <div>Insufficient funds</div>
        )
      ) : (
        <div>Minting...</div>
      )}
      {isSuccess && (
        <div>
          Mint successful{" "}
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
