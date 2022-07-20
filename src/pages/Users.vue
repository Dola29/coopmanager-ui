<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>

					<template v-slot:end>
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Importar" class="mr-2 inline-block" /> -->
						<!-- <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  /> -->
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="List" v-model:selection="selectedItems" dataKey="id" :paginator="true" :rows="10" :filters="filters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} registros" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manejo de Usuarios</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
						</div>
					</template>
					<Column field="id" header="ID" :sortable="true" headerStyle="width:3%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">ID</span>
							{{slotProps.data.id}}
						</template>
					</Column>
					<Column field="name" header="Nombre" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Nombre</span>
							{{slotProps.data.name}}
						</template>
					</Column>
					<Column field="email" header="Correo" :sortable="true" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Correo</span>
							{{slotProps.data.email}}
						</template>
					</Column>
					<Column field="role.name" header="Rol" :sortable="true" headerStyle="width:5%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Rol</span>
							{{slotProps.data.role ? slotProps.data.role.label : "POR ASIGNAR" }}
						</template>
					</Column>
					<Column field="created_at" header="Creacion" :sortable="true" headerStyle="width:14%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">Creacion</span>
							{{myDate(slotProps.data.created_at)}}
						</template>
					</Column>
				
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editItem(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteItem(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="itemDialog" :style="{width: '450px'}" header="Detalles del rol" :modal="true" :closable="false" class="p-fluid">
					<div class="field">
						<label for="name">Nombre</label>
						<InputText id="name" v-model.trim="item.name" required="true" autofocus :class="{'p-invalid': submitted && !item.name}" />
						<small class="p-invalid" v-if="submitted && !item.name">El nombre es requerido.</small>
					</div>
					<div class="field">
						<label for="email">Correo</label>
						<InputText id="email" type="email" v-model.trim="item.email" required="true" autofocus :class="{'p-invalid': submitted && !item.email}" />
						<small class="p-invalid" v-if="submitted && !item.email">El correo es requerido</small>
					</div>					
					<div v-if="!edit" class="field">
						<label for="password">Contraseña</label>
						<Password id="password" v-model.trim="item.password" required="true" autofocus :toggleMask="true"
							:class="{'p-invalid': submitted && !item.password}">
                        </Password>
						<small class="p-invalid" v-if="submitted && !item.password">El correo es requerido</small>
					</div>
					<div v-if="!edit" class="field">
						<label for="role" class="mb-3">Rol</label>
						<Dropdown id="role" v-model="item.role" :options="roleList" optionLabel="label" placeholder="Seleciona un rol">
						</Dropdown>
					</div>
					<div v-if="edit" class="field">
						<label for="role" class="mb-3">Rol</label>
						<Dropdown id="role" v-model="item.role" :options="roleList" optionLabel="label" placeholder="Seleciona un rol"  :class="{'p-invalid': submitted && !item.role}">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span>{{slotProps.value.label}}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span>{{slotProps.value}}</span>
								</div>
								<span v-else>
									{{slotProps.placeholder}}
								</span>
							</template>
						</Dropdown>
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Gruardar" icon="pi pi-check" class="p-button-text" @click="saveItem" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteItemDialog" :style="{width: '450px'}" header="Confirmar" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="item">Estas seguro que deseas borrar <b>{{item.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteItemDialog = false"/>
						<Button label="Si" icon="pi pi-check" class="p-button-text" @click="deleteItem" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteItemsDialog" :style="{width: '450px'}" header="Confirmar" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="item">Estas seguro que deseas borrar estos items?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteItemsDialog = false"/>
						<Button label="Si" icon="pi pi-check" class="p-button-text" @click="deleteSelectedItems" />
					</template>
				</Dialog>

			</div>
		</div>
	</div>

</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import axios from "axios";
import {myDate} from '../helpers'

export default {
	data() {
		return {
			List: null,
			roleList: null,
			itemDialog: false,
			deleteItemDialog: false,
			deleteItemsDialog: false,
			edit: false,
			item: null,
			selectedItems: null,
			filters: {},
			submitted: false
		}
	},
	created() {
		this.initFilters();
	},
	async mounted() {
		await this.getList();
		await this.getRoleList();
	},
	methods: {
        myDate,
        async getList(){
            let response = await axios.get('users/list', {
                withCredentials: true
            });

            this.List = response.data
        },
		async getRoleList(){
            let response = await axios.get('roles/getlist', {
                withCredentials: true
            });

            this.roleList = response.data
        },
		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
		},
		openNew() {
			this.item = {};
			this.submitted = false;
			this.itemDialog = true;
		},
		hideDialog() {
			this.itemDialog  = false;
			this.edit  = false;
			this.submitted = false;
		},
		async saveItem() {
			this.submitted = true;
			if (this.item.id) {
				let user = { 
					name : this.item.name,
					email : this.item.email,
					role : this.item.role.value,
				}
				
				await axios.put(`users/${this.item.id}/`, user,
				{
					withCredentials: true
				});
				
				this.$toast.add({severity:'success', summary: 'Exitoso', detail: 'Usuario Actualizado', life: 3000});
			}
			else {
				if (!this.item.name || !this.item.email || !this.item.password ) {
					this.$toast.add({severity:'error', summary: 'Error', detail: 'Modifique el formulario para guardar', life: 3000});
				}else if(!this.item.role){
					this.$toast.add({severity:'error', summary: 'Error', detail: 'El campo Rol es obligatorio', life: 3000});
				}else{
					let user = { 
						name : this.item.name,
						email : this.item.email,
						password : this.item.password,
						role : this.item.role.value,
					}
					try{
						await axios.post(`users/`, user,
						{
							withCredentials: true
						});
						this.$toast.add({severity:'success', summary: 'Exitoso', detail: 'Usuario Creado', life: 3000});
					}catch(e){
						console.log(e)
					}	
				}				
			}
			this.itemDialog = false;
			this.edit = false;
			this.item = {};
			
            await this.getList();
		},
		editItem(item) {
			this.item = {...item};
			this.edit = true
			this.itemDialog = true;
		},
		confirmDeleteItem(item) {
			this.item = item;
			this.deleteItemDialog = true;
		},
		async deleteItem() {
			
            await axios.delete(`users/${this.item.id}/`,
            {
                withCredentials: true
            });

			this.deleteItemDialog = false;
			this.item = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Usuario Eliminiado', life: 3000});
            
            await this.getList();
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        }
	}
}
</script>

<style scoped lang="scss">
@import '../assets/demo/badges.scss';
</style>
