<?php
session_start();
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // Preparar e executar a consulta
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar se o usuário existe e se a senha fornecida corresponde ao hash armazenado
    if ($user && password_verify($senha, $user['senha'])) {
        // Iniciar a sessão e armazenar os dados do usuário
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['nome'] = $user['nome'];
        $_SESSION['permissao'] = $user['permissao'];

        // Redirecionar para a página de planejamento
        header("Location: ../child-pages/index/planejamento.php");
        exit;
    } else {
        echo "Credenciais inválidas.";
    }
}
?>
