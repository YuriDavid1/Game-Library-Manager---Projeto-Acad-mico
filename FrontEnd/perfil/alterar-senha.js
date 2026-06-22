const form = document.getElementById("formSenha");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const senhaAtual =
        document.getElementById("senhaAtual").value;

    const novaSenha =
        document.getElementById("novaSenha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    try {

        const response = await api.put(
            "/auth/alterar-senha",
            {
                senhaAtual,
                novaSenha,
                confirmarSenha
            }
        );

        mensagem.innerHTML =
            "<p class='sucesso'>Senha alterada com sucesso!</p>";

        form.reset();

    } catch (erro) {

        mensagem.innerHTML =
            `<p class='erro'>${erro.message}</p>`;

    }

});