import moment from "moment";

export function myDate(str){
    return moment(str).format('DD/MM/YYYY');    
}

export function toMoney(str){
    let formatter   = new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
    });

    return formatter.format(str);
}