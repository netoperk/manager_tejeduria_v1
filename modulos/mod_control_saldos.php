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

include '../Phpmodbus/ModbusMaster.php';

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
                        res.grupo_maquina,res.subgrupo_maquina,res.numero_maquina,res.nivel_estrutura,res.grupo_estrutura,
                        res.subgru_estrutura,res.item_estrutura,res.producao_dia,res.eficiencia,res.velocidade,res.numero_voltas,
                        res.voltas_turno, res.lotes, res.rolos_pend,
                        nvl((select 
                                stragg(lote_acomp||'|'||saldo_abastecido)
                            from pette2.cm_saldofio_maquina where grupo_maquina = res.grupo_maquina and numero_maquina = res.numero_maquina and estado = 1
                            and saldo_abastecido < 25 AND lote_acomp not in(select lote_acomp from pette2.cm_saldofio_maquina where estado = 2)),0) lotes_bajos
                        
                    FROM(
                    SELECT
                        v.grupo_maquina,
                        v.subgrupo_maquina,
                        v.numero_maquina,
                        v.nivel_estrutura,
                        v.grupo_estrutura,
                        v.subgru_estrutura,
                        v.item_estrutura,   
                        v.producao_dia,
                        v.eficiencia,
                        v.velocidade,
                        v.numero_voltas,   
                        v.voltas_turno,
                        (SELECT pette.stragg(lote_fio) FROM pette.mqop_135 WHERE grupo_maquina = v.grupo_maquina AND subgrupo_maquina = v.subgrupo_maquina AND numero_maquina = v.numero_maquina AND nivel_estrutura = v.nivel_estrutura and grupo_estrutura = v.grupo_estrutura and subgru_estrutura = v.subgru_estrutura and item_estrutura = v.item_estrutura) lotes,
                        (SELECT
                                sum(qtde_rolos_prog) - sum(qtde_rolos_prod) rolos
                                FROM
                                pcpt_010
                                WHERE
                                    numero_maquina   = v.numero_maquina
                                AND data_prev_inicio >= sysdate - 2
                                AND data_prev_inicio < sysdate
                                AND cd_pano_nivel99  = v.nivel_estrutura
                                and cd_pano_grupo    = v.grupo_estrutura
                                and cd_pano_subgrupo = v.subgru_estrutura
                                and cd_pano_item     = v.item_estrutura
                                and cod_cancelamento = 0) rolos_pend
                    FROM
                    teje_logo.view_maq_prog v
                    WHERE v.situacao = 4) res
                    ORDER BY numero_maquina asc";

            $rows = db_query_assoc($sql,"array");

            echo json_encode($rows);

        break;
        case 2: //CONFIGURACION    
            $num_maq = $_GET['num_maq'];
            $sql = "SELECT 
                    to_char(data_abast,'dd/mm/yyyy hh24:mi:ss') data_abast,
                    correlativo,
                    factura_systextil,
                    lote_acomp,
                    saldo_abastecido,
                    saldo_actual,
                    estado,
                    case when estado = 1 then 'consumiendose' else 'por consumir' end desc_estado,
                    cditem_nivel99 NIVEL,
                    cditem_grupo GRUPO,
                    cditem_subgrupo SUBGRU,
                    cditem_item ITEM,
                    sequencia,
                    num_conos
                    from PETTE2.cm_saldofio_maquina
                    where data_abast > sysdate - 10
                        and numero_maquina = $num_maq
                    and estado >0
                    order by cditem_nivel99, cditem_grupo,cditem_subgrupo,cditem_item,estado";

            $rows = db_query_assoc($sql, "array");

            echo json_encode($rows);

            break;
        case 3: //CONFIGURACION    
            $num_maq = $_GET['num_maq'];
            $sql = "SELECT
                        *
                        FROM
                        (
                            SELECT
                            p10.ordem_tecelagem,
                                p20.codigo_rolo,
                                to_char(p10.data_prev_inicio, 'DD/MM/YY') data_prev_inicio,
                                to_char(p10.hora_prev_inicio, 'hh24:mi:ss') hora_prev_inicio,
                                to_char(p20.data_prod_tecel, 'DD/MM/YY') data_prod_baja,
                                to_char(p20.hora_termino, 'HH24:MI:SS') hora_termino,
                                p20.qtde_quilos_prod,
                                p20.codigo_operador,
                                (
                                    SELECT
                                        to_char(max(fechahora),'dd/mm/yy hh24:mi:ss') fechahora
                                    FROM
                                        teje_logo.pcpt_logo_026
                                    WHERE
                                        pcpt_logo_026.codigo_rolo = p20.codigo_rolo
                                )               fechahora_maquina
                            FROM
                                pette.pcpt_020 p20,pette.pcpt_010 p10,teje_logo.detalle_rollo teje
                            WHERE                            
                                    p20.ordem_producao = p10.ordem_tecelagem
                                    and p10.data_prev_inicio >= to_date(to_char(sysdate,'dd/mm/yyyy'),'dd/mm/yyyy')
                                and p20.panoacab_nivel99        = '4'
                                and p20.codigo_rolo             = teje.num_rollo(+)
                                and p10.numero_maquina          = $num_maq
                        )
                        ORDER BY
                        fechahora_maquina NULLS FIRST,   
                        data_prod_baja DESC,1";

            $rows = db_query_assoc($sql, "array");

            echo json_encode($rows);

            break;
    
    }
}//END GET


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