import { withLatestFrom, map } from 'rxjs/operators'
import { compose, pure, mapPropsStream, createEventHandler } from 'react-fc'
import { replaceParamsRoute } from '../utils/route'
import { getBooleanFromHistory } from '../utils/get'

const withModal = ({ key, async = false, ...params }) =>
  compose(
    mapPropsStream(props$ => {
      const { handler: onOpen, stream: onOpen$ } = createEventHandler()
      const { handler: onClose, stream: onClose$ } = createEventHandler()
      const { handler: onSubmit, stream: onSubmit$ } = createEventHandler()
      const {
        handler: onAsyncSubmit,
        stream: onAsyncSubmit$
      } = createEventHandler()

      onOpen$
        .pipe(withLatestFrom(props$))
        .subscribe(([, { history }]) => {
          replaceParamsRoute({ [key]: true }, history)
        })

      onClose$
        .pipe(withLatestFrom(props$))
        .subscribe(([, { history }]) =>
          replaceParamsRoute({ [key]: false }, history)
        )

      onSubmit$
        .pipe(withLatestFrom(props$))
        .subscribe(([event, props]) => params.onSubmit(event, props, onClose))

      onAsyncSubmit$
        .pipe(withLatestFrom(props$))
        .subscribe(([event, props]) =>
          params.onSubmit(event, props).then(onClose())
        )

      return props$.pipe(
        map(props => ({
          ...props,
          [key]: {
            onOpen,
            onClose,
            onSubmit: async ? onAsyncSubmit : onSubmit,
            open: getBooleanFromHistory(key, props.history),
            ...props[key]
          }
        }))
      )
    }),
    pure
  )

export default withModal
