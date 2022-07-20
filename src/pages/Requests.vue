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
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Importar" class="mr-2 inline-block" /> -->
						<!-- <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  /> -->
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="List" v-model:selection="selectedItems" dataKey="id" :paginator="true" :rows="10" :filters="filters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} registros" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manejo de solicitudes</h5>
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
							{{slotProps.data.name}} {{slotProps.data.lastname}}
						</template>
					</Column>
					<Column field="initial_contributions" :sortable="true" header="Aportes iniciales" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Aportes iniciales</span>
							{{toMoney(slotProps.data.inicial_contributions)}}
						</template>
					</Column>
					<Column field="initial_savings" header="Ahorros iniciales" :sortable="true" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Ahorros iniciales</span>
							{{toMoney(slotProps.data.initial_savings) }}
						</template>
					</Column>					
					<Column field="email" header="Correo" :sortable="true" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Email</span>
							{{slotProps.data.email}}
						</template>
					</Column>
					<Column field="phone_number" header="Telefono" :sortable="true" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Telefono</span>
							{{slotProps.data.phone_number}}
						</template>
					</Column>
					<Column field="created_at" header="Creacion" :sortable="true" headerStyle="width:14%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">Fecha Registro</span>
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

				<Dialog v-model:visible="itemDialog" :style="{width: '450px'}" header="Detalles del registro" :modal="true" :closable="false" class="p-fluid">
					<div class="field">
						<label for="name">Nombre</label>
						<InputText id="name" v-model.trim="item.name" required="true" autofocus :class="{'p-invalid': submitted && !item.name}" />
						<small class="p-invalid" v-if="submitted && !item.name">El nombre es requerido</small>
					</div>
					<div class="field">
						<label for="name">Apellido</label>
						<InputText id="lastname" v-model.trim="item.lastname" required="true" autofocus :class="{'p-invalid': submitted && !item.lastname}" />
						<small class="p-invalid" v-if="submitted && !item.lastname">El apellido es requerido</small>
					</div>
					<div class="field">
						<label for="dob">Fecha de Nacimiento</label>
						<Calendar :dateFormat="dateFormat" :showIcon="true" :showButtonBar="true" v-model="item.dob" :class="{'p-invalid': submitted && !item.dob}">
						</Calendar>
						<small class="p-invalid" v-if="submitted && !item.dob">El campo Fecha de Nacimiento iniciales es requerido</small>
					</div>
					<div class="field">
						<label for="name">Aportes Iniciales</label>
						<InputText id="inicial_contributions" v-model.trim="item.inicial_contributions" required="true" autofocus :class="{'p-invalid': submitted && !item.inicial_contributions}" />
						<small class="p-invalid" v-if="submitted && !item.inicial_contributions">El campo aportes iniciales es requerido</small>
					</div>
					<div class="field">
						<label for="payment_method_ic" class="mb-3">Metodo de pago (Aportes iniciales)</label>
						<Dropdown id="payment_method_ic" v-model="item.payment_method_ic" :options="paymentMethodList" optionLabel="label" placeholder="Seleciona un Metodo de pago"  
							:class="{'p-invalid': submitted && !item.payment_method_ic}">
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
					<div class="field">
						<label for="name">Ahorros iniciales</label>
						<InputText id="initial_savings" v-model.trim="item.initial_savings" required="true" autofocus :class="{'p-invalid': submitted && !item.initial_savings}" />
						<small class="p-invalid" v-if="submitted && !item.initial_savings">El campo ahorros iniciales es requerido</small>
					</div>
					<div class="field">
						<label for="payment_method_is" class="mb-3">Metodo de pago (Ahorros iniciales)</label>
						<Dropdown id="payment_method_is" v-model="item.payment_method_is" :options="paymentMethodList" optionLabel="label" placeholder="Seleciona un Metodo de pago"  
							:class="{'p-invalid': submitted && !item.payment_method_is}">
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
						<div class="field">
							<label for="email">Correo</label>
							<InputText id="email" v-model.trim="item.email" required="true" autofocus :class="{'p-invalid': submitted && !item.email}" />
							<small class="p-invalid" v-if="submitted && !item.email">El correo es requerido</small>
						</div>
						<div class="field">
							<label for="name">Telefono</label>
							<InputText id="phone_number" v-model.trim="item.phone_number" required="true" autofocus :class="{'p-invalid': submitted && !item.phone_number}" />
							<small class="p-invalid" v-if="submitted && !item.phone_number">El telefono es requerido</small>
						</div>
					</div>
					<template #footer>
						<Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveItem" />
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
import {myDate, dateToEnglish, toMoney} from '../helpers'

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
			submitted: false,
			paymentMethodList: [
				{label: 'Efectivo', value: 'efectivo'},
				{label: 'Trasferencia', value: 'trasferencia'},
				{label: 'Cheque', value: 'cheque'}
			],
			dateFormat: "dd/mm/yy",
			real_dob:null
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
		dateToEnglish,
		toMoney,
        async getList(){
            let response = await axios.get('forms/requests', {
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

					let toSave = {
						"name": this.item.name,
						"lastname": this.item.lastname,
						"dob": dateToEnglish(this.item.dob),
						"payment_method_ic": this.item.payment_method_ic,
						"inicial_contributions": this.item.inicial_contributions,
						"payment_method_is": this.item.payment_method_is,
						"initial_savings": this.item.initial_savings,
						"phone_number": this.item.phone_number,
						"email": this.item.email,
					}

                    await axios.put(`forms/requests/${this.item.id}/`, toSave,
                    {
                        withCredentials: true
                    });
                    
                    this.$toast.add({severity:'success', summary: 'Exitoso', detail: 'Registro Actualizado', life: 3000});
				}
				else{

					let toSave = {
						"name": this.item.name,
						"lastname": this.item.lastname,
						"dob": dateToEnglish(this.item.dob),
						"payment_method_ic": this.item.payment_method_ic.value,
						"inicial_contributions": this.item.inicial_contributions,
						"payment_method_is": this.item.payment_method_is.value,
						"initial_savings": this.item.initial_savings,
						"phone_number": this.item.phone_number,
						"email": this.item.email,
					}

					await axios.post(`forms/requests/`, toSave,{withCredentials: true});
					this.$toast.add({severity:'success', summary: 'Exitoso', detail: 'Registro Creado', life: 3000});
				}
				this.itemDialog = false;
				this.item = {};
			}else{
				this.$toast.add({severity:'error', summary: 'Error', detail: 'Digite la infrmacion correctamente', life: 3000});
			}

            await this.getList();
		},
		editItem(item) {
			this.item = {...item};
			this.item.dob = myDate(item.dob);
			this.itemDialog = true;
		},
		confirmDeleteItem(item) {
			this.item = item;
			this.deleteItemDialog = true;
		},
		async deleteItem() {
			
            await axios.delete(`forms/requests/${this.item.id}/`,
            {
                withCredentials: true
            });

			this.deleteItemDialog = false;
			this.item = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Registro Eliminiado', life: 3000});
            
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
