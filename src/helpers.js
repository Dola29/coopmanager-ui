import moment from "moment";

export function myDate(str){
    return moment(str).format('DD/MM/YYYY');    
}