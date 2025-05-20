# projeto-guto
Git do Site/App de Gestão - do Guto

# 🧠 Guia Rápido - Colaborador Git/GitHub - Se você é iniciante:

## 🔧 Requisitos
- Ter o **Git instalado** ([baixar aqui](https://git-scm.com/))
- Ter uma **conta no GitHub**
- Ter um editor de código (ex: VS Code)

---

## 🔽 Clonar o repositório (apenas na primeira vez)
```bash
git clone https://github.com/ImEXPLO/projeto-guto.git
cd projeto-guto
```

---

## 🔄 Atualizar o projeto local com as mudanças mais recentes
```bash
git pull origin main
```
> Isso é importante fazer **sempre antes de começar a mexer no código**.

---

## ✍️ Fazer alterações no projeto
- Editar, adicionar ou remover arquivos normalmente

---

## ✅ Preparar as mudanças para envio
```bash
git add .
git commit -m "Descreva aqui o que você mudou"
```

---

## ⬆️ Enviar (fazer push) das mudanças para o GitHub
```bash
git pull origin main    # para garantir que está atualizado
git push origin main
```
> ⚠️ Se pedir usuário e senha, gere um **token de acesso** no GitHub [aqui](https://github.com/settings/tokens) e use como senha.

---

## 💥 Se der conflito (acontece!)
- O Git vai avisar e marcar os arquivos com `<<<<<<<` e `>>>>>>>`
- Basta editar e escolher o que manter
- Depois:
```bash
git add .
git commit -m "Resolve conflito"
git push origin main
```

---
