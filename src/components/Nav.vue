<template>
    <header class="p-3 bg-dark text-white">
        <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <a v-if="auth" class="btn btn-secondary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                    <i class="fa-solid fa-bars"></i>
                </a>
                <ul  class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li  v-if="!auth">
                        <router-link to="/" class="nav-link px-2 text-white">Home</router-link>
                    </li>
                </ul>

                <div v-if="!auth" class="text-end">
                    <router-link to="/login" class="btn btn-outline-light me-2">Login</router-link>
                    <router-link to="/register" class="btn btn-outline-light me-2">Registrar</router-link>
                </div>
                <div v-show="auth" class="text-end">
                    <a class="btn btn-outline-light me-2">{{user.email}}</a>
                </div>
            </div>
        </div>
    </header>
</template>

<script>

import {useStore} from "vuex";
import {computed} from "vue";

export default {
    name:"Nav",
    setup() {
        const store = useStore(); 
        const auth = computed(()=> store.state.authenticated)
        const user = computed(()=> store.state.user)
        return{
            auth,
            user 
        }
    },
}
</script>