import {Application} from 'express';
import * as http from 'http';
import * as express from 'express';
import * as path from 'path'


class App{
    private app: Application
    private httpServer: any
    private io: any
    public port: number


    constructor(appInit: {port: number , middleWares: any , controllers: any}){
        this.app = express();
        this.httpServer = http.createServer(this.app)
        this.io = require("socket.io")(this.httpServer , {
            cors: {
              origin: '*',
            }
        })
        this.app.use('/storage' , express.static("storage"));
        this.port = appInit.port
        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        
    }



    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }){
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router)
        })
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    public listen(){
        this.httpServer.listen(this.port , ()=>{
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }
}


export default App