package com.chimba.dto;

import java.math.BigDecimal;
import java.util.List;

public class ItemSummaryDto {
    private String itemName;
    private String itemId;
    private BigDecimal invoiceTotal;
    private BigDecimal debitTotal;
    private List<ItemDetailDto> details;

    public ItemSummaryDto() {}

    public ItemSummaryDto(String itemName, String itemId, BigDecimal invoiceTotal, BigDecimal debitTotal) {
        this.itemName = itemName;
        this.itemId = itemId;
        this.invoiceTotal = invoiceTotal;
        this.debitTotal = debitTotal;
    }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public BigDecimal getInvoiceTotal() { return invoiceTotal; }
    public void setInvoiceTotal(BigDecimal invoiceTotal) { this.invoiceTotal = invoiceTotal; }

    public BigDecimal getDebitTotal() { return debitTotal; }
    public void setDebitTotal(BigDecimal debitTotal) { this.debitTotal = debitTotal; }

    public List<ItemDetailDto> getDetails() { return details; }
    public void setDetails(List<ItemDetailDto> details) { this.details = details; }
}
