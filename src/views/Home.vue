<template>
  <div class="container mt-5 text-center">
    <h3>{{ message }}</h3>
    <!-- <a href="javascript:void(0)" class="btn btn-lg btn-primary"
      @click="logout"
    >Logout</a> -->
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
        const {data} = await axios.get('auth/user', {
          withCredentials: true
        });

        message.value = `Hola ${data.name}`;

        let user = {            
            name: data.name,
            email: data.email,
            role: data.role
        }

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authenticated', true);
        
      } catch (e) {
        localStorage.setItem('authenticated', false);
        await router.push('/login');
      }
      
    });

    return {
      message
    }
  }
}
</script>
