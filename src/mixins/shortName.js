export default{
    methods: {
        short(fullname){
            let names = fullname.split(" ")
            return names[0]
        }
    },
}