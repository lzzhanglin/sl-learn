import {AppState } from './app'

type LoadingType = {
    global: boolean,
    models: object, 
    effects: object,
}

export interface ConnectState{
    app: AppState,
    loading: LoadingType,
}