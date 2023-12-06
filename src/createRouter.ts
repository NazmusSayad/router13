import { Handler, Options } from "./types"

export default function createRouter<TRootParent extends Handler>(
  options: Options<TRootParent> = {}
) {
  const currentOptions = { ...options }

  function router<T>(...args: (T extends Handler ? T : TRootParent)[]) {
    const handlers = [...(currentOptions.middleware ?? []), ...args]
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
        return currentOptions.errorHandler?.(err, ...(internalArgs as any))
      }
    }

    return function (...args: any[]) {
      index = 0
      return run(...args)
    }
  }

  router.create = function <TRoot extends Handler = TRootParent>(
    options: Options<TRoot> = {}
  ) {
    return createRouter<TRoot>({
      ...currentOptions,
      ...options,
      middleware: [
        ...(currentOptions.middleware ?? []),
        ...(options.middleware ?? []),
      ],
    } as Options<TRoot>)
  }

  return router
}
