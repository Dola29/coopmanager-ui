import moment from "moment";

export function myDate(str){
    return moment(str).format('DD/MM/YYYY');    
}

export function dateToEnglish(str){
    let date =  moment(str).format('YYYY-MM-DD');  
    console.log(date);
    return date + "T23:12:16.119443Z";
}

export function toMoney(str){
    let formatter   = new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
    });

    return formatter.format(str);
}