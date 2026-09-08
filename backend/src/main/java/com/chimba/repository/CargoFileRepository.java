package com.chimba.repository;

import com.chimba.model.CargoFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CargoFileRepository extends JpaRepository<CargoFile, Integer> {
    boolean existsByFileId(String fileId);

    @Query("SELECT COUNT(f) FROM CargoFile f WHERE f.client.id = :clientId")
    long countByClientId(@Param("clientId") Integer clientId);

    @Query("SELECT f FROM CargoFile f LEFT JOIN f.client c WHERE " +
           "(:dateFrom IS NULL OR f.fileDate >= :dateFrom) AND " +
           "(:dateTo IS NULL OR f.fileDate <= :dateTo) AND " +
           "(:fileFrom IS NULL OR f.fileId >= :fileFrom) AND " +
           "(:fileTo IS NULL OR f.fileId <= :fileTo) AND " +
           "(:customerName IS NULL OR (c.name IS NOT NULL AND LOWER(c.name) LIKE LOWER(CONCAT('%', :customerName, '%')))) " +
           "ORDER BY f.fileId ASC")
    List<CargoFile> filterFiles(
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            @Param("fileFrom") String fileFrom,
            @Param("fileTo") String fileTo,
            @Param("customerName") String customerName
    );
}
