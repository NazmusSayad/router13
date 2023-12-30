import { ErrorHandler, Handler, Options, Middleware } from './types'

export default function createRouter<TRootParent extends Handler>(
  options: Options<TRootParent> = {}
) {
  const oldOptions = { ...options }

  function router<T extends Handler = TRootParent>(...args: T[]) {
    const handlers = [...(oldOptions.middleware ?? []), ...args]
    let index = 0

    async function run(...internalArgs: any[]) {
      try {
        const internalArgsWithNext = [
          ...internalArgs,
          (err: any) => {
            if (err) throw err
            return run(...internalArgs)
          },
        ]

        const currentFn = handlers[index++] as TRootParent
        const returnedValue = currentFn?.(...internalArgsWithNext)
        if (returnedValue instanceof Promise) await returnedValue
        return returnedValue
      } catch (err: any) {
        return oldOptions.onError?.(err, ...(internalArgs as any))
      }
    }

    return function (...args: any[]) {
      index = 0
      return run(...args)
    }
  }

  router.use = function <TRoot extends Handler = TRootParent>(
    ...args: Middleware<TRoot>[]
  ) {
    return createRouter<TRoot>({
      ...oldOptions,
      middleware: [...(oldOptions.middleware ?? []), ...args],
    } as Options<TRoot>)
  }

  router.onError = function (onError: ErrorHandler<TRootParent>) {
    return createRouter({
      ...oldOptions,
      onError: onError,
    })
  }

  return router
}
