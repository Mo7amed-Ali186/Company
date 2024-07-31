import bcrypt from'bcrypt'
export const hashPassword=({plaintext,salt= +process.env.SALT_ROUND}={})=>{
    const hashResult=bcrypt.hashSync(plaintext,parseInt(salt))
    return hashResult;
}


export const comparePassword=({plaintext,hashValue}={})=>{
    const match=bcrypt.compareSync(plaintext,hashValue)
    return match
}