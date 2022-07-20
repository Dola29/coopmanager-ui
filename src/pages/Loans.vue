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
							<h5 class="m-0">Manejo de Prestamos</h5>
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
					<Column field="cedula" :sortable="true" header="Cedula" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Cedula</span>
							{{slotProps.data.cedula}}
						</template>
					</Column>
					<Column field="loan_amount" header="Monto Solicitado" :sortable="true" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Monto Solicitado</span>
							{{toMoney(slotProps.data.loan_amount)}}
						</template>
					</Column>					
					<Column field="monthly_income" header="Ingresos Mensuales" :sortable="true" headerStyle="width:25%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Ingresos Mensuales</span>
							{{toMoney(slotProps.data.monthly_income)}}
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
						<label for="lastname">Apellido</label>
						<InputText id="lastname" v-model.trim="item.lastname" required="true" autofocus :class="{'p-invalid': submitted && !item.lastname}" />
						<small class="p-invalid" v-if="submitted && !item.lastname">El apellido es requerido</small>
					</div>
					<div class="field">
						<label for="cedula">Cedula</label>
						<InputText id="cedula" v-model.trim="item.cedula" required="true" autofocus :class="{'p-invalid': submitted && !item.cedula}" />
						<small class="p-invalid" v-if="submitted && !item.cedula">El campo cedula iniciales es requerido</small>
					</div>
					
					<div class="field">
						<label for="monthly_income">Ingresos Mensuales</label>
						<InputText id="monthly_income" v-model.trim="item.monthly_income" required="true" autofocus :class="{'p-invalid': submitted && !item.monthly_income}" />
						<small class="p-invalid" v-if="submitted && !item.monthly_income">El campo Ingresos Mensuales es requerido</small>
					</div>
					<div class="field">
						<label for="loan_amount">Monto Solicitado</label>
						<InputText id="loan_amount" v-model.trim="item.loan_amount" required="true" autofocus :class="{'p-invalid': submitted && !item.loan_amount}" />
						<small class="p-invalid" v-if="submitted && !item.loan_amount">El campo Monto Solicitado es requerido</small>
					</div>
					<div class="field">
						<label for="dob">Fecha de Nacimiento</label>
						<Calendar :dateFormat="dateFormat" :showIcon="true" :showButtonBar="true" v-model="item.dob" :class="{'p-invalid': submitted && !item.dob}">
						</Calendar>
						<small class="p-invalid" v-if="submitted && !item.dob">El campo Fecha de Nacimiento iniciales es requerido</small>
					</div>
					<div class="field">
						<label for="phone_number">Telefono</label>
						<InputText id="phone_number" v-model.trim="item.phone_number" required="true" autofocus :class="{'p-invalid': submitted && !item.phone_number}" />
						<small class="p-invalid" v-if="submitted && !item.phone_number">El campo telefono es requerido</small>
					</div>
					<div class="field">
						<label for="email">Email</label>
						<InputText id="email" v-model.trim="item.email" required="true" autofocus :class="{'p-invalid': submitted && !item.email}" />
						<small class="p-invalid" v-if="submitted && !item.email">El campo email es requerido</small>
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
            let response = await axios.get('forms/loans', {
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
						"cedula": this.item.cedula,
						"loan_amount": this.item.loan_amount,
						"monthly_income": this.item.monthly_income,
						"phone_number": this.item.phone_number,
						"email": this.item.email,
					}

                    await axios.put(`forms/loans/${this.item.id}/`, toSave,
                    {
                        withCredentials: true
                    });
                    
                    this.$toast.add({severity:'success', summary: 'Exitoso', detail: 'Registro Actualizado', life: 3000});
				}
				else { 
					let toSave = {
						"name": this.item.name,
						"lastname": this.item.lastname,
						"dob": dateToEnglish(this.item.dob),
						"cedula": this.item.cedula,
						"loan_amount": this.item.loan_amount,
						"monthly_income": this.item.monthly_income,
						"phone_number": this.item.phone_number,
						"email": this.item.email,
					}
                    await axios.post(`forms/loans/`, toSave,
                    {
                        withCredentials: true
                    });
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
			
            await axios.delete(`forms/loans/${this.item.id}/`,
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
