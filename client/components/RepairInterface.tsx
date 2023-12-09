import { useState } from "react";
import RepairButton from "./RepairButton";
import FrameButton from "./FrameButton";

export default function RepairInterface({ clock }: any) {
  const [alert, setAlert] = useState({ display: false, message: "" });

  const displayAlert = (message: string) => {
    const updatedAlert = { display: true, message: message };
    setAlert(updatedAlert);

    setTimeout(() => {
      setAlert({ display: false, message: "" });
    }, 5000);
  };

  return (
    <span className="flex align-center">
      {clock ? (
        clock.image.originalUrl ===
        "https://arweave.net/ngGdza9zgpCqEZMnrsbFIgbDZvcMVfaNyDRSB6u-hZs" ? (
          <RepairButton clock={clock} />
        ) : null
      ) : null}

      {clock ? (
        clock.raw.metadata.attributes[0].value === "true" ? (
          <FrameButton clock={clock} />
        ) : null
      ) : null}
    </span>
  );
}
