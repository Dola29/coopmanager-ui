<template>
	<div :class="containerClass" @click="onWrapperClick">
        <AppTopBar @menu-toggle="onMenuToggle" :user="user" />
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
            <AppFooter />
        </div>
        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
	</div>
</template>

<script>
import AppTopBar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
import AppFooter from './AppFooter.vue';
import axios from "axios";


export default {
    emits: ['change-theme'],
    data() {
        return {
            user:{},
            layoutMode: 'static',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            menuNormal : [
                {
                    label: 'Menu',
                    items: [
                        {label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'},
                        {label: 'Solicitudes', icon: 'pi pi-fw pi-file', to: '/requests'},
                        {label: 'Prestamos', icon: 'pi pi-fw pi-file', to: '/loans'},
                    ]
                }
            ],
            menuAdmin : [
                {
                    label: 'Menu',
                    items: [
                        {label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'},
                        {label: 'Solicitudes', icon: 'pi pi-fw pi-file', to: '/requests'},
                        {label: 'Prestamos', icon: 'pi pi-fw pi-file', to: '/loans'},
                        {label: 'Roles', icon: 'pi pi-fw pi-chevron-right', to: '/roles'},
						{label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/users'},
                    ]
                }
            ],
            menu : []
        }
    },
    async mounted() {
        let auth = (localStorage.getItem('authenticated') === 'true');
		if(!auth){
			await this.$router.push('/login');
		}
		await this.getUser()
	},
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        }
    },
    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
					if(this.mobileMenuActive === true) {
						this.overlayMenuActive = true;
					}

                    this.overlayMenuActive = !this.overlayMenuActive;
					this.mobileMenuActive = false;
                }
                else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth >= 992;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
            }

            return true;
        },
        async getUser(){
			try {
				const {data} = await axios.get('auth/user', {
                    withCredentials: true
				});

				this.user = data;

                this.menu = this.menuNormal;

                if(this.user.role == 1){
                    this.menu = this.menuAdmin;
                }

			} catch (e) {
				await this.$router.push('/login');
			}
		}
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
				'p-input-filled': this.$primevue.config.inputStyle === 'filled',
				'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        logo() {
            return (this.$appState.darkTheme) ? "images/logo-white.svg" : "images/logo.svg";
        }
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    },
    components: {
        'AppTopBar': AppTopBar,
        'AppMenu': AppMenu,
        'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';
</style>
