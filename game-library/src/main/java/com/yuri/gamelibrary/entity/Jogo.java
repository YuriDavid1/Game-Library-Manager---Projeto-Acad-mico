package com.yuri.gamelibrary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String slug; // Ex: "cyberpunk", "forza-6"

    private String nome;
    private String genero;
    private boolean disponivel;

    @Column(length = 1000) // Texto grande para a sinopse não dar erro no banco
    private String descricao;

    private String precoAluguel;
    private String precoCompra;
    private String imagemFundo;
    private String imagemCapa;

    public Jogo(String nome, String genero, String slug) {
        this.nome = nome;
        this.genero = genero;
        this.slug = slug;
        this.disponivel = true;
    }

    public Jogo(){
    }

    // Getters
    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getNome() { return nome; }
    public String getGenero() { return genero; }
    public boolean isDisponivel() { return disponivel; }
    public String getDescricao() { return descricao; }
    public String getPrecoAluguel() { return precoAluguel; }
    public String getPrecoCompra() { return precoCompra; }
    public String getImagemFundo() { return imagemFundo; }
    public String getImagemCapa() { return imagemCapa; }

    // Setters
    public void setDisponivel(boolean disponivel) { this.disponivel = disponivel; }
    public void setSlug(String slug) { this.slug = slug; }
    public void setNome(String nome) { this.nome = nome; }
    public void setGenero(String genero) { this.genero = genero; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setPrecoAluguel(String precoAluguel) { this.precoAluguel = precoAluguel; }
    public void setPrecoCompra(String precoCompra) { this.precoCompra = precoCompra; }
    public void setImagemFundo(String imagemFundo) { this.imagemFundo = imagemFundo; }
    public void setImagemCapa(String imagemCapa) { this.imagemCapa = imagemCapa; }
}