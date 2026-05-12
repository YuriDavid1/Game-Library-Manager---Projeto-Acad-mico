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
import static org.mockito.ArgumentMatchers.anyString;
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
    @DisplayName("Deve cadastrar um usuário válido com sucesso")
    void testCadastrarUsuarioComSucesso() {
        when(usuarioRepository.findByNomeIgnoreCase(anyString()))
                .thenReturn(Optional.empty());

        usuarioService.cadastrarUsuario(usuarioValido);

        verify(usuarioRepository, times(1)).save(usuarioValido);
    }

    @Test
    @DisplayName("Deve lançar exceção ao cadastrar usuário nulo")
    void testCadastrarUsuarioNulo() {
        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.cadastrarUsuario(null);
        });

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao cadastrar usuário com nome nulo")
    void testCadastrarUsuarioComNomeNulo() {
        Usuario usuarioInvalido = new Usuario(null);

        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.cadastrarUsuario(usuarioInvalido);
        });

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao cadastrar usuário com nome vazio")
    void testCadastrarUsuarioComNomeVazio() {
        Usuario usuarioInvalido = new Usuario("   ");

        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.cadastrarUsuario(usuarioInvalido);
        });

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao cadastrar usuário com nome duplicado")
    void testCadastrarUsuarioDuplicado() {
        when(usuarioRepository.findByNomeIgnoreCase(anyString()))
                .thenReturn(Optional.of(usuarioValido));

        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.cadastrarUsuario(usuarioValido);
        });

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve buscar um usuário existente pelo nome")
    void testBuscarUsuarioExistente() {
        when(usuarioRepository.findByNomeIgnoreCase("João Silva"))
                .thenReturn(Optional.of(usuarioValido));

        Usuario resultado = usuarioService.buscarUsuario("João Silva");

        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        verify(usuarioRepository, times(1)).findByNomeIgnoreCase("João Silva");
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar usuário inexistente")
    void testBuscarUsuarioInexistente() {
        when(usuarioRepository.findByNomeIgnoreCase(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.buscarUsuario("Usuário Inexistente");
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
        verify(usuarioRepository, times(2)).findAll();
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