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

require_once '../Phpmodbus/ModbusMaster.php';

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
            $sq_periodo = "SELECT PERIODO_PRODUCAO,AREA_PERIODO, TO_CHAR(DATA_INI_PERIODO, 'DD MON, YYYY') DATA_INICIAL, TO_CHAR(DATA_FIM_PERIODO, 'DD MON, YYYY') DATA_FINAL
                            FROM pette.PCPC_010 WHERE (AREA_PERIODO = '4') AND (CODIGO_EMPRESA = '1') and situacao_periodo in ('0')
                    and (data_fim_periodo >= to_char(sysdate, 'DD/Mon/YY') and data_ini_periodo <= to_char(sysdate, 'DD/Mon/YY'))";

            $row_periodo = db_query($sq_periodo, "single");

            $periodo_prod = $row_periodo['PERIODO_PRODUCAO']-1;

            $sql = "SELECT 
                        l.bloque, l.pos, l.num_maq,
                        a.ip_logo, a.puerto_logo,
                        (select color from teje_logo.logos where iplogo = a.ip_logo) ip_color,
                        v.grupo_maquina,v.subgrupo_maquina,
                        v.nivel_estrutura, v.grupo_estrutura,
                        v.subgru_estrutura, v.item_estrutura,
                        v.situacao, v.situacion,
                        v.eficiencia,v.velocidade,v.voltas_turno,
                        (SELECT sum(p10.qtde_rolos_prog) - sum(p10.qtde_rolos_prod)
                            FROM
                                pette.pcpt_010 p10
                            WHERE
                                    p10.periodo_producao >= '$periodo_prod'
                                AND p10.cod_cancelamento = 0
                                AND p10.qtde_rolos_prod < p10.qtde_rolos_prog
                                AND p10.numero_maquina = l.num_maq) etiquetas,
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
        case 3:
            $ip_logo = $_GET['ip_logo'];
            $modbus 	= new ModbusMaster("$ip_logo", "TCP");
            try {
                $recData = $modbus->readMultipleRegisters(255, 0, 32, 0, 99, "INT");
            }
            catch (Exception $e) {         
                $result = "error_manager.log_error ('".$e." LOGO IP:' || ".$ip_logo.",'')";            
               echo '0';   
            }

            $values 	= array_chunk($recData, 2);
            
            $datos=array();  
            $sql = "SELECT num_maquina,puerto_logo from teje_logo.asignacion_logo where ip_logo ='$ip_logo'";        
            $rows = db_query($sql,"array");
            
            $nrows = count($rows);

            for($n = 0; $n < $nrows; $n++){

                $puerto = $rows[$n]['PUERTO_LOGO'];

                $puertos    = array(0=>1,1=>3,2=>5,3=>7,4=>9,5=>11,6=>13,7=>15,8=>17,9=>19,10=>21,11=>23,12=>25,13=>27,14=>29,15=>31,16=>33);
                $port       = $puertos[$puerto - 1];
                $vueltas 	= PhpType::bytes2signedInt($values[$port]); 

                array_push($datos,array(
                                        "maq"=>$rows[$n]['NUM_MAQUINA'],
                                        "puerto"=>$puerto,
                                        "vueltas"=>$vueltas)
                );      

            }
            
            echo json_encode($datos);
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