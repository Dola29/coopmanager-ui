<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
							<!-- <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedItems || !selectedItems.length" /> -->
						</div>
					</template>

					<template v-slot:end>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Importar" class="mr-2 inline-block" />
						<Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="List" v-model:selection="selectedItems" dataKey="id" :paginator="true" :rows="10" :filters="filters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} registros" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manejo de roles</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
						</div>
					</template>

					<!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
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
					<Column field="description" header="Descripcion" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Descripcion</span>
							{{slotProps.data.description}}
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

				<Dialog v-model:visible="itemDialog" :style="{width: '450px'}" header="Detalles del rol" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Name</label>
						<InputText id="name" v-model.trim="item.name" required="true" autofocus :class="{'p-invalid': submitted && !item.name}" />
						<small class="p-invalid" v-if="submitted && !item.name">Name is required.</small>
					</div>
					<div class="field">
						<label for="description">Description</label>
						<Textarea id="description" v-model="item.description" required="true" rows="3" cols="20" />
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveItem" />
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
			itemDialog: false,
			deleteItemDialog: false,
			deleteItemsDialog: false,
			item: {},
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
	},
	methods: {
        myDate,
        async getList(){
            let response = await axios.get('roles', {
                withCredentials: true
            });

            this.List = response.data
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
			this.submitted = false;
		},
		async saveItem() {
			this.submitted = true;
			
            if (this.item.name.trim()) {
                if (this.item.id) {
                    await axios.put(`roles/${this.item.id}/`, this.item,
                    {
                        withCredentials: true
                    });
                    
                    this.$toast.add({severity:'success', summary: 'Exitoso', detail: 'Rol Actualizado', life: 3000});
				}
				else {
                    await axios.post(`roles/`, this.item,
                    {
                        withCredentials: true
                    });
					this.$toast.add({severity:'success', summary: 'Exitoso', detail: 'Rol Creado', life: 3000});
				}
				this.itemDialog = false;
				this.item = {};
			}

            await this.getList();
		},
		editItem(item) {
			this.item = {...item};
			this.itemDialog = true;
		},
		confirmDeleteItem(item) {
			this.item = item;
			this.deleteItemDialog = true;
		},
		async deleteItem() {
			
            await axios.delete(`roles/${this.item.id}/`,
            {
                withCredentials: true
            });

			this.deleteItemDialog = false;
			this.item = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Rol Eliminiado', life: 3000});
            
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
