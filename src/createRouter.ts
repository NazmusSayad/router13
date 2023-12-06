export default function createRouter<TRootParent extends Function>(
  options: Options<TRootParent> = {}
) {
  const currentOptions = { ...options }

  function router<T>(...args: (T extends Function ? T : TRootParent)[]) {
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

  router.create = function <TRoot extends Function = TRootParent>(
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

export type Handler = Function
export type NextFunction = (err?: any) => any
export type Options<T = Function> = {
  middleware?: T[]
  errorHandler?: (
    err: any,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ) => any
}
