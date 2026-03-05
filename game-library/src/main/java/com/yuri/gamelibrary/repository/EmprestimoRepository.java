package com.yuri.gamelibrary.repository;

import com.yuri.gamelibrary.entity.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    List<Emprestimo> findByAtivoTrue();

    boolean existsByJogoIdAndAtivoTrue(long jogoId);
}
