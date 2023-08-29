Vue.component('info_abast',{      
    props:['num_maq'],
	data: function(){
		return{
			datos_abast:[],		
		}
	},
	watch: {

		num_maq(newval, oldval) {
			if (newval != oldval) {
				this.getAbast();
			}
		}

	},    
	mounted: async function(){
        
	},
    methods:{    
		async getAbast() {
			await axios.get('modulos/mod_control_saldos.php?flag=2&num_maq='+this.num_maq).then(ress => {
				this.datos_abast = ress.data
				console.log(this.datos_abast)				
			}).catch(e => {
				console.log(e)
			});
		},
		getEstado(estado){
			var est = '';
			console.log(estado)
			if(estado == 1){
				est = '<span class="badge bg-primary">Consumiendose</span>';
			}else if(estado == 2){
				est = '<span class="badge bg-danger">Por Consumir</span>';
			}			
			return est
		}
    },
    template:`	
				<div>                                
					<div class="abastecimientos">
						<table border="1" style="font-size:12px;" width="100%">	
							<thead>		    
							<tr class="sticky-top bg-dark text-white">                            
								<th class="td_pad">FEC/HORA</th>
								<th class="td_pad">HILO</th>
								<th class="td_pad">CORRELATIVO</th>
								<th class="td_pad">LOTE</th>
								<th class="td_pad">FACTURA</th>
								<th class="td_pad">SALDO_ABASTECIDO</th>
								<th class="td_pad">ESTADO</th>
							</tr>
							</thead>
							<tr v-for="(abs,index) in datos_abast">								
								<td class="td_pad">{{abs.DATA_ABAST}}</td>
								<td class="td_pad">{{abs.NIVEL}}.{{abs.GRUPO}}.{{abs.SUBGRU}}.{{abs.ITEM}}</td>
								<td class="td_pad">{{abs.CORRELATIVO}}</td>
								<td class="td_pad">{{abs.LOTE_ACOMP}}</td>
								<td class="td_pad">{{abs.FACTURA_SYSTEXTIL}}</td>
								<td class="td_pad">{{abs.SALDO_ABASTECIDO}}</td>
								<td class="td_pad"><div v-html="getEstado(abs.ESTADO)"></div></td>
							</tr>
						</table>
					</div>
            	</div>
            `,
})
