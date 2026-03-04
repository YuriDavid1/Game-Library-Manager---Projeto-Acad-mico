package com.yuri.gamelibrary.entity;
import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    public Usuario(String nome){
        this.nome = nome;
    }

    public Usuario(){
    }

    //Getters
    public Long getId(){
        return id;
    }

    public String getNome(){
        return nome;
    }
}