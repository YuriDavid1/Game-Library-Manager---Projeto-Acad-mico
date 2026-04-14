package com.yuri.gamelibrary.Exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> tratarIllegalArgumentException(IllegalArgumentException ex) {

        Map<String, Object> erro = new HashMap<>();
        erro.put("status", 400);
        erro.put("erro", ex.getMessage());

        return ResponseEntity.badRequest().body(erro);
    }

    public ResponseEntity<Map<String, Object>> tratarExceptionGenerica(Exception ex) {

        Map<String, Object> erro = new HashMap<>();
        erro.put("status", 500);
        erro.put("erro", "Erro interno no servidor");

        return ResponseEntity.internalServerError().body(erro);
    }
}