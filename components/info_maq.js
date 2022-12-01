Vue.component('info_maq',{
	data: function(){
		return{
            bloque: null
		}
	},
	mounted: function(){
        //console.log("Info Maqq");
        
	},
    
    methods:{
        
    },
    template:`
            <div class="modal fade" id="info_maq" tabindex="-1" aria-labelledby="info_maq" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen modal-fullscreen-sm-down">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">INFORMACIÓN DE MÁQUINA #{{$store.state.info_maq.NUM_MAQ}}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">   
                                <div class="col-sm-3">                                      
                                    <table width="100%" class="table table-bordered" border="1">
                                     <tr>
                                            <th colspan="2" style="background:#fb8500">INFORMACIÓN DE MÁQUINA</th>
                                        </tr>    
                                        <tr>
                                            <th>MAQUINA:</th><td>{{$store.state.info_maq.GRUPO_MAQUINA}}.{{$store.state.info_maq.SUBGRUPO_MAQUINA}}.{{$store.state.info_maq.NUM_MAQ}}</td>
                                        </tr>
                                        <tr>
                                            <th>IP LOGO:</th><td>{{$store.state.info_maq.IP_LOGO}} - PUERTO: {{$store.state.info_maq.PUERTO_LOGO}}</td>
                                        </tr>
                                        <tr>
                                            <th>REFERENCIA:</th><td>{{$store.state.info_maq.NIVEL_ESTRUTURA}}.{{$store.state.info_maq.GRUPO_ESTRUTURA}}.{{$store.state.info_maq.SUBGRU_ESTRUTURA}}.{{$store.state.info_maq.ITEM_ESTRUTURA}}</td>
                                        </tr>
                                        <tr>
                                            <th>VEL. FT.:</th><td>{{$store.state.info_maq.VELOCIDADE}}</td>
                                        </tr>
                                        <tr>
                                            <th>EFIC. FT:</th><td>{{$store.state.info_maq.EFICIENCIA}}</td>
                                        </tr>
                                        <tr>
                                            <th>SITUACIÓN:</th><td><span class="badge rounded-pill bg-success" v-if="$store.state.info_maq.SITUACION=='ACTIVA'">{{$store.state.info_maq.SITUACION}}</span><span class="badge rounded-pill bg-danger" v-else>{{$store.state.info_maq.SITUACION}}</span></td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-sm-3">
                                    <table width="100%" border="1">
                                     <tr>
                                            <th colspan="2" style="background:#ef476f">UBICACION MÁQUINA</th>
                                        </tr>  
                                        <tr>
                                            <th>MAQUINA:</th><td><input type="text" class="form-control form-control-sm" v-model="$store.state.info_maq.NUM_MAQ"></td>
                                        </tr>  
                                        <tr>
                                            <th>BLOQUE:</th><td><input type="text" class="form-control form-control-sm" v-model="$store.state.info_maq.BLOQUE"></td>
                                        </tr>
                                        <tr>
                                            <th>POSICIÓN:</th><td><input type="text" class="form-control form-control-sm" v-model="$store.state.info_maq.POS"></td>
                                        </tr>
                                        <tr>
                                            <th>IP-LOGO:</th><td><input type="text" class="form-control form-control-sm" v-model="$store.state.info_maq.IP_LOGO"></td>
                                        </tr>
                                        <tr>
                                            <th>PUERTO:</th><td><input type="text" class="form-control form-control-sm" v-model="$store.state.info_maq.PUERTO_LOGO"></td>
                                        </tr>  
                                        <tr>
                                            <td colspan="2" class="text-center">
                                            <button type="button" class="btn btn-secondary btn-sm">Eliminar Pos.</button>
                                                <button type="button" class="btn btn-primary btn-sm">Actualizar Pos.</button>
                                                <button type="button" class="btn btn-success btn-sm">Actualizar Logo</button>
                                            </td>
                                        </tr>                                          
                                    </table>
                                </div>
                                <div class="col-sm-3">
                                    <info_tablet :ip="$store.state.info_maq.IP_LOGO" :num_maq="$store.state.info_maq.NUM_MAQ"></info_tablet>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Send message</button>
                        </div>
                    </div>
                </div>
            </div>
            `,
})
