package com.yuri.gamelibrary.dto;
import lombok.Data;

@Data
public class AlterarSenhaRequest {
    private String senhaAtual;
    private String novaSenha;
    private String confirmarSenha;

}