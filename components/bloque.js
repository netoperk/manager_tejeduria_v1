Vue.component('bloque',{      
    props:['block','datos'],
	data: function(){
		return{
			
		}
	},
	mounted: async function(){
        
	},
    methods:{
        getNumLogo(logo){
            if(logo){
                const ip = logo.split('.');
                return ip[3];
            }
        },        
    },
    template:`
                <div class="bloque">
                    <div class="pos" v-for="item in datos" >
                        <table width="100%" v-if="item.NUM_MAQ > 0" >
                                <tr >
                                    <td colspan="2" class="num_maq text-center">{{item.NUM_MAQ}}</td>
                                </tr>
                                <tr>
                                    <td :style="{'background-color':item.IP_COLOR,'font-weight':'bold'}">{{ getNumLogo(item.IP_LOGO) }}</td>
                                    <td :class="[(item.SITUACAO == 4)? 'activa':'inactiva']" >{{ item.PUERTO_LOGO }}</td>
                                </tr>
                            </tr>
                        </table>                                                
                    </div>
                </div>
            `,
})
