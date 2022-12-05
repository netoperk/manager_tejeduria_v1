Vue.component('datos_logo',{
    props:['ip'],
	data: function(){
		return{
            datos:[]
		}
	},
	mounted: function(){        
        
	},
    watch: {

        ip (newval,oldval){
            this.cargarDatos(newval);
        }

    },    
    methods:{

        async cargarDatos(iplogo){
            await axios.get('modulos/mod_manager_tejeduria.php?flag=3&ip_logo='+iplogo).then(ress => {		
                console.log(ress.data)
                
            }).catch(e => {
                console.log(e)
            }); 
        },
        
    },
    template:`
            <div>
                <table width="100%" border="1">
                    <tr>
                        <th colspan="2" style="background:#00b4d8">VUELTAS DE LOGO</th>
                    </tr>                      
                </table>
            </div>
            `,
})
