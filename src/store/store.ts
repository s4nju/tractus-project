import { ACTIONS } from "@/constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  contracts: ContractType[];
};

type Actions = {
  updateContracts: (contracts: UpdateContractsType, payload: any) => void;
};

type Store = State & Actions;

const contractStatus = ["active", "inactive", "pending"] as const;

export const useStore = create<Store>()(
  immer((set) => ({
    contracts: [],
    updateContracts: (
      updateType: UpdateContractsType,
      payload: {
        id: string;
        data: ContractType["clientName"] | ContractType["status"];
      }
    ) => {
      if (updateType === ACTIONS.UPDATE_STATUS) {
        set((state) => {
          const idx = state.contracts.findIndex(
            (contract) => contract.id === payload.id
          );

          if (
            idx !== -1 &&
            state.contracts[idx] &&
            contractStatus.includes(payload.data as ContractType["status"])
          ) {
            state.contracts[idx].status =
              payload.data as ContractType["status"];
          }
        });
      } else if (updateType === ACTIONS.UPDATE_CLIENT_NAME) {
        set((state) => {
          const idx = state.contracts.findIndex(
            (contract) => contract.id === payload.id
          );

          if (idx !== -1 && state.contracts[idx]) {
            state.contracts[idx].clientName = payload.data;
          }
        });
      }
    },
    setContracts: (contracts: ContractType[]) => {
      set((state) => ({ ...state, contracts }));
    },
  }))
);

export type ContractType = {
  id: string;
  status: "active" | "inactive" | "pending";
  clientName: string;
};

export type UpdateContractsType =
  | typeof ACTIONS.UPDATE_STATUS
  | typeof ACTIONS.UPDATE_CLIENT_NAME;
