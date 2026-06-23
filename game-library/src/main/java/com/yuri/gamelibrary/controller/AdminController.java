package com.yuri.gamelibrary.controller;

import com.yuri.gamelibrary.entity.Emprestimo;
import com.yuri.gamelibrary.entity.Jogo;
import com.yuri.gamelibrary.entity.Usuario;
import com.yuri.gamelibrary.service.AuthService;
import com.yuri.gamelibrary.service.EmprestimoService;
import com.yuri.gamelibrary.service.JogoService;
import com.yuri.gamelibrary.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final UsuarioService usuarioService;
    private final JogoService jogoService;
    private final EmprestimoService emprestimoService;
    private final AuthService authService;

    public AdminController(UsuarioService usuarioService,
                           JogoService jogoService,
                           EmprestimoService emprestimoService,
                           AuthService authService) {
        this.usuarioService = usuarioService;
        this.jogoService = jogoService;
        this.emprestimoService = emprestimoService;
        this.authService = authService;
    }

    // Valida o token; lança exceção tratada no handler abaixo se inválido.
    private void validarToken(String token) {
        authService.getUserFromToken(token);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(@RequestHeader("Authorization") String token) {
        validarToken(token);

        List<Usuario> usuarios = usuarioService.listarTodosAdmin();
        List<Jogo> jogos = jogoService.listarTodosAdmin();
        List<Emprestimo> emprestimos = emprestimoService.listarTodos();

        long jogosDisponiveis = jogos.stream().filter(Jogo::isDisponivel).count();
        long emprestimosAtivos = emprestimos.stream().filter(Emprestimo::isAtivo).count();
        long totalAdmins = usuarios.stream().filter(Usuario::isAdmin).count();

        Map<String, Object> stats = Map.of(
                "totalUsuarios", usuarios.size(),
                "totalAdmins", totalAdmins,
                "totalJogos", jogos.size(),
                "jogosDisponiveis", jogosDisponiveis,
                "jogosIndisponiveis", jogos.size() - jogosDisponiveis,
                "totalEmprestimos", emprestimos.size(),
                "emprestimosAtivos", emprestimosAtivos
        );
        return ResponseEntity.ok(stats);
    }


    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios(@RequestHeader("Authorization") String token) {
        validarToken(token);
        return ResponseEntity.ok(usuarioService.listarTodosAdmin());
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id,
                                            @RequestHeader("Authorization") String token) {
        Usuario admin = authService.getUserFromToken(token);
        // Pequena proteção: admin não pode deletar a própria conta pelo painel
        if (admin.getId().equals(id)) {
            return ResponseEntity.badRequest()
                    .body(new AuthController.ErrorResponse("Você não pode excluir a sua própria conta de administrador."));
        }
        usuarioService.deletarUsuario(id);
        return ResponseEntity.ok(new AuthController.MessageResponse("Usuário deletado com sucesso"));
    }


    @PutMapping("/usuarios/{id}/role")
    public ResponseEntity<?> definirRole(@PathVariable Long id,
                                         @RequestBody Map<String, String> body,
                                         @RequestHeader("Authorization") String token) {
        validarToken(token);
        Usuario atualizado = usuarioService.definirRole(id, body.get("role"));
        return ResponseEntity.ok(atualizado);
    }

    //  JOGOS

    @GetMapping("/jogos")
    public ResponseEntity<?> listarJogos(@RequestHeader("Authorization") String token) {
        validarToken(token);
        return ResponseEntity.ok(jogoService.listarTodosAdmin());
    }

    // Cria um novo jogo (já entra na biblioteca, pois fica disponivel=true)
    @PostMapping("/jogos")
    public ResponseEntity<?> criarJogo(@RequestBody Jogo jogo,
                                       @RequestHeader("Authorization") String token) {
        validarToken(token);
        Jogo salvo = jogoService.cadastrarERetornar(jogo);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/jogos/{id}")
    public ResponseEntity<?> atualizarJogo(@PathVariable Long id,
                                           @RequestBody Jogo jogo,
                                           @RequestHeader("Authorization") String token) {
        validarToken(token);
        Jogo atualizado = jogoService.atualizarJogo(id, jogo);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/jogos/{id}")
    public ResponseEntity<?> deletarJogo(@PathVariable Long id,
                                         @RequestHeader("Authorization") String token) {
        validarToken(token);
        jogoService.deletarPorId(id);
        return ResponseEntity.ok(new AuthController.MessageResponse("Jogo deletado com sucesso"));
    }


    //  EMPRÉSTIMOS

    @GetMapping("/emprestimos")
    public ResponseEntity<?> listarEmprestimos(@RequestHeader("Authorization") String token) {
        validarToken(token);
        return ResponseEntity.ok(emprestimoService.listarTodos());
    }

    @PatchMapping("/emprestimos/{id}/finalizar")
    public ResponseEntity<?> finalizarEmprestimo(@PathVariable Long id,
                                                 @RequestHeader("Authorization") String token) {
        validarToken(token);
        emprestimoService.finalizarEmprestimo(id);
        return ResponseEntity.ok(new AuthController.MessageResponse("Empréstimo finalizado com sucesso"));
    }


    //  Tratamento de erros (token inválido, não encontrado, etc.)

    @ExceptionHandler({RuntimeException.class, IllegalArgumentException.class})
    public ResponseEntity<?> tratarErros(RuntimeException e) {
        String msg = e.getMessage() == null ? "Erro inesperado" : e.getMessage();
        HttpStatus status = msg.toLowerCase().contains("token") || msg.toLowerCase().contains("acesso negado")
                ? HttpStatus.UNAUTHORIZED
                : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(new AuthController.ErrorResponse(msg));
    }
}
