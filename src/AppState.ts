export interface AppState {
  daoCreator: DaoCreatorState
  daoController: DaoControllerState
  notification: NotificationState
}

import * as Arc from "./lib/integrations/daoStack/arc"
export interface DaoCreatorState {
  // TODO: Add layer 2 types that make up this state
  step: number
  naming: {
    daoName: string
    tokenName: string
    tokenSymbol: string
  }
  founders: Arc.Founder[]
  schemas: Arc.Schema[]
  votingMachine: Arc.VotingMachine
}

export interface DaoControllerState {
  // TODO: Add layer 2 types that make up this state
}

export interface NotificationState {
  message: string
  type: string
  open: boolean
}