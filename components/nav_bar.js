Vue.component('nav_bar',{      
    //props:['item'],
	data: function(){
		return{
			
		}
	},
	mounted: async function(){
        
	},
    methods:{
        
    },
    template:`
                <div>
                    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                        <a class="navbar-brand" href="#" onclick="xajax_vista_inicio();">ADMINISTRACIÓN Y CONFIGURACIÓN DE LOGOS</a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>                
                    </nav>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb" style="background-color:#cae9ff">
                            <li class="breadcrumb-item active" aria-current="page" style="font-weight:bold;" id="breadcrum">Pettenati Centro América</li>
                        </ol>
                    </nav>
                </div>				
            `,
})
