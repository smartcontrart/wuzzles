import { useState, useContext, useEffect } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  readContracts,
} from "wagmi";
import KillingTime from "../contracts/KillingTime.sol/KillingTime.json";
import KillingTimeMint from "../contracts/KillingTimeMint.sol/KillingTimeMint.json";

export default function UserInterface() {
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [mintPrice, setMintPrice] = useState(0);
  const [insurance, setInsurance] = useState(false);
  const [alert, setAlert] = useState({ display: false, message: "" });

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
              address: process.env
                .NEXT_PUBLIC_KT_MINT_CONTRACT_ADDRESS as `0x${string}`,
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
              address: process.env
                .NEXT_PUBLIC_KT_MINT_CONTRACT_ADDRESS as `0x${string}`,
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
  }, []);

  function handleChange() {
    setInsurance(!insurance);
  }

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_KT_MINT_CONTRACT_ADDRESS as `0x${string}`,
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
        <button className="border-solid border-2 p-2" onClick={() => write()}>
          {`Mint for ${
            insurance
              ? Number(mintPrice + insurancePrice) / 10 ** 18
              : Number(mintPrice) / 10 ** 18
          } ETH`}
        </button>
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
