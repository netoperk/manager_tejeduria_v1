Vue.component('datos_logo',{
    props:['ip'],
	data: function(){
		return{
            datos:[],            
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
                    </tr>
                    <tr v-for="dato in datos" v-if="datos.length > 0">
                        <td>{{dato.puerto}}</td>                        
                        <td>{{dato.maq}}</td>                        
                        <td>{{dato.vueltas}}</td>
                    </tr>
                    <tr v-else>
                        <td colspan="3" style="background:tomato;color:white">LOGO no conectado, sin comunicación</td>
                    </tr>
                </table>
            </div>
            `,
})
