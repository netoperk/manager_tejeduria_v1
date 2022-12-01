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
                        v.eficiencia,v.velocidade,v.voltas_turno,
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
                            eficiencia, velocidade,voltas_turno
                        from PETTE2.view_teje_maq_prog
                        where situacao < 7) v
                    WHERE
                        'T'||l.num_maq = a.num_maquina(+)
                        and l.num_maq = v.numero_maquina(+)                         
                    ORDER BY bloque, pos desc";

            $rows = db_query_assoc($sql,"array");

            echo json_encode($rows);

        break;
        case 2:
            $inicio_turno = getTurno(1);
            $num_maq = 'T'.$_GET['num_maq'];
            $sq_tab = "SELECT
                            num_maq,
                            fecha,
                            turno,
                            num_vueltas,
                            minutos_trans,
                            minutos_paro,
                            status   
                        FROM
                            teje_logo.resumen_tejelogo_node
                        WHERE
                        fecha >= to_date('$inicio_turno','dd/mm/yy hh24:mi:ss')
                        and num_maq = '$num_maq'";                        

            $rows = db_query_assoc($sq_tab,"single");

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

function getTurno($opc=1){//fecha

    switch ($opc) {
       case 1:
           $fechaRetorno = db_query("SELECT
                       CASE
                           WHEN sysdate >= t.t1
                               AND sysdate < t.t2 THEN
                               t1
                           WHEN sysdate >= t.t2
                               AND sysdate < t.t3_act THEN
                               t2
                           WHEN sysdate >= t3_ant
                               AND sysdate < t.t1 THEN
                               t3_ant
                           WHEN sysdate >= t3_act THEN
                               t3_act
                       END turno
                   FROM
                       (
                           SELECT
                               to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '06:15:00'), 'DD/MM/YY HH24:MI:SS') t1,
                               to_date((to_char(sysdate + 1, 'DD/MM/YY')|| ' '|| '06:15:00'), 'DD/MM/YY HH24:MI:SS') t1_des,
                               to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '14:15:00'), 'DD/MM/YY HH24:MI:SS') t2,
                               to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '22:15:00'), 'DD/MM/YY HH24:MI:SS') t3_act,
                               to_date((to_char((sysdate - 1), 'DD/MM/YY')|| ' '|| '22:15:00'), 'DD/MM/YY HH24:MI:SS') t3_ant
                           FROM
                               dual
                       ) t", "unico");
           break;
       case 2://fecha fin turno
           $fechaRetorno = db_query("SELECT
                                   CASE
                                       WHEN sysdate >= t.t1
                                           AND sysdate < t.t2 THEN
                                           t2
                                       WHEN sysdate >= t.t2
                                           AND sysdate < t.t3_act THEN
                                           t3_act
                                       WHEN sysdate >= t3_ant
                                           AND sysdate < t.t1 THEN
                                           t1
                                       WHEN sysdate >= t3_act THEN
                                           t1_des
                                   END turno
                               FROM
                                   (
                                       SELECT
                                           to_date((to_char((sysdate - 1), 'DD/MM/YY')|| ' '|| '22:15:00'), 'DD/MM/YY HH24:MI:SS') t3_ant,
                                           to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '06:15:00'), 'DD/MM/YY HH24:MI:SS') t1,
                                           to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '14:15:00'), 'DD/MM/YY HH24:MI:SS') t2,
                                           to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '22:15:00'), 'DD/MM/YY HH24:MI:SS') t3_act,
                                           to_date((to_char(sysdate + 1, 'DD/MM/YY')|| ' '|| '06:15:00'), 'DD/MM/YY HH24:MI:SS') t1_des
                                       FROM
                                           dual
                                   ) t", "unico");
           break;
       case 3://letra turno
           $fechaRetorno = db_query("SELECT
                       CASE
                           WHEN sysdate >= t.t1
                               AND sysdate < t.t2 THEN
                               'A'
                           WHEN sysdate >= t.t2
                               AND sysdate < t.t3_act THEN
                               'B'
                           WHEN sysdate >= t3_ant
                               AND sysdate < t.t1 THEN
                               'C'
                           WHEN sysdate >= t3_act THEN
                               'C'
                       END turno
                   FROM
                       (
                           SELECT
                               to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '06:15:00'), 'DD/MM/YY HH24:MI:SS') t1,
                               to_date((to_char(sysdate + 1, 'DD/MM/YY')|| ' '|| '06:15:00'), 'DD/MM/YY HH24:MI:SS') t1_des,
                               to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '14:15:00'), 'DD/MM/YY HH24:MI:SS') t2,
                               to_date((to_char(sysdate, 'DD/MM/YY')|| ' '|| '22:15:00'), 'DD/MM/YY HH24:MI:SS') t3_act,
                               to_date((to_char((sysdate - 1), 'DD/MM/YY')|| ' '|| '22:15:00'), 'DD/MM/YY HH24:MI:SS') t3_ant
                           FROM
                               dual
                       ) t", "unico");
           break;
       default:
           # code...
           break;
   }


   return $fechaRetorno;
}