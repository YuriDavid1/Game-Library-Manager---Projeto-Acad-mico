package com.yuri.gamelibrary.service;

import org.springframework.stereotype.Service;
import com.yuri.gamelibrary.entity.Jogo;
import com.yuri.gamelibrary.repository.JogoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class JogoService {

    private final JogoRepository repository;

    public JogoService(JogoRepository repository) {
        this.repository = repository;
    }

    public void cadastrarJogo(Jogo jogo) {
        if (jogo == null) {
            throw new IllegalArgumentException("Erro");
        }
        if (jogo.getNome() == null || jogo.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do jogo deve ser inserido");
        }
        Optional<Jogo> jogoExiste = repository.findByNomeIgnoreCase(jogo.getNome());
        if (jogoExiste.isPresent()) {
            throw new IllegalArgumentException("Jogo já registrado com este nome.");
        }
        jogo.setDisponivel(true);
        repository.save(jogo);
    }

    public void deletarJogo(String nome) {
        Optional<Jogo> jogoEncontrado = repository.findByNomeIgnoreCase(nome);
        if (jogoEncontrado.isEmpty()) {
            throw new IllegalArgumentException("Nome do jogo não encontrado");
        }
        repository.delete(jogoEncontrado.get());
    }

    public Jogo buscarJogo(String nome){
        Optional <Jogo> jogoEncontrado = repository.findByNomeIgnoreCase(nome);
        if (jogoEncontrado.isEmpty()){
            throw new IllegalArgumentException("Jogo não encontrado");
        }
        return jogoEncontrado.get();
    }

    // NOVA FUNÇÃO: Busca o jogo pela URL (slug)
    public Jogo buscarPorSlug(String slug){
        Optional <Jogo> jogoEncontrado = repository.findBySlug(slug);
        if (jogoEncontrado.isEmpty()){
            throw new IllegalArgumentException("Jogo não encontrado na base de dados");
        }
        return jogoEncontrado.get();
    }

    public List<Jogo> listarTodos(){
        if(repository.findAll().isEmpty()){
            throw new IllegalArgumentException("Nenhum jogo foi encontrado");
        }
        return repository.findAll();
    }

    // ===== MÉTODOS ADMINISTRATIVOS =====

    // Lista sem lançar exceção quando vazio (ideal para o painel admin)
    public List<Jogo> listarTodosAdmin() {
        return repository.findAll();
    }

    // Atualiza um jogo existente pelo ID
    public Jogo atualizarJogo(Long id, Jogo dados) {
        Jogo jogo = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado"));

        if (dados.getNome() != null && !dados.getNome().isBlank()) {
            jogo.setNome(dados.getNome());
        }
        if (dados.getSlug() != null && !dados.getSlug().isBlank()) {
            jogo.setSlug(dados.getSlug());
        }
        if (dados.getGenero() != null) jogo.setGenero(dados.getGenero());
        if (dados.getDescricao() != null) jogo.setDescricao(dados.getDescricao());
        if (dados.getPrecoAluguel() != null) jogo.setPrecoAluguel(dados.getPrecoAluguel());
        if (dados.getPrecoCompra() != null) jogo.setPrecoCompra(dados.getPrecoCompra());
        if (dados.getImagemFundo() != null) jogo.setImagemFundo(dados.getImagemFundo());
        if (dados.getImagemCapa() != null) jogo.setImagemCapa(dados.getImagemCapa());
        jogo.setDisponivel(dados.isDisponivel());

        return repository.save(jogo);
    }

    // Deleta pelo ID (mais seguro que pelo nome no painel admin)
    public void deletarPorId(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Jogo não encontrado");
        }
        repository.deleteById(id);
    }

    // Cadastra e retorna o jogo salvo (com ID gerado) para o painel admin.
    // Diferente do cadastro padrão, respeita o flag 'disponivel' escolhido
    // pelo admin e valida slug duplicado.
    public Jogo cadastrarERetornar(Jogo jogo) {
        if (jogo == null) {
            throw new IllegalArgumentException("Dados do jogo inválidos");
        }
        if (jogo.getNome() == null || jogo.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do jogo deve ser inserido");
        }
        if (repository.findByNomeIgnoreCase(jogo.getNome()).isPresent()) {
            throw new IllegalArgumentException("Jogo já registrado com este nome.");
        }
        if (jogo.getSlug() != null && !jogo.getSlug().isBlank()
                && repository.findBySlug(jogo.getSlug()).isPresent()) {
            throw new IllegalArgumentException("Já existe um jogo com este slug (URL).");
        }
        boolean disponivel = jogo.isDisponivel();
        Jogo salvo = repository.save(jogo);
        salvo.setDisponivel(disponivel);
        return repository.save(salvo);
    }
}