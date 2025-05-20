<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/forms_estilo.css">
</head>
<body>
<div class="login-wrap">

<div class="login-html">
    <input id="tab-1" type="radio" name="tab" class="sign-in" checked>
    <label for="tab-1" class="tab">Fazer Login</label>

    <input id="tab-2" type="radio" name="tab" class="sign-up">
    <label for="tab-2" class="tab">Registrar</label>

    <div class="login-form">
        <!-- Formulário de Login -->
        <form action="/DashboardGuto/php/login.php" method="POST" class="sign-in-htm">
            <div class="group">
                <label for="login-user" class="label">Email</label>
                <input id="login-user" type="text" class="input" name="email" required>
            </div>
            <div class="group">
                <label for="login-pass" class="label">Senha</label>
                <input id="login-pass" type="password" class="input" name="senha" data-type="password" required>
            </div>
            <div class="group">
                <input id="check" type="checkbox" class="check" checked>
                <label for="check"><span class="icon"></span> Me Mantenha Conectado!</label>
            </div>
            <div class="group">
                <input type="submit" class="button" value="Realizar Login">
            </div>
            <div class="hr"></div>
            <div class="foot-lnk">
                <a href="#forgot">Esqueceu a Senha?</a>
            </div>
        </form>

        <!-- Formulário de Registro -->
        <form action="/DashboardGuto/php/registrar.php" method="POST" class="sign-up-htm">
            <div class="group">
                <label for="reg-user" class="label">Nome de Usuário</label>
                <input id="reg-user" type="text" class="input" name="usuario" required>
            </div>
            <div class="group">
                <label for="reg-pass" class="label">Senha</label>
                <input id="reg-pass" type="password" class="input" name="senha" data-type="password" required>
            </div>
            <div class="group">
                <label for="reg-pass2" class="label">Repetir Senha</label>
                <input id="reg-pass2" type="password" class="input" name="senha_confirmacao"
                    data-type="password" required>
            </div>
            <div class="group">
                <label for="reg-email" class="label">Endereço de E-Mail</label>
                <input id="reg-email" type="email" class="input" name="email" required>
            </div>
            <div class="group">
                <input type="submit" class="button" value="Registrar">
            </div>
            <div class="hr"></div>
            <div class="foot-lnk">
                <label for="tab-1">Já possui conta?</label>
            </div>
        </form>
    </div>
</div>
</div>
</body>
</html>
