package com.yuri.gamelibrary.controller;

import com.yuri.gamelibrary.entity.Emprestimo;
import com.yuri.gamelibrary.service.EmprestimoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping
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

    @GetMapping
    public List<Emprestimo> listarAtivos(){
        return emprestimoService.listarAtivos();
    }

    @DeleteMapping("/by-name/{nome}")
    public String finalizarEmprestimo(@PathVariable Long idEmprestimo){
    emprestimoService.finalizarEmprestimo(idEmprestimo);
    return "Emprestimo finalizado.";
}




}
