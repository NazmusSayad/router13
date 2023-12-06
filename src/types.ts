export type Handler = Function
export type NextFunction = (err?: any) => any
export type Options<T = Function> = {
  middleware?: T[]
  errorHandler?: (
    err: any,
    ...args: T extends (...args: any) => any ? Parameters<T> : any[]
  ) => any
}
