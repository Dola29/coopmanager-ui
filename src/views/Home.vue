<template>
  <div class="container mt-5 text-center">
    <h3>{{ message }}</h3>
    <a href="javascript:void(0)" class="btn btn-lg btn-primary"
      @click="logout"
    >Logout</a>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {useStore} from "vuex"

export default {
  name: "Home",
  setup() {
    const message = ref('');
    const router = useRouter();
    const store = useStore(); 

    onMounted(async () => {
      try {
        const {data} = await axios.get('auth/user', {
          withCredentials: true
        });

        message.value = `Hola ${data.name}`;
        
        const user = {
          name: data.name,
          email: data.email,
          role: data.role
        }
        await store.dispatch('setAuth', true)
        await store.dispatch('setUser', user)

      } catch (e) {

        await store.dispatch('setAuth', false)
        await router.push('auth/login');
      }
    });

    const logout = async () => {
      await axios.post('auth/logout', {}, {withCredentials: true});
      axios.defaults.headers.common['Authorization'] = '';
      await router.push('/login');
      location.reload()
    }

    return {
      message,
      logout
    }
  }
}
</script>
