package com.yuri.gamelibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {  // ← IMPORTANTE: "public"
    private String token;
    private Long id;
    private String nome;
    private String email;
    private String role;
}