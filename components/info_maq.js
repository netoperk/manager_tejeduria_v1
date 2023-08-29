Vue.component('info_maq',{
	data: function(){
		return{
            bloque: null
		}
	},
	mounted: function(){
        console.log("Info Maqq");
        
	},
    
    methods:{

        stopInterval(){
            clearInterval(this.$store.state.interval_logo);
        },
        async actualizarPos(){
            var v_maq     = this.$store.state.info_maq.NUM_MAQ;
            var v_bloque  = this.$store.state.info_maq.BLOQUE;
            var v_pos     = this.$store.state.info_maq.POS;                       

            axios.post('modulos/mod_manager_tejeduria.php',{
                    maq     : v_maq,
                    bloque  : v_bloque,
                    pos     : v_pos,
                    flag : 1
                }).then(ress => {                        
                        if(ress.data === 1){
                            alert("Posición actualizada");
                            return false;
                        }else{                            
                            alert("Error al intentar actualizar la posición,revise la consola");
                            console.log(ress.data);
                            return false;
                        }
                }).catch(e => {
                    console.log(e); 
                });            
        },
        async eliminarLogo(){
            var v_ip        = this.$store.state.info_maq.IP_LOGO;
            var v_maq       = this.$store.state.info_maq.NUM_MAQ;
            var v_port      = this.$store.state.info_maq.PUERTO_LOGO;

            axios.post('modulos/mod_manager_tejeduria.php',{
                    ip      : v_ip,
                    maq     : v_maq,
                    port    : v_port,
                    flag    : 2
                }).then(ress => {                        
                        if(ress.data === 1){
                            alert("Asignación eliminada correctamente");
                            return false;
                        }else{                            
                            alert("Error al intentar eliminar asignación,revise la consola");
                            console.log(ress.data);
                            return false;
                        }
                }).catch(e => {
                    console.log(e); 
                });
        },
        async asignarLogo(){
            var v_ip        = this.$store.state.info_maq.IP_LOGO;
            var v_maq       = this.$store.state.info_maq.NUM_MAQ;
            var v_port      = this.$store.state.info_maq.PUERTO_LOGO;

            axios.post('modulos/mod_manager_tejeduria.php',{
                    ip      : v_ip,
                    maq     : v_maq,
                    port    : v_port,
                    flag    : 3
                }).then(ress => {                        
                        if(ress.data === 1){
                            alert("Asignación realizada correctamente");
                            return false;
                        }else if(ress.data == 2){
                            alert("Debe eliminar la asignación actual");
                            return false;
                        }else{                            
                            alert("Error al intentar hacer la asignación,revise la consola");
                            console.log(ress.data);
                            return false;
                        }
                }).catch(e => {
                    console.log(e); 
                });
        }

        
    },
    template:`
            <div class="modal fade" id="info_maq" tabindex="-1" aria-labelledby="info_maq" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">INFORMACIÓN DE MÁQUINA #{{$store.state.info_maq.NUM_MAQ}}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">   
                                <div class="col-sm-3">                                      
                                    <table width="100%" border="1">
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
                                            <th>VUELTAS TURNO:</th><td>{{$store.state.info_maq.VOLTAS_TURNO}}</td>
                                        </tr>
                                        <tr>
                                            <th>ROLLOS PENDIENTES:</th><td>{{$store.state.info_maq.ETIQUETAS}}</td>
                                        </tr>
                                        <tr>
                                            <th>SITUACIÓN:</th><td>
                                            <button type="button" class="btn btn-success btn-sm" v-if="$store.state.info_maq.ETIQUETAS > 0">ACTIVA</button>
                                            <button type="button" class="btn btn-secondary btn-sm" v-else>SIN.PROG</button>
                                            </td>
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
                                            <th>POSICIÓN:</th><td>                                                
                                                <div class="input-group input-group-sm">
                                                    <input type="text" class="form-control" v-model="$store.state.info_maq.POS">
                                                    <button class="btn btn-outline-primary" type="button" @click="actualizarPos()">Actualizar Posición</button>
                                                </div>
                                            </td>
                                        </tr>                                        
                                    </table>
                                    <table width="100%" border="1">
                                        <tr>
                                            <th colspan="2" style="background:#ef476f">CONFIGURACIÓN  DE LOGO</th>
                                        </tr>
                                        
                                        <tr>
                                            <th>IP-LOGO:</th><td><input type="text" class="form-control form-control-sm" v-model="$store.state.info_maq.IP_LOGO"></td>
                                        </tr>
                                        <tr>
                                            <th>PUERTO:</th><td>
                                                <div class="input-group input-group-sm">
                                                    <input type="text" class="form-control" v-model="$store.state.info_maq.PUERTO_LOGO">
                                                    <button class="btn btn-outline-primary" type="button">Actualizar Logo</button>
                                                    <button class="btn btn-outline-danger" type="button" @click="eliminarLogo()">Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>                                          
                                    </table>
                                </div>
                                <div class="col-sm-3">
                                    <info_tablet :ip="$store.state.info_maq.IP_LOGO" :num_maq="$store.state.info_maq.NUM_MAQ"></info_tablet>
                                </div>
                                <div class="col-sm-3">
                                    <datos_logo :ip="$store.state.info_maq.IP_LOGO"></datos_logo>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="stopInterval()">Close</button>
                        <button type="button" class="btn btn-primary">Send message</button>
                        </div>
                    </div>
                </div>
            </div>
            `,
})
