package com.yuri.gamelibrary.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Jogo jogo;
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
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