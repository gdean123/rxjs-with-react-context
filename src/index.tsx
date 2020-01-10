import * as React from 'react'
import { FunctionComponent, useContext, useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { BehaviorSubject } from 'rxjs'

interface State {
  count: Count
}

type StateStreams = {
  [Key in keyof State]: BehaviorSubject<State[Key]>
}

const AppContext = React.createContext<StateStreams>(null)

const connect = <Key extends keyof State>(
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

interface Count {
  value: number;
}

const Counter: FunctionComponent<Count> = ({ value }: Count) => (
  <p>{value}</p>
)

const ConnectedCounter = connect('count', Counter)
let countStream = new BehaviorSubject<Count>({ value: 12 })

ReactDOM.render(
  <AppContext.Provider value={{
    count: countStream
  } as StateStreams}>
    <div>
      <ConnectedCounter/>
    </div>
  </AppContext.Provider>,
  document.getElementById('root'),
)
