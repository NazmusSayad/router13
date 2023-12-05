console.clear()
import router from './index'

const router2 = router.create({
  middleware: [
    (req: any, res: any, next: any) => {
      console.log('Init: 1')
      next()
    },
    (req: any, res: any, next: any) => {
      console.log('Init: 2')
      next()
    },
  ],
})

const router3 = router2.create({
  middleware: [
    (req: any, res: any, next: any) => {
      console.log('After: 1')
      next()
    },
  ],

  errorHandler: (...args: any[]) => {
    console.log('ERROR:', args)
  },
})

const callback = router3(
  async (req: any, res: any, next: any) => {
    console.log(1, req, res, next)
    next()
    // next(new Error('ERROR'))
  },
  (req: any, res: any, next: any) => {
    console.log(2, req, res, next)
    next()
  },
  (req: any, res: any, next: any) => {
    console.log(3, req, res, next)
    next()
  }
)

callback('REQ', 'RES')
