package com.yuri.gamelibrary.controller;

import com.yuri.gamelibrary.dto.LoginRequest;
import com.yuri.gamelibrary.dto.LoginResponse;
import com.yuri.gamelibrary.dto.RegisterRequest;
import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.yuri.gamelibrary.dto.AlterarSenhaRequest;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;

    /**
     * Login com email e senha
     Retorna JWT token
     */
    /**
     * Login com email e senha
     Retorna JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) { //Troque <LoginResponse> por <?>
        log.info("Login attempt para email: {}", request.getEmail());
        try {
            LoginResponse response = authService.login(request);
            log.info("Login bem-sucedido para: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro no login: {}", e.getMessage());
            // Retorne o body com a ErrorResponse:
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Registrar novo usuário
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Tentativa de registro para: {}", request.getEmail());
        try {
            Usuario usuario = authService.register(request);
            log.info("Usuário registrado: {}", usuario.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (Exception e) {
            log.error("Erro no registro: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obter dados do usuário logado
     */
    @GetMapping("/me")
    public ResponseEntity<Usuario> getCurrentUser(
            @RequestHeader(value = "Authorization") String token) {
        try {
            Usuario usuario = authService.getUserFromToken(token);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        log.info("Logout realizado");
        return ResponseEntity.ok(new MessageResponse("Logout bem-sucedido"));
    }

    @PutMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(
            @RequestHeader("Authorization") String token,
            @RequestBody AlterarSenhaRequest request) {

        try {
            authService.alterarSenha(token, request);

            return ResponseEntity.ok(
                    new MessageResponse("Senha alterada com sucesso")
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );

        }
    }

    @AllArgsConstructor
    public static class ErrorResponse {
        public String message;
    }

    @AllArgsConstructor
    public static class MessageResponse {
        public String message;
    }
}