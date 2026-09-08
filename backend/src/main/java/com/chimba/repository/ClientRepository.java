package com.chimba.repository;

import com.chimba.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {
    Optional<Client> findByClientId(String clientId);
    boolean existsByClientId(String clientId);

    @Query("SELECT c FROM Client c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.clientId) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY c.createdAt DESC")
    List<Client> searchClients(String query);

    List<Client> findAllByOrderByCreatedAtDesc();
}
