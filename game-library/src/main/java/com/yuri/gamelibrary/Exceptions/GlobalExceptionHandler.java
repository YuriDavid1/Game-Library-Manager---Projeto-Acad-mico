package com.yuri.gamelibrary.Exceptions;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, Object> tratarIllegalArgumentException(IllegalArgumentException ex){

        Map<String, Object> erro = new HashMap<>();

        erro.put("status", 400);
        erro.put("erro", ex.getMessage());

        return erro;
    }


}
