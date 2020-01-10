import { BehaviorSubject } from 'rxjs'
import * as React from 'react'
import { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Count } from '~components/Counter'

interface State extends AppState {
  count: Count
}

export interface AppState {
  [name: string]: object
}

export type StateStreams = {
  [Key in keyof State]: BehaviorSubject<State[Key]>
}

const AppContext = React.createContext<StateStreams>(null)

export const provide = (component: JSX.Element, appState: StateStreams) =>
  <AppContext.Provider value={appState}>
    {component}
  </AppContext.Provider>

export const connect = <Key extends keyof State>(
  key: Key,
  Component: FunctionComponent<State[Key]>
) => () => {
  const context: StateStreams = useContext(AppContext)
  const [state, setState] = useState(null)

  useEffect(() => (context[key] as BehaviorSubject<State[Key]>)
    .subscribe((value: State[Key]) => setState(value))
    .unsubscribe, [])

  return <Component {...state as any} />
}