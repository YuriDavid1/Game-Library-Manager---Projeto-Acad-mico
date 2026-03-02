package com.yuri.gamelibrary.service;
import org.springframework.stereotype.Service;
import com.yuri.gamelibrary.entity.Jogo;
import com.yuri.gamelibrary.repository.JogoRepository;

import java.util.Optional;

@Service
public class JogoService {

    private final JogoRepository repository;

    public JogoService(JogoRepository repository){
        this.repository = repository;
    }
public void cadastrarJogo(Jogo jogo){
        if(jogo == null){
            throw new IllegalArgumentException("Erro");
        }
    if (jogo.getNome() == null || jogo.getNome().isBlank()){
        throw new IllegalArgumentException("Nome do jogo deve ser inserido");
    }
    Optional<Jogo> jogoExiste = repository.findByNomeIgnoreCase(jogo.getNome());
        if(jogoExiste.isPresent()){
            throw new IllegalArgumentException("Jogo já registrado com este nome.");
        }
        repository.save(jogo);
    }


}
