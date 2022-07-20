<template>
	<div class="grid">
		<Toast/>
		<div class="col-12 lg:col-6 xl:col-4">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">Solicitudes Totales</span>
						<div class="text-900 font-medium text-xl">{{lineData.total_solicitudes}}</div>
					</div>
					<div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
						<i class="pi pi-map-marker text-orange-500 text-xl"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-12 lg:col-6 xl:col-4">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">Prestamos Solicitados</span>
						<div class="text-900 font-medium text-xl">{{lineData.total_prestamos}}</div>
					</div>
					<div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
						<i class="pi pi-inbox text-cyan-500 text-xl"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-12 lg:col-6 xl:col-4">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">Contactos</span>
						<div class="text-900 font-medium text-xl">20</div>
					</div>
					<div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
						<i class="pi pi-comment text-purple-500 text-xl"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
	<diV class="col-12">
		<div class="card">
			<h5>Resumen de Solicitudes</h5>
			<Chart type="line" :data="lineData" :options="lineOptions" />
		</div>
	</div>
</template>

<script>
import EventBus from '@/AppEventBus';
import axios from "axios";

export default {
	data() {
		return {
			lineData: {
				total_solicitudes: 0,
				total_prestamos: 0,
				labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
				datasets: [
					{
						label: 'Solicitudes de Prestamos',
						data: [],
						fill: false,
						backgroundColor: '#2f4860',
						borderColor: '#2f4860',
						tension: 0.4
					},
					{
						label: 'Solicitudes de Registro',
						data: [],
						fill: false,
						backgroundColor: '#00bb7e',
						borderColor: '#00bb7e',
						tension: 0.4
					}
				]
			},
			
			lineOptions: null
		}
	},
	
	async mounted() {
		let auth = (localStorage.getItem('authenticated') === 'true');
		if(!auth){
			await this.$router.push('/login');
		}
		await this.getUser()
		await this.getDashboard()
		
	},
	beforeUnmount() {
        EventBus.off('change-theme', this.themeChangeListener );
    },
	created() {
		
	},
	methods: {
		async getUser(){
			try {
				await axios.get('auth/user', {
					withCredentials: true
				});
				
				localStorage.setItem('authenticated', true);
				this.$toast.add({severity:'success', summary: 'Exitoso', detail: 'Acceso Existoso', life: 3000});
			} catch (e) {
				localStorage.setItem('authenticated', false);
				this.$toast.add({severity:'error', summary: 'Error', detail: 'Authenticacion fallida', life: 3000});
				await this.$router.push('/login');
			}
		},
		async getDashboard(){
			try {
				let data = await axios.get('forms/dashboard', {
					withCredentials: true
				});
				this.lineData.datasets[0].data = data.data.loan_line
				this.lineData.datasets[1].data = data.data.register_line
				this.lineData.total_solicitudes = data.data.register_count
				this.lineData.total_prestamos = data.data.loan_count

				console.log(data.data.loan_count)
			
				
			} catch (e) {
				console.log(e)
			}
		}
	}
}
</script>