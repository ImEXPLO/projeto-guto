<?php
$host = 'localhost'; 
$usuario = 'root'; // padrao xampp - não esqueça
$senha = ''; // padrão xampp tbm
$banco = 'dashboard'; // banco de dados teste criado no PhPMyAdmin

// Criar conexão
$conn = new mysqli($host, $usuario, $senha, $banco);

// Verificar conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Definir charset para evitar problemas com acentos
$conn->set_charset("utf8");
?>
