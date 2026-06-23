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

    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    // ===== MÉTODOS ADMINISTRATIVOS =====

    // Lista sem lançar exceção quando vazio (para o painel admin)
    public List<Usuario> listarTodosAdmin() {
        return usuarioRepository.findAll();
    }

    // Promove/rebaixa um usuário (define a role: "USER" ou "ADMIN")
    public Usuario definirRole(Long id, String role) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (role == null) role = "USER";
        role = role.toUpperCase();
        if (!role.equals("USER") && !role.equals("ADMIN")) {
            throw new IllegalArgumentException("Role inválida. Use USER ou ADMIN.");
        }
        usuario.setRole(role);
        return usuarioRepository.save(usuario);
    }
}
