package com.yuri.gamelibrary.service;
import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }

    public void cadastrarUsuario(Usuario usuario){
        if(usuario == null){
            throw new IllegalArgumentException("Erro");
        }
        if(usuario.getNome() == null || usuario.getNome().isBlank()){
            throw new IllegalArgumentException("O nome de usuário deve ser inserido.");
        }
        Optional<Usuario> usuEncontrado = usuarioRepository.findByNomeIgnoreCase(usuario.getNome());
        if(usuEncontrado.isPresent()){
            throw new IllegalArgumentException("Nome de usuário não disponível");
        }
        usuarioRepository.save(usuario);
    }

    public Usuario buscarUsuario(String nome){
        Optional<Usuario> usuEncontrado = usuarioRepository.findByNomeIgnoreCase(nome);
        if(usuEncontrado.isEmpty()){
            throw new IllegalArgumentException("Usuario não encontrado");
        }
        return usuEncontrado.get();
    }

    public List<Usuario> listarTodos(){
        if(usuarioRepository.findAll().isEmpty()){
            throw new IllegalArgumentException("Nenhum usuário encontrado");
        }
        return usuarioRepository.findAll();
    }
}
