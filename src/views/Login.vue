<template>
  <main class="form-signin">
    <form @submit.prevent="submit" class="text-center">
      <h1 class="h2 mb-3 fw-normal">Acceso</h1>

      <div class="form-floating">
        <input type="email" class="form-control" name="email" placeholder="usuario@example.com">
        <label>Email</label>
      </div>

      <div class="form-floating">
        <input type="password" class="form-control" name="password" placeholder="Contraseña">
        <label>Contraseña</label>
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">Enviar</button>
    </form>
  </main>
</template>

<script>
import {useRouter} from "vue-router";
import axios from "axios";

export default {
  name: "Login",
  setup() {
    const router = useRouter();

    const submit = async e => {
      try{
        
        const form = new FormData(e.target);

        const inputs = Object.fromEntries(form.entries());

        const {data} = await axios.post('auth/login', inputs, {
          withCredentials: true
        });
        axios.defaults.headers.common['Authorization'] = data['jwt'];
        
        await router.push('/home');
        location.reload()
      }catch (e) {
        console.log(e)
      }
    }

    return {
      submit
    }

  }
}
</script>
