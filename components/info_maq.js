Vue.component('info_maq',{
	data: function(){
		return{

		}
	},
	mounted: async function(){
        
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
                                            <th>IP LOGO:</th><td>{{$store.state.info_maq.IP_LOGO}} - {{$store.state.info_maq.PUERTO_LOGO}}</td>
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
                                    </table>
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
