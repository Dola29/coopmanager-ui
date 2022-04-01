import { createStore } from "vuex";

export default createStore({
    state:{
        
        authenticated: false,
        user:{            
            name: '',
            email: '',
            role: ''
        }

    },
    mutations: {
        SET_AUTH: (state, auth) => {
            state.authenticated = auth
        },
        SET_USER: (state, obj) => {
            state.user.name = obj.name
            state.user.email = obj.email
            state.user.role = obj.role
        }

    },
    actions: {
        setAuth: (context, val) => {
            context.commit('SET_AUTH', val)
        },
        
        setUser: (context, val) => {
            context.commit('SET_USER', val)
        }
    },
    getters:{
        getAuth: (state) => {
            return state.authenticated
        },
        
    }
})