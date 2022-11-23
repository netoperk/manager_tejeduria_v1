<?php

/*
@brief  Función de Inicio del Sistema
*/
function vista_inicio(){
$resp = new xajaxResponse();
$resp->assign("container","innerHTML","<h3>Bienvenido al gestor de contenido PHP, el programa ha sido creado satisfactoriamente!</h3>");
return $resp;
}

