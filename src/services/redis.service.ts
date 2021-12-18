import { RedisClientType } from '@node-redis/client/dist/lib/client';
import * as redis from 'redis'


export class RedisService{
    private redisClient;


    constructor(){
        (async () =>{
            const host:string = process.env.REDIS_HOST
            const port:number = parseInt(process.env.REDIS_PORT)
    
            this.redisClient = redis.createClient({
                url: `redis://${host}:${port}`
            })
    
            await this.redisClient.connect();
        })()
    }

    public async set(key: string, value: string, ex:number = 120){
        await this.redisClient.set(key, value, {
            EX: ex
        })
    }

    public async get(key: string){
        return await this.redisClient.get(key)
    }
}