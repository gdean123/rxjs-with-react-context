import * as React from 'react'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { BehaviorSubject } from 'rxjs'

interface SomethingElse {
  somethingElse: string
}

interface AppValues {
  count: Count,
  somethingElse: SomethingElse
}

type AppStateTypes = {
  [Key in keyof AppValues]: {
    value: AppValues[Key],
    stream: BehaviorSubject<AppValues[Key]>,
  }
}

type AppState = {
  [Key in keyof AppValues]: BehaviorSubject<AppValues[Key]>
}

const AppContext = React.createContext(null as AppState)

const connect = <
  Key extends keyof AppStateTypes,
  Stream extends AppStateTypes[Key]['stream'],
  Value extends AppStateTypes[Key]['value']
  >(key: Key, Component: (Value) => JSX.Element) => () => {

  const context = useContext(AppContext)
  const [state, setState]: [Value, Dispatch<SetStateAction<Value>>] = useState(null as Value)

  useEffect(() => (context[key] as BehaviorSubject<Value>)
    .subscribe((value: Value) => setState(value))
    .unsubscribe, [])

  return <Component {...state} />
}

interface Count {
  value: number;
}

const Counter = ({ value }: Count) => (
  <p>{value}</p>
)

const ConnectedCounter = connect<'count', BehaviorSubject<Count>, Count>('count', Counter)

let countStream = new BehaviorSubject<Count>({ value: 0 })

ReactDOM.render(
  <AppContext.Provider value={{ count: countStream } as AppState}>
    <ConnectedCounter/>
  </AppContext.Provider>,
  document.getElementById('root'),
)

countStream.next({ value: 123 })
