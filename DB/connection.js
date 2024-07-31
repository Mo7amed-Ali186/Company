import  Mongoose from 'mongoose'

export const connection  = async ()=>{
    return await Mongoose.connect(process.env.URI)
    .then((result)=>{
        console.log(" DB Connected Successfully on ..............")
    }).catch(error=>{
        console.log("Fail in Connection");
    })
}