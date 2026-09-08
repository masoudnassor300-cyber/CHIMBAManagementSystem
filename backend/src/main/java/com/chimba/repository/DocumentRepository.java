package com.chimba.repository;

import com.chimba.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    boolean existsByDocumentNumber(String documentNumber);

    long countByDocumentType(String documentType);

    @Query("SELECT COALESCE(SUM(d.total), 0) FROM Document d WHERE LOWER(d.documentType) = 'invoice'")
    BigDecimal sumInvoiceTotals();

    @Query("SELECT COALESCE(SUM(d.total), 0) FROM Document d WHERE LOWER(d.documentType) LIKE '%debit%'")
    BigDecimal sumDebitNoteTotals();

    @Query("SELECT COALESCE(SUM(d.total), 0) FROM Document d")
    BigDecimal sumTotalLeftToCollect();

    @Query("SELECT d FROM Document d LEFT JOIN d.client c LEFT JOIN d.cargoFile f WHERE " +
           "(:dateFrom IS NULL OR d.fileDate >= :dateFrom) AND " +
           "(:dateTo IS NULL OR d.fileDate <= :dateTo) AND " +
           "(:docType IS NULL OR LOWER(d.documentType) LIKE LOWER(CONCAT('%', :docType, '%'))) AND " +
           "(:clientName IS NULL OR (c.name IS NOT NULL AND LOWER(c.name) LIKE LOWER(CONCAT('%', :clientName, '%')))) AND " +
           "(:clientId IS NULL OR (c.id IS NOT NULL AND c.id = :clientId)) AND " +
           "(:fileNo IS NULL OR (f.fileId IS NOT NULL AND LOWER(f.fileId) LIKE LOWER(CONCAT('%', :fileNo, '%'))))")
    List<Document> filterDocuments(
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            @Param("docType") String docType,
            @Param("clientName") String clientName,
            @Param("clientId") Integer clientId,
            @Param("fileNo") String fileNo
    );

    @Query("SELECT d FROM Document d ORDER BY d.createdAt DESC")
    List<Document> findAllWithOrdering();
}
