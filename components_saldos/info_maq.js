Vue.component('info_maq',{      
    //props:['item'],
	data: function(){
		return{
			datos_maq:[],
            datos_maq_filtered:[],
            num_maq:null,
            selectedMaq:null
		}
	},
	mounted: async function(){
        this.getMaquinas();
	},
    methods:{    
        async getMaquinas(){
                
                await axios.get('modulos/mod_control_saldos.php?flag=1').then(ress => {		
                    this.datos_maq = ress.data
                    this.datos_maq_filtered = ress.data
                }).catch(e => {
                    console.log(e)
                }); 
            },     
        setMaq(mq,indx) {
            if (this.selectedMaq != indx){
                this.selectedMaq = indx;
                this.$store.state.maq_select = mq            
                this.$store.state.loading = true
            }
        },
        buscarMaquina(){
            if(this.num_maq > 0){
                var maqi = this.num_maq
                this.datos_maq_filtered = this.datos_maq.filter(function(arr) {                    
                    return (arr.NUMERO_MAQUINA == maqi);
                });
            }else{
                this.datos_maq_filtered = this.datos_maq
            }
        }
    },
    template:`<div>                
                <table>
                    <tr><td>Maquina:</td><td><input class="form-control me-2" type="search" v-model="num_maq" v-on:keyup="buscarMaquina();"></td></tr>
                </table>
                <br>
                <div class="maquinas">
                    <table border="1" style="font-size:12px;" width="100%">	
                        <thead>		    
                        <tr class="sticky-top bg-dark text-white">                            
                            <th class="td_pad">REFERENCIA</th>
                            <th class="td_pad">PROD.DIA</th>
                            <th class="td_pad">EFICIENCIA</th>
                            <th class="td_pad">VELOCIDAD</th>
                            <th class="td_pad">VUELTAS ACTUALES</th>
                            <th class="td_pad">VUELTAS TURNO</th>
                            <th class="td_pad">ROLLOS PENDIENTES</th>
                            <th class="td_pad">SALDO BAJO</th>
                            <th class="td_pad">MAQUINA</th>
                        </tr>
                        </thead>
                        <tr v-for="(maq,index) in datos_maq_filtered" @click="setMaq(maq,index)" :class="{'highlight': (index == selectedMaq)}">
                            
                            <td class="td_pad">{{maq.NIVEL_ESTRUTURA}}.{{maq.GRUPO_ESTRUTURA}}.{{maq.SUBGRU_ESTRUTURA}}.{{maq.ITEM_ESTRUTURA}}</td>
                            <td class="td_pad">{{maq.PRODUCAO_DIA}}</td>
                            <td class="td_pad">{{maq.EFICIENCIA}}</td>
                            <td class="td_pad">{{maq.VELOCIDADE}}</td>
                            <td class="td_pad">{{maq.NUMERO_VOLTAS}}</td>
                            <td class="td_pad">{{maq.VOLTAS_TURNO}}</td>
                            <td class="td_pad">{{maq.ROLOS_PEND}}</td>
                            <td class="td_pad">{{maq.LOTES_BAJOS}}</td>
                            <td class="td_pad">{{maq.GRUPO_MAQUINA}}.{{maq.SUBGRUPO_MAQUINA}}.{{maq.NUMERO_MAQUINA}}</td>
                        </tr>
                    </table>
                </div>
            </div>
            `,
})
