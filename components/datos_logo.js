Vue.component('datos_logo',{
    props:['ip'],
	data: function(){
		return{
            datos:[],  
            dados:[],          
            hora:null
		}
	},
	mounted: function(){        
        
	},
    watch: {

        ip (newval,oldval){
            if(newval != null){
                this.getHora();
                this.cargarDatos(newval);   
                this.dados=[];
                this.$store.state.interval_logo = setInterval(()=>{
                        this.getHora();
                        this.cargarDatos(newval);
                    },10000);                
            }
        }

    },    
    methods:{
        getHora(){
            var d       = new Date()
            var h       = d.getHours()
            var m       = d.getMinutes()
            var s       = d.getSeconds() 
            this.hora   = h+':'+m+':'+s;
        },

        async cargarDatos(iplogo){
            console.log("IP LOGO",iplogo);            
            await axios.get('modulos/mod_manager_tejeduria.php?flag=3&ip_logo='+iplogo).then(ress => {		                               
                console.log(ress.data);
                if(ress.data.length > 0){
                    this.datos = ress.data;  
                    if(!this.dados.length){
                        this.dados=this.datos;
                    }else{
                        Object.entries(this.datos).forEach(([key, regs]) => {
                            /*var item_local = localStorage.getItem(this.datos_select.ordem_agrupa+'_'+key);
                            if(item_local){ value.PESADO = JSON.parse(item_local).PESADO; }*/
                            if(this.datos[key].vueltas != this.dados[key].vueltas){ 
                                this.datos[key].status = 1
                            }else{
                                this.datos[key].status = 0
                            }                                                        
                        });
                    }
                }else{
                    this.datos = []  
                }
            }).catch(e => {
                console.log(e)
            }); 
        },
        
    },
    template:`
            <div>
                <table width="100%" border="1">
                    <tr>
                        <th colspan="2" style="background:#00b4d8">VUELTAS DE LOGO {{ip}}</th>
                        <th>{{hora}}</th>
                    </tr>
                    <tr>
                        <th>PUERTO</th>
                        <th>MAQUINA</th>
                        <th>VUELTAS</th>
                        <th>STATUS</th>
                    </tr>
                    <tr v-for="dato in datos" v-if="datos.length > 0">
                        <td>{{dato.puerto}}</td>                        
                        <td>{{dato.maq}}</td>                        
                        <td>{{dato.vueltas}}</td>
                        <td class="text-center">
                            <img src="./img/green.gif" height="20" v-if="dato.status == 1">
                            <img src="./img/red.gif" height="20" v-else>
                        </td>
                    </tr>
                    <tr v-else>
                        <td colspan="3" style="background:tomato;color:white">LOGO no conectado, sin comunicación</td>
                    </tr>
                </table>
            </div>
            `,
})
