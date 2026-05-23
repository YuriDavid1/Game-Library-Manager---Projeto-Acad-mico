package com.yuri.gamelibrary.repository;

import com.yuri.gamelibrary.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuário por email (para login)
    Optional<Usuario> findByEmail(String email);

    // Buscar usuário por nome (compatibilidade com código antigo)
    Optional<Usuario> findByNome(String nome);

    // Verificar se email já existe
    boolean existsByEmail(String email);

    // Verificar se nome já existe
    boolean existsByNome(String nome);
}