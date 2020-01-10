import { connect } from '~support/state'
import * as React from 'react'

export interface Count {
  value: number;
}

const Counter = ({ value }: Count) => (
  <p>{value}</p>
)

export default connect('count', Counter)
