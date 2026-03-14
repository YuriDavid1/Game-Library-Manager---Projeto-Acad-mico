package com.yuri.gamelibrary.controller;

import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class UsuarioController {

    private final UsuarioService usuarioService;


    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
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

    @GetMapping("/by-name/{nome}")
    public Usuario buscarUsuari(@PathVariable String nome){
        return usuarioService.buscarUsuario(nome);
    }

}
