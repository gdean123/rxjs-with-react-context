import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { provide, StateStreams } from '~support/state'
import Counter, { Count } from '~components/Counter'
import { BehaviorSubject } from 'rxjs'

const appState: StateStreams = {
  count: new BehaviorSubject<Count>({ value: 12 })
}

ReactDOM.render(
  provide(<Counter/>, appState),
  document.getElementById('root'),
)
