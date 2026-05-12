package com.yuri.gamelibrary.service;

import com.yuri.gamelibrary.entity.Jogo;
import com.yuri.gamelibrary.repository.JogoRepository;
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
@DisplayName("Testes do JogoService")
class JogoServiceTest {

    @Mock
    private JogoRepository jogoRepository;

    @InjectMocks
    private JogoService jogoService;

    private Jogo jogoValido;

    @BeforeEach
    void setup() {
        jogoValido = new Jogo("God of War", "Ação");
        jogoValido.setDisponivel(true);
    }

    @Test
    @DisplayName("Deve cadastrar um jogo válido com sucesso")
    void testCadastrarJogoComSucesso() {
        when(jogoRepository.findByNomeIgnoreCase(anyString()))
                .thenReturn(Optional.empty());
        when(jogoRepository.save(any(Jogo.class)))
                .thenReturn(jogoValido);

        jogoService.cadastrarJogo(jogoValido);

        verify(jogoRepository, times(1)).save(jogoValido);
        assertTrue(jogoValido.isDisponivel());
    }

    @Test
    @DisplayName("Deve lançar exceção ao cadastrar jogo com nome nulo")
    void testCadastrarJogoComNomeNulo() {
        Jogo jogoInvalido = new Jogo(null, "Ação");

        assertThrows(IllegalArgumentException.class, () -> {
            jogoService.cadastrarJogo(jogoInvalido);
        });

        verify(jogoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao cadastrar jogo com nome vazio")
    void testCadastrarJogoComNomeVazio() {
        Jogo jogoInvalido = new Jogo("   ", "Ação");

        assertThrows(IllegalArgumentException.class, () -> {
            jogoService.cadastrarJogo(jogoInvalido);
        });

        verify(jogoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao cadastrar jogo nulo")
    void testCadastrarJogoNulo() {
        assertThrows(IllegalArgumentException.class, () -> {
            jogoService.cadastrarJogo(null);
        });

        verify(jogoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao cadastrar jogo duplicado")
    void testCadastrarJogoDuplicado() {
        when(jogoRepository.findByNomeIgnoreCase(anyString()))
                .thenReturn(Optional.of(jogoValido));

        assertThrows(IllegalArgumentException.class, () -> {
            jogoService.cadastrarJogo(jogoValido);
        });

        verify(jogoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve buscar um jogo existente pelo nome")
    void testBuscarJogoExistente() {
        when(jogoRepository.findByNomeIgnoreCase("God of War"))
                .thenReturn(Optional.of(jogoValido));

        Jogo resultado = jogoService.buscarJogo("God of War");

        assertNotNull(resultado);
        assertEquals("God of War", resultado.getNome());
        assertEquals("Ação", resultado.getGenero());
        verify(jogoRepository, times(1)).findByNomeIgnoreCase("God of War");
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar jogo inexistente")
    void testBuscarJogoInexistente() {
        when(jogoRepository.findByNomeIgnoreCase(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            jogoService.buscarJogo("Jogo Inexistente");
        });
    }

    @Test
    @DisplayName("Deve deletar um jogo existente")
    void testDeletarJogoExistente() {
        when(jogoRepository.findByNomeIgnoreCase("God of War"))
                .thenReturn(Optional.of(jogoValido));

        jogoService.deletarJogo("God of War");

        verify(jogoRepository, times(1)).delete(jogoValido);
    }

    @Test
    @DisplayName("Deve lançar exceção ao deletar jogo inexistente")
    void testDeletarJogoInexistente() {
        when(jogoRepository.findByNomeIgnoreCase(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            jogoService.deletarJogo("Jogo Inexistente");
        });

        verify(jogoRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Deve listar todos os jogos quando existem registros")
    void testListarTodosComJogos() {
        Jogo jogo2 = new Jogo("The Last of Us", "Ação");
        List<Jogo> jogos = Arrays.asList(jogoValido, jogo2);

        when(jogoRepository.findAll()).thenReturn(jogos);

        List<Jogo> resultado = jogoService.listarTodos();

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(jogoRepository, times(2)).findAll();
    }

    @Test
    @DisplayName("Deve lançar exceção ao listar quando lista está vazia")
    void testListarTodosVazio() {
        when(jogoRepository.findAll()).thenReturn(Arrays.asList());

        assertThrows(IllegalArgumentException.class, () -> {
            jogoService.listarTodos();
        });
    }

    @Test
    @DisplayName("Deve manter disponibilidade como true ao cadastrar")
    void testDisponibilidadeAoCadastrar() {
        Jogo jogoNovo = new Jogo("Elden Ring", "RPG");
        when(jogoRepository.findByNomeIgnoreCase(anyString()))
                .thenReturn(Optional.empty());

        jogoService.cadastrarJogo(jogoNovo);

        assertTrue(jogoNovo.isDisponivel());
    }

    @Test
    @DisplayName("Deve respeitar case-insensitive na busca")
    void testBuscaCaseInsensitive() {
        when(jogoRepository.findByNomeIgnoreCase("GOD OF WAR"))
                .thenReturn(Optional.of(jogoValido));

        Jogo resultado = jogoService.buscarJogo("GOD OF WAR");

        assertNotNull(resultado);
        verify(jogoRepository, times(1)).findByNomeIgnoreCase("GOD OF WAR");
    }
}