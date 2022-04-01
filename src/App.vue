<template>
  <Nav/>
  <router-view/>
  <div class="offcanvas offcanvas-start bg-dark text-white" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
    <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 280px;">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
        <span class="fs-4">Menu</span>
      </a>
      <hr>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link text-white">
            Home
          </router-link>
        </li>
        <li>
          <router-link to="/roles" class="nav-link text-white">
            Roles
          </router-link>
        </li>
        <li>
          <router-link to="/users" class="nav-link text-white">
            users
          </router-link>
        </li>
      </ul>
      <hr>
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
          <!-- <strong>{{userShortName(user.name)}}</strong> -->
        </a>
        <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1" style="">
          <li><a class="dropdown-item" href="#"  @click="logout">Sign out</a></li>
        </ul>
      </div>
    </div>
  </div>  
</template>

<script>
import Nav from "@/components/Nav"
import axios from "axios";
import {useRouter} from "vue-router";

export default {
  components:{Nav},
  setup() {
    
    const router = useRouter();

    let user = JSON.parse(localStorage.getItem('user')); 
    let auth = (localStorage.getItem('authenticated') === 'true');

    const userShortName = (name) =>{
      let names = name.split(" ")
      return names[0]
    }

    const logout =  () => {
      localStorage.removeItem('user');
      localStorage.removeItem('authenticated');
      axios.post('auth/logout', {}, {withCredentials: true});
      axios.defaults.headers.common['Authorization'] = '';
      router.push('/');
      location.reload()
    }

    return{
      logout,
      userShortName,
      auth,
      user
    }
  },
}
</script>

<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.offcanvas-start {
  width: 280px !important;
}
</style>
