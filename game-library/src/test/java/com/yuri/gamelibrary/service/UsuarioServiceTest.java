package com.yuri.gamelibrary.service;

import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Testes do UsuarioService")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioValido;

    @BeforeEach
    void setup() {
        usuarioValido = new Usuario("João Silva");
    }

    @Test
    @DisplayName("Deve registrar um usuário válido com sucesso")
    void testRegistrarUsuarioComSucesso() {
        when(usuarioRepository.save(any(Usuario.class)))
                .thenReturn(usuarioValido);

        usuarioService.registrarUsuario(usuarioValido);

        verify(usuarioRepository, times(1)).save(usuarioValido);
    }

    @Test
    @DisplayName("Deve lançar exceção ao registrar usuário nulo")
    void testRegistrarUsuarioNulo() {
        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.registrarUsuario(null);
        });

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao registrar usuário com nome nulo")
    void testRegistrarUsuarioComNomeNulo() {
        Usuario usuarioInvalido = new Usuario(null);

        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.registrarUsuario(usuarioInvalido);
        });

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao registrar usuário com nome vazio")
    void testRegistrarUsuarioComNomeVazio() {
        Usuario usuarioInvalido = new Usuario("   ");

        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.registrarUsuario(usuarioInvalido);
        });

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve buscar um usuário existente")
    void testBuscarUsuarioExistente() {
        when(usuarioRepository.findById(1L))
                .thenReturn(Optional.of(usuarioValido));

        Usuario resultado = usuarioService.buscarUsuario(1L);

        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar usuário inexistente")
    void testBuscarUsuarioInexistente() {
        when(usuarioRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.buscarUsuario(999L);
        });
    }

    @Test
    @DisplayName("Deve listar todos os usuários quando existem registros")
    void testListarTodosComUsuarios() {
        Usuario usuario2 = new Usuario("Maria Santos");
        List<Usuario> usuarios = Arrays.asList(usuarioValido, usuario2);

        when(usuarioRepository.findAll()).thenReturn(usuarios);

        List<Usuario> resultado = usuarioService.listarTodos();

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve lançar exceção ao listar usuários quando lista está vazia")
    void testListarTodosVazio() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList());

        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.listarTodos();
        });
    }
}