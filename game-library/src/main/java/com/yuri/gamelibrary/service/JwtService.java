package com.yuri.gamelibrary.service;

import com.yuri.gamelibrary.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;

    /**
     * Gerar token JWT
     */
    public String generateToken(Usuario usuario) {
        try {
            SecretKey key = getSigningKey();

            return Jwts.builder()
                    .setSubject(String.valueOf(usuario.getId()))
                    .claim("email", usuario.getEmail())
                    .claim("nome", usuario.getNome())
                    .claim("role", usuario.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            log.error("Erro ao gerar token JWT: {}", e.getMessage());
            throw new RuntimeException("Erro ao gerar token");
        }
    }

    /**
     * Extrair ID do usuário do token
     */
    public Long extractUserId(String token) {
        try {
            SecretKey key = getSigningKey();

            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Long.parseLong(claims.getSubject());

        } catch (Exception e) {
            log.error("Erro ao extrair ID do token: {}", e.getMessage());
            throw new RuntimeException("Token inválido");
        }
    }

    /**
     * Extrair email do token
     */
    public String extractEmail(String token) {        try {
            SecretKey key = getSigningKey();

            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return (String) claims.get("email");

        } catch (Exception e) {
            throw new RuntimeException("Token inválido");
        }
    }

    /**
     * Validar token
     */
    public boolean isTokenValid(String token) {
        try {
            SecretKey key = getSigningKey();

            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception e) {
            log.warn("Token inválido: {}", e.getMessage());
            return false;
        }
    }

    /**
     Gerar a chave de assinatura
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}