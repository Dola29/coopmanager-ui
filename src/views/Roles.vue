<template>
    <div class="container">
        <div class="row align-items-center mt-3">
            <div class="card col">
                <h5 class="card-header">Roles</h5>
                <div class="card-body">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in data" :key="item.id">
                                <th scope="row">{{item.id}}</th>
                                <td>{{item.name}}</td>
                                <td>{{item.description}}</td>
                                <td>
                                    <button type="button" class="btn btn-warning me-1 ">Editar</button>
                                    <button type="button" class="btn btn-danger">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        
    </div>
</template>
<script>
import {onMounted, ref, reactive} from "vue";
import axios from "axios";

export default {
    setup() {
        let data = ref([]);

        const getList = async () =>{
            let response = await axios.get('roles', {
                withCredentials: true
            });

            data.value = response.data
            console.log(response.data)
        }

        onMounted(async () => {
            await getList()            
        });

        return{
            data,
        }
    },
}
</script>