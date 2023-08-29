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
                        <div class="container-fluid">
                        <a class="navbar-brand fw-bold" href="#">MANAGER TEJEDURÍA</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">                                
                            </ul>
                            <form class="d-flex" role="search">
                                <ul class="navbar-nav me-2 mb-2 mb-lg-0">
                                    <li class="nav-item">
                                    <button type="button" class="btn btn-primary" >MENÚ</button>
                                    </li>                                
                                </ul>
                            <input class="form-control me-2" type="search" >
                            <button class="btn btn-success" type="button" >Buscar</button>
                            </form>
                        </div>
                        </div>
                    </nav>
                    
                </div>				
            `,
})
