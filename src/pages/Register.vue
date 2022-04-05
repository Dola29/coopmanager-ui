<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-1 lg:p-0" style="min-width:80%">
            <div class="col-12 xl:mt-0 text-center">
                <img :src="'layout/images/logo-coop.jpg'" alt="CoopManager Logo" style="" >
            </div>
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; ">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Registro de usuarios</div>
                        <span class="text-600 font-medium">Registrese Para poder acceder</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto">
                        <form @submit.prevent="submit">
                            <label for="name" class="block text-900 text-xl font-medium mb-2">Nombre completo</label>
                            <InputText id="name" v-model="name" type="text" class="w-full mb-3" placeholder="Nombre completo" style="padding:1rem;" />

                            <label for="email" class="block text-900 text-xl font-medium mb-2">Correo</label>
                            <InputText id="email" v-model="email" type="text" class="w-full mb-3" placeholder="Correo" style="padding:1rem;" />
                    
                            <label for="password" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                            <Password id="password" v-model="password" placeholder="Contraseña" :toggleMask="true" 
                                class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem">
                            </Password>
                            <Button label="Registrar" class="w-full p-3 text-xl" type="submit"></button>
                        </form>
                        <div class="flex align-items-center justify-content-between mt-5">
                            <div class="flex align-items-center">
                            </div>
                            <router-link to="/login" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Hacer Login?</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
        }
    },
    computed: {
        logoColor() {
            if (this.$appState.darkTheme) return 'white';
            return 'dark';
        }
    },
    methods:{
        async submit(){
            try{
                const form = {
                    name:this.name,
                    email: this.email,
                    password: this.password
                }
                await axios.post('auth/register', form);
                await this.$router.push('/login');
            }catch (e) {
                console.log(e)
            }
        }
    },
}
</script>

<style scoped>
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}
</style>