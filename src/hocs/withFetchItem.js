import { compose, pure, mapPropsStream } from 'react-fc'
import { connect } from 'react-redux'
import { distinctUntilChanged, filter } from 'rxjs/operators'
import { getIdFromProps, getDataFromState } from '../utils/get'

const withFetchItem = params => {
  const {
    stateName,
    action,
    idKey = 'id',
    key = 'item',
    filterId = getIdFromProps(idKey),
    onSuccess
  } = params

  const mapStateToProps = state => ({
    [key]: getDataFromState(stateName, state)
  })
  const actionKey = `${key}Action`

  return compose(
    connect(
      mapStateToProps,
      { [actionKey]: action }
    ),
    mapPropsStream(props$ => {
      props$
        .pipe(
          distinctUntilChanged(null, filterId),
          filter(filterId)
        )
        .subscribe(
          props => props[actionKey](getIdFromProps(idKey, props), props)
            .then(data => {
              if (onSuccess) {
                onSuccess(data, props)
              }
            })
        )

      return props$
    }),
    pure
  )
}

export default withFetchItem
