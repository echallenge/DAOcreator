import { Member, GenesisProtocolConfig } from "./index";
import { Address } from "../../../dependency/web3";

export interface DAOMigrationParams {
  orgName: string;
  tokenName: string;
  tokenSymbol: string;
  VotingMachinesParams: GenesisProtocolConfig[];
  schemes: {
    ContributionReward?: boolean;
    SchemeRegistrar?: boolean;
  };
  ContributionReward?: {
    voteParams?: number;
  }[];
  SchemeRegistrar?: {
    voteRegisterParams?: number;
    voteRemoveParams?: number;
  }[];
  unregisterOwner: boolean;
  useUController: boolean;
  useDaoCreator: boolean;
  founders: Member[];
}

export interface DAOMigrationResult {
  arcVersion: string;
  name: string;
  Avatar: Address;
  DAOToken: Address;
  Reputation: Address;
  Controller: Address;
}

export interface DAOMigrationCallbacks {
  userApproval: (msg: string) => Promise<boolean>;
  info: (msg: string) => void;
  error: (msg: string) => void;
  txComplete: (msg: string, txHash: string, txCost: number) => Promise<void>;
  migrationAborted: (err: Error) => void;
  migrationComplete: (result: DAOMigrationResult) => void;
  getState: (network: string) => any;
  setState: (state: any, network: string) => void;
  cleanState: (network: string) => void;
}

export const toJSON = (params: DAOMigrationParams): string => {
  return JSON.stringify(params, null, 2);
};

export const fromJSON = (params: string): DAOMigrationParams => {
  return JSON.parse(params);
};
