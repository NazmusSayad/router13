console.clear()
import router from './index'

const router2 = router
  .use<(req: string, res: number, next: Function) => any>((req, res, next) => {
    console.log('Init: 1')
    return next()
  })
  .onError((err, req, res, next) => {
    console.log('ERROR:', err)
  })

const router3 = router2
  .use<(req: string, res: string, next: Function) => any>((req, res, next) => {
    console.log('Init: 2')
    return next()
  })
  .onError((...args) => {
    console.log('ERROR:', args)
  })

const callback = router3(
  async (req, res, next) => {
    console.log(1, req, res, next)
    return next()
  },
  (req, res, next) => {
    console.log(2, req, res, next)
    return next()
  },
  (req, res) => {
    console.log(3, req, res)
    return 'DATA'
  }
)

callback('REQ', 'RES').then(console.log)
