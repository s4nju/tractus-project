import React, { useEffect, useState } from "react";
import { useAppSocket } from "@/hooks/useAppSocket";
import TableComponent from "./components/contracts-table";
import { useStore } from "./store/store";
import { Moon, Sun } from "lucide-react";
import { Switch } from "./components/ui/switch";
import { ACTIONS } from "./constants";

const App = () => {
  const [theme, setTheme] = useState("dark");
  const contracts = useStore((state: any) => state.contracts);
  const setContracts = useStore((state: any) => state.setContracts);
  const updateContracts = useStore((state: any) => state.updateContracts);

  const { sendMessage } = useAppSocket((data: any) => {
    if (data === "pong") {
      console.log(data);
      return;
    }

    const recievedData = JSON.parse(data.data);

    if (
      recievedData.type === ACTIONS.GET_CONTRACTS ||
      recievedData.type === ACTIONS.EDIT_CONTRACT ||
      recievedData.type === ACTIONS.DELETE_CONTRACT
    ) {
      setContracts(recievedData.data);
    }

    if (recievedData.type === ACTIONS.UPDATE_STATUS) {
      updateContracts(ACTIONS.UPDATE_STATUS, recievedData.data);
    }

    if (recievedData.type === ACTIONS.UPDATE_CLIENT_NAME) {
      updateContracts(ACTIONS.UPDATE_CLIENT_NAME, recievedData.data);
    }

    if (recievedData.type === ACTIONS.ADD_CONTRACT) {
      setContracts([...contracts, recievedData.data]);
    }
  });

  const handleChangeTheme = () => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  useEffect(() => {
    sendMessage(ACTIONS.GET_CONTRACTS);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto pt-10">
      <div className="flex items-center justify-between mx-2">
        <div className="text-2xl font-bold mb-4 text-foreground">
          TractUs Project
        </div>
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-foreground" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={handleChangeTheme}
          />
          <Sun className="h-4 w-4 text-foreground" />
        </div>
      </div>

      <TableComponent contracts={contracts} sendMessage={sendMessage} />
    </div>
  );
};

export default App;
