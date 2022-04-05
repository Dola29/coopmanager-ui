<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" />
			<span>Coopmanager</span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li class="layout-topbar-submenu">
				{{user.email}}
				<button class="p-link layout-topbar-button" @click="logout">
					<i class="pi pi-sign-out"></i>
					<span>logout</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script>

import axios from 'axios';

export default {
	props:{
		user:{}
	},
	data() {
		return {
			
		}
	},
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
		onTopbarMenuToggle(event) {
            this.$emit('topbar-menu-toggle', event);
        },
		topbarImage() {
			return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
		},
		async logout(){
			axios.post('auth/logout', {}, {withCredentials: true});
			axios.defaults.headers.common['Authorization'] = '';
			this.$router.push('/login');
		}
    },
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>