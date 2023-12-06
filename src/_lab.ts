console.clear()
import router from './index'

const router2 = router.create<
  (req: string, res: number, next: Function) => any
>({
  middleware: [
    (req, res, next) => {
      return '100'
      console.log('Init: 1')
      next()
    },
    (req, res, next) => {
      console.log('Init: 2')
      next()
    },
  ],

  errorHandler: (err, req, res, next) => {
    console.log('ERROR:', err)
    next()
  },
})

const router3 = router2.create({
  middleware: [
    (req, res, next) => {
      console.log('After: 1')
      next()
    },
  ],

  errorHandler: (...args) => {
    console.log('ERROR:', args)
  },
})

const callback = router3(
  async (req, res, next) => {
    console.log(1, req, res, next)
    next()
  },
  (req, res, next) => {
    console.log(2, req, res, next)
    next()
  },
  (req, res, next) => {
    console.log(3, req, res, next)
    next()
  }
)

console.log(callback('REQ', 'RES'))
