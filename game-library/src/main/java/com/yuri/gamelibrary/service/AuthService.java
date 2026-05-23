package com.yuri.gamelibrary.service;

import com.yuri.gamelibrary.dto.LoginRequest;
import com.yuri.gamelibrary.dto.LoginResponse;
import com.yuri.gamelibrary.dto.RegisterRequest;
import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // Classe que vamos criar

    /**
     * Login com email e senha
     */
    public LoginResponse login(LoginRequest request) {
        log.info("Iniciando login para: {}", request.getEmail());

        // Buscar usuário pelo email
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        // Validar senha
        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        // Gerar token JWT
        String token = jwtService.generateToken(usuario);

        log.info("Login bem-sucedido para: {}", usuario.getEmail());

        return new LoginResponse(
                token,
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail()
        );
    }

    /**
     * Registrar novo usuário
     */
    public Usuario register(RegisterRequest request) {
        log.info("Iniciando registro para: {}", request.getEmail());

        // Validar se email já existe
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Criar novo usuário
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        log.info("Usuário registrado com sucesso: {}", request.getEmail());

        return usuarioSalvo;
    }

    /**
     * Buscar usuário pelo token JWT
     */
    public Usuario getUserFromToken(String token) {
        try {
            // Remover "Bearer " do token se existir
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Long usuarioId = jwtService.extractUserId(token);

            return usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        } catch (Exception e) {
            throw new RuntimeException("Token inválido ou expirado");
        }
    }

    /**
     * Validar token
     */
    public boolean isTokenValid(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            return jwtService.isTokenValid(token);
        } catch (Exception e) {
            return false;
        }
    }
}