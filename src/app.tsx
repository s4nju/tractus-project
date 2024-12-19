import React, { useEffect } from "react";
import { useAppSocket } from "@/hooks/useAppSocket";
import TableComponent from "./components/contracts-table";
import { useStore } from "./store/store";

const App = () => {
  const contracts = useStore((state: any) => state.contracts);
  const setContracts = useStore((state: any) => state.setContracts);
  const updateContracts = useStore((state: any) => state.updateContracts);

  const { sendMessage } = useAppSocket((data: any) => {
    if (data === "pong") {
      console.log(data);
      return;
    }

    const recievedData = JSON.parse(data.data);

    if (recievedData.type === "get/contracts") {
      setContracts(recievedData.data);
    }

    if (recievedData.type === "update/status") {
      updateContracts("update/status", recievedData.data);
    }

    if (recievedData.type === "update/clientName") {
      updateContracts(recievedData.type, recievedData.data);
    }
  });

  useEffect(() => {
    sendMessage("get/contracts");
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto pt-10">
      <div className="text-2xl font-bold mb-4 ml-2 text-white">
        TractUs Project
      </div>

      <TableComponent contracts={contracts} />
    </div>
  );
};

export default App;
