package com.chimba.repository;

import com.chimba.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByDocumentIdOrderByPaymentDateDesc(Integer documentId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.document.id = :documentId")
    BigDecimal sumPaidAmountByDocumentId(@Param("documentId") Integer documentId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p")
    BigDecimal sumTotalPaymentsAll();

    List<Payment> findAllByOrderByCreatedAtDesc();
}
