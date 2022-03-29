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

export default {
  name: "Home",
  setup() {
    const message = ref('');
    const router = useRouter();

    onMounted(async () => {
      try {
        const {data} = await axios.get('auth/user');
        message.value = `Hola ${data.name}`;
      } catch (e) {
        await router.push('auth/login');
      }
    });

    const logout = async () => {
      await axios.post('auth/logout', {}, {withCredentials: true});

      axios.defaults.headers.common['Authorization'] = '';

      await router.push('/login');
    }

    return {
      message,
      logout
    }
  }
}
</script>
