
import * as ExpressRateLimit from 'express-rate-limit'

export const apiLimiter = ExpressRateLimit({
    windowMs:  (60 * 1000) * 10 ,
    max: 50, 
    message: "Too many request, please try again later"
})