package com.chimba.repository;

import com.chimba.model.DocumentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DocumentItemRepository extends JpaRepository<DocumentItem, Integer> {
    List<DocumentItem> findByDocumentId(Integer documentId);
    void deleteByDocumentId(Integer documentId);

    @Query("SELECT di.itemName, " +
           "SUM(CASE WHEN LOWER(d.documentType) = 'invoice' THEN di.lineTotal ELSE 0 END), " +
           "SUM(CASE WHEN LOWER(d.documentType) LIKE '%debit%' THEN di.lineTotal ELSE 0 END) " +
           "FROM DocumentItem di JOIN di.document d LEFT JOIN d.cargoFile f WHERE " +
           "(:from IS NULL OR d.fileDate >= :from) AND " +
           "(:to IS NULL OR d.fileDate <= :to) AND " +
           "(:clientId IS NULL OR d.client.id = :clientId) AND " +
           "(:type IS NULL OR LOWER(d.documentType) LIKE LOWER(CONCAT('%', :type, '%'))) AND " +
           "(:fileNo IS NULL OR (f.fileId IS NOT NULL AND LOWER(f.fileId) LIKE LOWER(CONCAT('%', :fileNo, '%')))) " +
           "GROUP BY di.itemName " +
           "HAVING SUM(CASE WHEN LOWER(d.documentType) = 'invoice' THEN di.lineTotal ELSE 0 END) > 0 OR " +
           "SUM(CASE WHEN LOWER(d.documentType) LIKE '%debit%' THEN di.lineTotal ELSE 0 END) > 0 " +
           "ORDER BY di.itemName ASC")
    List<Object[]> getItemSummaries(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("clientId") Integer clientId,
            @Param("type") String type,
            @Param("fileNo") String fileNo
    );

    @Query("SELECT d.documentNumber, f.fileId, d.documentType, di.lineTotal " +
           "FROM DocumentItem di JOIN di.document d LEFT JOIN d.cargoFile f WHERE " +
           "di.itemName = :itemName AND " +
           "(:from IS NULL OR d.fileDate >= :from) AND " +
           "(:to IS NULL OR d.fileDate <= :to) AND " +
           "(:clientId IS NULL OR d.client.id = :clientId) AND " +
           "(:type IS NULL OR LOWER(d.documentType) LIKE LOWER(CONCAT('%', :type, '%'))) AND " +
           "(:fileNo IS NULL OR (f.fileId IS NOT NULL AND LOWER(f.fileId) LIKE LOWER(CONCAT('%', :fileNo, '%')))) " +
           "ORDER BY d.fileDate ASC")
    List<Object[]> getItemDetails(
            @Param("itemName") String itemName,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("clientId") Integer clientId,
            @Param("type") String type,
            @Param("fileNo") String fileNo
    );
}
