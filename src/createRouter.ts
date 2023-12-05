export default function createRouter(options: Options = {}) {
  const currentOptions = { ...options }

  function router(...args: Function[]) {
    const handlers = [...(currentOptions.middleware ?? []), ...args]
    let index = 0

    async function run(...internalArgs: any[]) {
      try {
        const internalArgsWithNext = [
          ...internalArgs,
          (err: any) => {
            if (err) throw err
            run(...internalArgs)
          },
        ]

        const currentFn = handlers[index++]
        const returnedValue = currentFn?.(...internalArgsWithNext)
        if (returnedValue instanceof Promise) await returnedValue
      } catch (err: any) {
        currentOptions.errorHandler?.(err, ...internalArgs)
      }
    }

    return run
  }

  router.create = function (options: Options = {}) {
    return createRouter({
      ...currentOptions,
      ...options,
      middleware: [
        ...(currentOptions.middleware ?? []),
        ...(options.middleware ?? []),
      ],
    })
  }

  return router
}

export type Options = {
  middleware?: Function[]
  errorHandler?: Function
}
