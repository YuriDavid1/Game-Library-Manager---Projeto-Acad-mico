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
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret:9fK2mL8xQwR7vBn3ZpA6sDcE1tYuHjK5rTyUiOpLmN8vCxZa")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}") // 1 hora
    private long jwtExpiration;

    /**
     * Gerar token JWT
     */
    public String generateToken(Usuario usuario) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            return Jwts.builder()
                    .setSubject(String.valueOf(usuario.getId()))
                    .claim("email", usuario.getEmail())
                    .claim("nome", usuario.getNome())
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
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            log.error("Erro ao extrair ID do token: {}", e.getMessage());
            throw new RuntimeException("Token inválido");
        }
    }

    /**
     * Extrair email do token
     */
    public String extractEmail(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

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
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            log.warn("Token inválido: {}", e.getMessage());
            return false;
        }
    }
}