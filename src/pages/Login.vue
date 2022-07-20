<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Toast/>
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <img :src="'layout/images/logo-coop.jpg'" alt="Sakai logo" class="mb-5" >
            </div>
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Acceso</div>
                        <span class="text-600 font-medium">Haga login para continuar</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto">
                        <form @submit.prevent="submit">
                            <label for="email" class="block text-900 text-xl font-medium mb-2">Correo</label>
                            <InputText id="email" v-model="email" type="text" class="w-full mb-3" placeholder="Email" required style="padding:1rem;" />
                    
                            <label for="password" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                            <Password id="password" v-model="password" placeholder="Password" :toggleMask="true"  required
                                class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem">
                            </Password>
                            <Button label="Acceder" class="w-full p-3 text-xl" type="submit"></button>
                        </form>
                        
                        <div class="flex align-items-center justify-content-between mt-5">
                            <div class="flex align-items-center">
                            </div>
                            <router-link to="/register" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Registrate</router-link>
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
    maunted(){
        localStorage.setItem('authenticated', false);
    },
    methods:{
        async submit(){
            try{
                
                const form = {
                    email: this.email,
                    password: this.password
                }
                const {data} = await axios.post('auth/login', form, {
                    withCredentials: true
                });
                axios.defaults.headers.common['Authorization'] = data['jwt'];
                await this.$router.push('/');
            }catch (e) {
                this.$toast.add({severity:'error', summary: 'Error', detail: 'Usuario o contraseña invalido', life: 3000});
                location.reload()
            }
        }
    }
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