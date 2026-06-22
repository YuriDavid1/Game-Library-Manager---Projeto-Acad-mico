package com.yuri.gamelibrary.controller;

import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.service.UsuarioService;
import com.yuri.gamelibrary.service.AuthService; // Importar o AuthService
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final AuthService authService; // Injetar o AuthService

    public UsuarioController(UsuarioService usuarioService, AuthService authService) {
        this.usuarioService = usuarioService;
        this.authService = authService;
    }

    @PostMapping
    public String cadastrarUsuario(@RequestBody Usuario usuario){
        usuarioService.cadastrarUsuario(usuario);
        return "Seu cadastro foi realizado";
    }

    @GetMapping
    public List<Usuario> listarUsuarios(){
        return usuarioService.listarTodos();
    }

    @GetMapping("/buscar/{nome}")
    public Usuario buscarUsuari(@PathVariable String nome){
        return usuarioService.buscarUsuario(nome);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            // Valida o token antes de deletar
            authService.getUserFromToken(token);
            usuarioService.deletarUsuario(id);
            return ResponseEntity.ok(new AuthController.MessageResponse("Conta deletada com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthController.ErrorResponse(e.getMessage()));
        }
    }
}