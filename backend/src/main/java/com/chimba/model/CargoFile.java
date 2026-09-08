package com.chimba.model;

import jakarta.persistence.*;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class CargoFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "file_id", nullable = false, unique = true, length = 50)
    private String fileId;

    @Column(name = "job_number", length = 50)
    private String jobNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = true)
    @NotFound(action = NotFoundAction.IGNORE)
    private Client client;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "awb_bl", length = 100)
    private String awbBl;

    @Column(name = "reference", length = 100)
    private String reference;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "vessel", length = 100)
    private String vessel;

    @Column(name = "place_of_loading", length = 100)
    private String placeOfLoading;

    @Column(name = "file_date")
    private LocalDate fileDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public CargoFile() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getAwbBl() { return awbBl; }
    public void setAwbBl(String awbBl) { this.awbBl = awbBl; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVessel() { return vessel; }
    public void setVessel(String vessel) { this.vessel = vessel; }

    public String getPlaceOfLoading() { return placeOfLoading; }
    public void setPlaceOfLoading(String placeOfLoading) { this.placeOfLoading = placeOfLoading; }

    public LocalDate getFileDate() { return fileDate; }
    public void setFileDate(LocalDate fileDate) { this.fileDate = fileDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
