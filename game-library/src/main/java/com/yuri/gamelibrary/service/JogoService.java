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

    public List<Jogo> listarTodos(){
        if(repository.findAll().isEmpty()){
         throw new IllegalArgumentException("Nenhum jogo foi encontrado");
     }
       return repository.findAll();
    }
}