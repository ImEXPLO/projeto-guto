<?php
require 'conexao.php'; // Arquivo que faz a conexão com o banco

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = trim($_POST["usuario"]);
    $email = trim($_POST["email"]);
    $senha = $_POST["senha"];
    $senha_confirmacao = $_POST["senha_confirmacao"];

    // Verifica se as senhas coincidem
    if ($senha !== $senha_confirmacao) {
        echo "<script>alert('As senhas não coincidem!'); window.location.href = 'DashboardGuto/php/login.php';</script>";
        exit;
    }

    // Verifica se o usuário ou e-mail já existem no banco
    $sql = "SELECT id FROM usuarios WHERE usuario = ? OR email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $usuario, $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "<script>alert('Nome de usuário ou e-mail já cadastrados!'); window.location.href = 'DashboardGuto/php/login.php';</script>";
        exit;
    }
    $stmt->close();

    // Criptografa a senha antes de armazenar
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

    // Insere o novo usuário no banco
    $sql = "INSERT INTO usuarios (usuario, email, senha) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $usuario, $email, $senha_hash);

    if ($stmt->execute()) {
        echo "<script>alert('Usuário cadastrado com sucesso! Faça login.'); window.location.href = '../login.php';</script>";
    } else {
        echo "<script>alert('Erro ao registrar usuário. Tente novamente!'); window.location.href = '../login.php';</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
