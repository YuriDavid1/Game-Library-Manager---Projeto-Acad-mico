package com.yuri.gamelibrary.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuarios", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 20, message = "Nome deve ter entre 3 e 20 caracteres")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 4, max = 255, message = "Senha deve ter pelo menos 4 caracteres")
    @Column(nullable = false, length = 255)
    private String senha;

    // Papel do usuário no sistema: "USER" (padrão) ou "ADMIN".
    // É enviado no JSON para o front-end decidir se libera o painel administrativo.
    @Column(nullable = false, length = 20)
    private String role = "USER";

    public Usuario(String nome) {
        this.nome = nome;
        this.role = "USER";
    }

    // Helper para checagens de permissão no back-end
    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(this.role);
    }
}