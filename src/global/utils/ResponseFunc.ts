interface Data{
    status:number,
    message:string,
    cookie?:string,
}

export default function ResponseFunc(data:Data){
    return{
        ...data.status && { status : data.status},
        ...data.message && { message : data.message },
        ...data.cookie && { token : data.cookie}
    }
}