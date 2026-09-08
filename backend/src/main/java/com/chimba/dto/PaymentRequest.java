package com.chimba.dto;

import java.math.BigDecimal;

public class PaymentRequest {
    private Integer documentId;
    private BigDecimal paidAmount;

    public PaymentRequest() {}

    public Integer getDocumentId() { return documentId; }
    public void setDocumentId(Integer documentId) { this.documentId = documentId; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
}
