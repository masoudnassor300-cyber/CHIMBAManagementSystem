package com.chimba.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CargoFileDto {
    private Integer id;
    private String fileId;
    private String jobNumber;
    private Integer clientId;
    private String clientName;
    private String supplierName;
    private String awbBl;
    private String reference;
    private String description;
    private String vessel;
    private String placeOfLoading;
    private LocalDate fileDate;
    private LocalDateTime createdAt;

    public CargoFileDto() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

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
