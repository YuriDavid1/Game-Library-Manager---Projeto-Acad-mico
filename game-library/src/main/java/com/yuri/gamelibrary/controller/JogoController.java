package com.yuri.gamelibrary.controller;

import com.yuri.gamelibrary.entity.Jogo;
import com.yuri.gamelibrary.service.JogoService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
public class JogoController {

    private final JogoService jogoService;

    public JogoController(JogoService jogoService) {
        this.jogoService = jogoService;
    }

    @PostMapping
    public String cadastrarJogo(@RequestBody Jogo jogo) {
        jogoService.cadastrarJogo(jogo);
        return "Jogo cadastrado com sucesso";
    }

    @GetMapping
    public List<Jogo> listarJogos() {
        return jogoService.listarTodos();
    }

    @GetMapping("/buscar/{nome}")
    public Jogo buscarJogo(@PathVariable String nome) {
        return jogoService.buscarJogo(nome);
    }

    @DeleteMapping("/by-name/{nome}")
    public String deletarJogo(@PathVariable String nome) {
        jogoService.deletarJogo(nome);
        return "Jogo deletado com sucesso";
    }
}