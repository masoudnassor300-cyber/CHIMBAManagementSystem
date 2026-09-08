package com.chimba.dto;

import java.math.BigDecimal;

public class ItemDetailDto {
    private String documentNumber;
    private String fileId;
    private String documentType;
    private BigDecimal amount;

    public ItemDetailDto() {}

    public ItemDetailDto(String documentNumber, String fileId, String documentType, BigDecimal amount) {
        this.documentNumber = documentNumber;
        this.fileId = fileId;
        this.documentType = documentType;
        this.amount = amount;
    }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
