import * as nodemailer from 'nodemailer'


export class MailService{

    private transporter: nodemailer.Transporter; 
    private senderAccount: string

    constructor(){
        const host:string = process.env.MAIL_HOST
        const port:number = parseInt(process.env.MAIL_PORT)
        const user:string = process.env.MAIL_USER
        const pass:string = process.env.MAIL_PASSWORD 

        this.transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: false, 
            auth: {
                user: user, 
                pass: pass, 
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        this.senderAccount = user
    }

    public async sendOTP(email: string, code: string){
        let result = await this.transporter.sendMail({
            from: this.senderAccount, 
            to: email, 
            subject: "NEBULA NET", 
            html:`
                <div style="width:40em;padding-top:2em;padding-bottom:2em;margin:auto;background-color:white">
                    <div style="text-align:center;display:flex;background-color:#6A4BFF;width:40em;height:6em">
                        <h1 style="color:#fff;margin:0 auto;padding-top:0.7em">NEBULA NET</h1>
                    </div>
                    <div style="padding:2em;text-align:justify;text-align:justify;direction:rtl;padding-right:4em;padding-left:4em;line-height:25px">
                        <h2>احراز هویت ایمیل</h2>
                        <p>
                            کاربر گرامی کد احراز هویت ایمیل شما <b>${code}</b> می باشد
                        </p>
                    </div>
                </div>
            `,
        }); 

        return result
    }
}