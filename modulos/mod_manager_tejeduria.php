<?php
session_start();
header('Content-Type: application/json;');
header('Content-Type: text/html; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
ini_set('memory_limit', '2048M');
ini_set('max_execution_time', '5600');

$banco = "PRODPTCA";
include "ora_ado.php";

$http_request = $_SERVER['REQUEST_METHOD'];

if ($http_request == 'PUT') {
    header("HTTP/1.1 404 No get allowed");
    echo("METODO PUT NO HABILITADO EN ESTA API");
    return;
}

if ($http_request == 'GET') {

    $flag   =  $_GET['flag'];
    
    switch ($flag) {
        
        case 1://CONFIGURACION
            $sql = "SELECT 
                        l.bloque, l.pos, l.num_maq,
                        a.ip_logo, a.puerto_logo,
                        (select color from teje_logo.logos where iplogo = a.ip_logo) ip_color,
                        v.grupo_maquina,v.subgrupo_maquina,
                        v.nivel_estrutura, v.grupo_estrutura,
                        v.subgru_estrutura, v.item_estrutura,
                        v.situacao, v.situacion,
                        v.eficiencia,v.velocidade,
                        0 buscar
                    from teje_logo.layout l,
                        TEJE_LOGO.asignacion_logo a,
                        (select 
                            grupo_maquina,
                            subgrupo_maquina,
                            numero_maquina,
                            nivel_estrutura,
                            grupo_estrutura,
                            subgru_estrutura,
                            item_estrutura,
                            situacao,situacion,
                            eficiencia, velocidade
                        from PETTE2.view_teje_maq_prog
                        where situacao < 7) v
                    WHERE
                        'T'||l.num_maq = a.num_maquina(+)
                        and l.num_maq = v.numero_maquina(+)                         
                    ORDER BY bloque, pos desc";

            $rows = db_query_assoc($sql,"array");

            echo json_encode($rows);

        break;
    }
}//END GET

if ($http_request == 'POST') {

    $array_data = file_get_contents('php://input');
    $datos = str_replace(array("\r", "\n"), '', $array_data);
    
    $campos = json_decode($datos, 1);  
    
    $flag = $campos['flag'];       
    //2022-11-15T12:06
    
    switch ($flag) {
        
        case 1://GUARDAMOS LAS MAQUINAS DETENIDAS
    }
}//END POST