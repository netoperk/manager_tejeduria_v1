Vue.component('info_tablet',{
    props:['ip','num_maq'],
	data: function(){
		return{
            datos:[],
            utilizacion:0,
            eficiencia:0
		}
	},
	mounted: function(){        
        
	},
    watch: {

        num_maq (newval,oldval){
            this.cargarDatos(newval);
        }

    },    
    methods:{

        async cargarDatos(num_maq){
            await axios.get('modulos/mod_manager_tejeduria.php?flag=2&num_maq='+num_maq).then(ress => {		
                this.datos = ress.data;
                this.utilizacion = (this.datos.MINUTOS_TRANS > 0)? (((this.datos.MINUTOS_TRANS - this.datos.MINUTOS_PARO)/this.datos.MINUTOS_TRANS)*100).toFixed(0) : 0;
                this.eficiencia = (this.datos.NUM_VUELTAS > 0 && this.$store.state.info_maq.VELOCIDADE > 0)? ((this.datos.NUM_VUELTAS / (this.$store.state.info_maq.VELOCIDADE * this.datos.MINUTOS_TRANS))*100).toFixed(0) :0;
            }).catch(e => {
                console.log(e)
            }); 
        },
        
    },
    template:`
            <div>
                <table width="100%" border="1">
                    <tr>
                        <th colspan="2" style="background:#00b4d8">INFORMACIÓN TABLET</th>
                    </tr>  
                    <tr>
                        <th>MINUTOS:</th><td><input type="text" class="form-control form-control-sm" :value="this.datos.MINUTOS_TRANS"></td>
                    </tr>  
                    <tr>
                        <th>VUELTAS:</th><td><input type="text" class="form-control form-control-sm" :value="this.datos.NUM_VUELTAS"></td>
                    </tr>
                    <tr>
                        <th>PAROS:</th><td><input type="text" class="form-control form-control-sm" :value="this.datos.MINUTOS_PARO"></td>
                    </tr>
                    <tr>
                        <th>UTILIZACIÓN:</th><td><input type="text" class="form-control form-control-sm" :value="this.utilizacion"></td>
                    </tr>
                    <tr>
                        <th>EFICIENCIA:</th><td><input type="text" class="form-control form-control-sm" :value="this.eficiencia"></td>
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
            `,
})
