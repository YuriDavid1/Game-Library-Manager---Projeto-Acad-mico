package com.yuri.gamelibrary.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Jogo {

    @Id
    @GeneratedValue private Long id;
    private String nome;
    private String genero;
    private boolean disponivel;

    public Jogo(String nome, String genero) {
        this.nome = nome;
        this.genero = genero;
        disponivel = true;
    }

    public Jogo(){
    }

    //Getters
    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getGenero() {
        return genero;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    //Setters
    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }
}
