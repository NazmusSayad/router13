export type Handler = (...args: any[]) => any

export type NextFunction = (err?: any) => any

export type Middleware<T extends Handler> = T

export type ErrorHandler<T extends Handler> = (
  err: any,
  ...args: T extends (...args: any) => any ? Parameters<T> : never
) => any

export type Options<T extends Handler = Handler> = {
  middleware?: Middleware<T>[]
  onError?: ErrorHandler<T>
}
