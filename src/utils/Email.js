import nodemailer from "nodemailer";
export const sendEmail= async ({from= process.env.EMAIL,to,subject,cc,text,html,attachments}={})=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      

        const info = await transporter.sendMail({
          from: `"clozer....... 👻" ${from}`, // sender address
          to, 
          subject,
          cc, 
          text, 
          html,
          attachments 
        });
      
return info.rejected.length ? false:true
    
}
