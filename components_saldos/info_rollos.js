Vue.component('info_rollos',{      
    props:['num_maq'],
	data: function(){
		return{
			datos_rollos:[],		
		}
	},
	watch: {

		num_maq(newval, oldval) {
            console.log(newval,oldval)
            if(newval != oldval){
			    this.getRollos();
            }
		}

	},    
	mounted: async function(){
        
	},
    methods:{    
		async getRollos() {
            var reff = this
			await axios.get('modulos/mod_control_saldos.php?flag=3&num_maq='+this.num_maq).then(ress => {
				this.datos_rollos = ress.data
                console.log(this.datos_rollos)				
			}).catch(e => {
				console.log(e)
            }).finally(function () {
                console.log("Finaly")
                reff.$store.state.loading = false
            });
		},
		/*getEstado(estado){
			var est = '';
			console.log(estado)
			if(estado == 1){
				est = '<span class="badge bg-primary">Consumiendose</span>';
			}else if(estado == 2){
				est = '<span class="badge bg-danger">Por Consumir</span>';
			}			
			return est
		}*/
    },
    template:`	
				<div>                                
					<div class="rollos" v-if="!$store.state.loading">
						<table border="1" style="font-size:12px;" width="100%">	
							<thead>		    
							<tr class="sticky-top bg-dark text-white">                            
								<th class="td_pad">ORDEM TECELAGEM</th>
								<th class="td_pad">ROLLO</th>
                                <th class="td_pad">FECHA TABLET</th>
								<th class="td_pad">FECHA PESADO</th>								
								<th class="td_pad">OPERADOR</th>
							</tr>
							</thead>
							<tr v-for="(rol,index) in datos_rollos">								
								<td class="td_pad">{{rol.ORDEM_TECELAGEM}}</td>
								<td class="td_pad">{{rol.CODIGO_ROLO}}</td>
                                <td class="td_pad">{{rol.FECHAHORA_MAQUINA}}</td>
								<td class="td_pad">{{rol.DATA_PROD_BAJA}} {{rol.HORA_TERMINO}}</td>								
								<td class="td_pad">{{rol.CODIGO_OPERADOR}}</td>
							</tr>
						</table>
					</div>
                    <div v-else><strong><img src="./img/loading__round.gif" />Cargando información de rollos, espere un momento......</strong></div>
            	</div>
            `,
})
