package com.chimba.model;

import jakarta.persistence.*;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "document_number", nullable = false, unique = true, length = 100)
    private String documentNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "file_id", nullable = true)
    @NotFound(action = NotFoundAction.IGNORE)
    private CargoFile cargoFile;

    @Column(name = "file_code", length = 50)
    private String fileCode;

    @Column(name = "file_date")
    private LocalDate fileDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = true)
    @NotFound(action = NotFoundAction.IGNORE)
    private Client client;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "document_type", nullable = false, length = 50)
    private String documentType;

    @Column(name = "transport_type", length = 50)
    private String transportType;

    @Column(name = "subtotal", precision = 15, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "vat", precision = 15, scale = 2)
    private BigDecimal vat = BigDecimal.ZERO;

    @Column(name = "total", precision = 15, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Transient
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DocumentItem> items = new ArrayList<>();

    public Document() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public CargoFile getCargoFile() { return cargoFile; }
    public void setCargoFile(CargoFile cargoFile) { this.cargoFile = cargoFile; }

    public String getFileCode() { return fileCode; }
    public void setFileCode(String fileCode) { this.fileCode = fileCode; }

    public LocalDate getFileDate() { return fileDate; }
    public void setFileDate(LocalDate fileDate) { this.fileDate = fileDate; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<DocumentItem> getItems() { return items; }
    public void setItems(List<DocumentItem> items) { this.items = items; }

    public BigDecimal getBalance() {
        BigDecimal paid = paidAmount != null ? paidAmount : BigDecimal.ZERO;
        BigDecimal tot = total != null ? total : BigDecimal.ZERO;
        return tot.subtract(paid);
    }
}
