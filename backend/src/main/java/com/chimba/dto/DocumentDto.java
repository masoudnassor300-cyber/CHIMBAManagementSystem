package com.chimba.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DocumentDto {
    private Integer id;
    private String documentNumber;
    private Integer fileId;
    private String fileCode;
    private LocalDate fileDate;
    private Integer clientId;
    private String clientName;
    private String clientAddress;
    private String clientCity;
    private String clientEmail;
    private String clientTin;
    private String supplierName;
    private String documentType;
    private String transportType;
    private BigDecimal subtotal;
    private BigDecimal vat;
    private BigDecimal total;
    private BigDecimal paidAmount;
    private BigDecimal balance;
    private String status; // UNPAID, PARTIALLY_PAID, PAID
    private Integer paymentsCount = 0;
    private List<PaymentDto> paymentHistory;
    private LocalDateTime createdAt;

    // File details for print
    private String jobNumber;
    private String awbBl;
    private String reference;
    private String description;
    private String vessel;
    private String placeOfLoading;

    private List<ItemDto> items;

    public DocumentDto() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public Integer getFileId() { return fileId; }
    public void setFileId(Integer fileId) { this.fileId = fileId; }

    public String getFileCode() { return fileCode; }
    public void setFileCode(String fileCode) { this.fileCode = fileCode; }

    public LocalDate getFileDate() { return fileDate; }
    public void setFileDate(LocalDate fileDate) { this.fileDate = fileDate; }

    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientAddress() { return clientAddress; }
    public void setClientAddress(String clientAddress) { this.clientAddress = clientAddress; }

    public String getClientCity() { return clientCity; }
    public void setClientCity(String clientCity) { this.clientCity = clientCity; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getClientTin() { return clientTin; }
    public void setClientTin(String clientTin) { this.clientTin = clientTin; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getTransportType() { return transportType; }
    public void setTransportType(String transportType) { this.transportType = transportType; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getVat() { return vat; }
    public void setVat(BigDecimal vat) { this.vat = vat; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getPaymentsCount() { return paymentsCount; }
    public void setPaymentsCount(Integer paymentsCount) { this.paymentsCount = paymentsCount; }

    public List<PaymentDto> getPaymentHistory() { return paymentHistory; }
    public void setPaymentHistory(List<PaymentDto> paymentHistory) { this.paymentHistory = paymentHistory; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

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

    public List<ItemDto> getItems() { return items; }
    public void setItems(List<ItemDto> items) { this.items = items; }

    public static class ItemDto {
        private Integer id;
        private String itemName;
        private BigDecimal qty;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;

        public ItemDto() {}

        public ItemDto(Integer id, String itemName, BigDecimal qty, BigDecimal unitPrice, BigDecimal lineTotal) {
            this.id = id;
            this.itemName = itemName;
            this.qty = qty;
            this.unitPrice = unitPrice;
            this.lineTotal = lineTotal;
        }

        public Integer getId() { return id; }
        public String getItemName() { return itemName; }
        public BigDecimal getQty() { return qty; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public BigDecimal getLineTotal() { return lineTotal; }
    }
}
