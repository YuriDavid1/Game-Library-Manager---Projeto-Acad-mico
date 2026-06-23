package com.yuri.gamelibrary.config;

import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/*
 *
 * Credenciais padrão:
 *    Email: admin@gamelibrary.com
 *    Senha: admin123
 */
@Configuration
@Slf4j
public class DataInitializer {

    private static final String ADMIN_EMAIL = "admin@gamelibrary.com";
    private static final String ADMIN_SENHA = "admin123";

    @Bean
    public CommandLineRunner criarAdminPadrao(UsuarioRepository usuarioRepository,
                                              PasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarioRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
                log.info("Admin padrão já existe ({}). Nenhuma ação necessária.", ADMIN_EMAIL);
                return;
            }

            Usuario admin = new Usuario();
            admin.setNome("admin");
            admin.setEmail(ADMIN_EMAIL);
            admin.setSenha(passwordEncoder.encode(ADMIN_SENHA));
            admin.setRole("ADMIN");

            usuarioRepository.save(admin);

            log.info("==================================================");
            log.info(" Admin padrão criado com sucesso!");
            log.info("   Email: {}", ADMIN_EMAIL);
            log.info("   Senha: {}", ADMIN_SENHA);
            log.info("==================================================");
        };
    }
}
