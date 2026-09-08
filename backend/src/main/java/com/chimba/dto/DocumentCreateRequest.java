package com.chimba.dto;

import java.math.BigDecimal;
import java.util.List;

public class DocumentCreateRequest {
    private String documentType; // 'Invoice' or 'Debit_Note'
    private Integer fileId;      // FK numeric
    private String fileCode;    // human readable string
    private Integer clientId;
    private String fileDate;
    private String transportType;
    private List<ItemInput> items;

    public DocumentCreateRequest() {}

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public Integer getFileId() { return fileId; }
    public void setFileId(Integer fileId) { this.fileId = fileId; }

    public String getFileCode() { return fileCode; }
    public void setFileCode(String fileCode) { this.fileCode = fileCode; }

    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }

    public String getFileDate() { return fileDate; }
    public void setFileDate(String fileDate) { this.fileDate = fileDate; }

    public String getTransportType() { return transportType; }
    public void setTransportType(String transportType) { this.transportType = transportType; }

    public List<ItemInput> getItems() { return items; }
    public void setItems(List<ItemInput> items) { this.items = items; }

    public static class ItemInput {
        private String itemName;
        private BigDecimal qty;
        private BigDecimal unitPrice;

        public ItemInput() {}

        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }

        public BigDecimal getQty() { return qty; }
        public void setQty(BigDecimal qty) { this.qty = qty; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }
}
