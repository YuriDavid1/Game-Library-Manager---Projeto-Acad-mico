package com.yuri.gamelibrary.controller;

import com.yuri.gamelibrary.entity.Emprestimo;
import com.yuri.gamelibrary.service.EmprestimoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimo")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService){
        this.emprestimoService = emprestimoService;
    }

    @PostMapping
    public String criarEmprestimo(@RequestBody Emprestimo emprestimo){
        emprestimoService.criarEmprestimo(emprestimo.getUsuario().getNome(), emprestimo.getJogo().getNome());
        return "Emprestimo realizado";
    }

    @GetMapping
    public List<Emprestimo> listarEmprestimos(){
        return emprestimoService.listarTodos();
    }

    @GetMapping("/ativos")
    public List<Emprestimo> listarAtivos(){
        return emprestimoService.listarAtivos();
    }

    @PatchMapping("/{id}/finalizar")
    public String finalizarEmprestimo(@PathVariable Long id){
    emprestimoService.finalizarEmprestimo(id);
    return "Emprestimo finalizado.";
    }
}
