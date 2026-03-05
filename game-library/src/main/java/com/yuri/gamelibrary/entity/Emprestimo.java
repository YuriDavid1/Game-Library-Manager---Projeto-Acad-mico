package com.yuri.gamelibrary.entity;
import jakarta.persistence.*;

@Entity
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Jogo jogo;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Usuario usuario;
    private boolean ativo;

    public Emprestimo(){

    }

    public Emprestimo(Usuario usuario, Jogo jogo){
        this.usuario = usuario;
        this.jogo = jogo;
        this.ativo = true;
    }

    //Getters
    public Jogo getJogo(){
        return jogo;
    }

    public Usuario getUsuario(){
        return usuario;
    }

    public boolean isAtivo(){
        return ativo;
    }

    //Setters
    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}