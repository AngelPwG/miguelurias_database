package com.muteam.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para validaciones
 * Intercepta errores de @Valid y retorna mensajes claros al frontend
 */
@RestControllerAdvice
public class ValidationExceptionHandler {

    /**
     * Maneja errores de validación de @Valid en los DTOs
     * Retorna un JSON con los campos que fallaron y sus mensajes
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errores = new HashMap<>();

        // Extraer todos los errores de validación
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String campo = ((FieldError) error).getField();
            String mensaje = error.getDefaultMessage();
            errores.put(campo, mensaje);
        });

        response.put("mensaje", "Error de validación");
        response.put("errores", errores);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
