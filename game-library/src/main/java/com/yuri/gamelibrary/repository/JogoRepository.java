package com.yuri.gamelibrary.repository;
import com.yuri.gamelibrary.entity.Jogo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JogoRepository extends JpaRepository<Jogo, Long> {

    Optional<Jogo> findByNomeIgnoreCase(String nome);

}
