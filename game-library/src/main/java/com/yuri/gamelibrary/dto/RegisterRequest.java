package com.yuri.gamelibrary.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100)
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 4, max = 255)
    private String senha;

    @NotBlank(message = "Confirmação de senha é obrigatória")
    private String senhaConfirmacao;

    public boolean senhasIguais() {
        return senha != null && senha.equals(senhaConfirmacao);
    }
}