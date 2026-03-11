package com.yuri.gamelibrary.service;

import com.yuri.gamelibrary.entity.Emprestimo;
import com.yuri.gamelibrary.entity.Jogo;
import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.repository.EmprestimoRepository;
import com.yuri.gamelibrary.repository.JogoRepository;
import com.yuri.gamelibrary.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmprestimoService {
   private final EmprestimoRepository emprestimoRepository;
   private final JogoRepository jogoRepository;
   private final UsuarioRepository usuarioRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, JogoRepository jogoRepository, UsuarioRepository usuarioRepository){
        this.emprestimoRepository = emprestimoRepository;
        this.jogoRepository = jogoRepository;
        this.usuarioRepository = usuarioRepository;
    }
    @Transactional
    public Emprestimo criarEmprestimo(String nomeUsuario, String nomeJogo) {
        if (nomeUsuario == null || nomeUsuario.isBlank()) {
            throw new IllegalArgumentException("Nome do usuário deve ser inserido");
        }
        if (nomeJogo == null || nomeJogo.isBlank()) {
            throw new IllegalArgumentException("Nome do jogo deve ser inserido");
        }

        Usuario usuario = usuarioRepository.findByNomeIgnoreCase(nomeUsuario).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        Jogo jogo = jogoRepository.findByNomeIgnoreCase(nomeJogo).orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado"));
        if (!jogo.isDisponivel()) {
            throw new IllegalArgumentException("O jogo não está disponível para empréstimo.");
        }

        if (emprestimoRepository.existsByJogoIdAndAtivoTrue(jogo.getId())) {
            throw new IllegalArgumentException("Este jogo já possui um empréstimo ativo.");
        }

        jogo.setDisponivel(false);
        jogoRepository.save(jogo);
        Emprestimo emprestimo = new Emprestimo(usuario, jogo);
        return emprestimoRepository.save(emprestimo);
    }

    @Transactional
    public void finalizarEmprestimo(Long idEmprestimo) {
        if (idEmprestimo == null) {
            throw new IllegalArgumentException("Id do empréstimo deve ser informado");
        }

        Emprestimo emprestimo = emprestimoRepository.findById(idEmprestimo).orElseThrow(() -> new IllegalArgumentException("Empréstimo não encontrado"));
        if (!emprestimo.isAtivo()) {
            throw new IllegalArgumentException("O empréstimo já está inativo");
        }

        emprestimo.setAtivo(false);
        Jogo jogo = emprestimo.getJogo();
        jogo.setDisponivel(true);
        jogoRepository.save(jogo);
        emprestimoRepository.save(emprestimo);
    }

    public List<Emprestimo> listarAtivos() {
        return emprestimoRepository.findByAtivoTrue();
    }

    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }
}

