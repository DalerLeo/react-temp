import { prop, omit, map, mapObjIndexed, fromPairs } from 'ramda'
import { compose, pure, mapPropsStream, createEventHandler } from 'react-fc'
import { map as rxMap, withLatestFrom } from 'rxjs/operators'
import { addParamsRoute } from '../utils/route'
import { isNumber } from '../utils/is'
import toNumber from '../utils/toNumber'
import withModal from './withModal'
import {
  getParamsCountFromHistory,
  getInitValuesFromHistory
} from '~/utils/get'

const key = 'filter'
const formValue = 'values'
const getVal = value => {
  if (typeof value === 'object') {
    return prop('id', value)
  }
  return value
}
const getIds = map(getVal)

const withFilter = params => {
  const {
    fields,
    mapValues = getIds,
    mapInitValues = mapObjIndexed(value => {
      if (isNumber(value)) return toNumber(value)
      return value
    })
  } = params

  return compose(
    withModal({ key }),
    mapPropsStream(props$ => {
      const { stream: onSubmit$, handler: onSubmit } = createEventHandler()
      const { stream: onClear$, handler: onClear } = createEventHandler()

      onSubmit$
        .pipe(withLatestFrom(props$))
        .subscribe(([values, { history }]) => {
          addParamsRoute({ ...mapValues(values), [key]: false }, history)
        })

      onClear$.pipe(withLatestFrom(props$)).subscribe(([, { history }]) => {
        const filterValuesToNull = fields.map(item => [item, null])
        const values = fromPairs(filterValuesToNull)
        addParamsRoute({ ...values, [key]: false }, history)
      })

      return props$.pipe(
        rxMap(props => {
          const model = prop(key, props)
          const defaultProps = omit([formValue, key], props)
          const history = prop('history', props)

          return {
            ...defaultProps,
            [`${key}Actions`]: {
              ...model,
              onSubmit,
              onClear,
              count: getParamsCountFromHistory(fields, history),
              initialValues: mapInitValues(
                getInitValuesFromHistory(fields, history)
              )
            }
          }
        })
      )
    }),
    pure
  )
}

export default withFilter
