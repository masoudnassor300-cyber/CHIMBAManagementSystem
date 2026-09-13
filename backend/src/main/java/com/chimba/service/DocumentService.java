package com.chimba.service;

import com.chimba.dto.DocumentCreateRequest;
import com.chimba.dto.DocumentDto;
import com.chimba.model.CargoFile;
import com.chimba.model.Client;
import com.chimba.model.Document;
import com.chimba.model.DocumentItem;
import com.chimba.repository.CargoFileRepository;
import com.chimba.repository.ClientRepository;
import com.chimba.repository.DocumentItemRepository;
import com.chimba.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import com.chimba.dto.PaymentDto;
import com.chimba.model.Payment;
import com.chimba.repository.PaymentRepository;
import com.chimba.repository.CargoFileRepository;
import com.chimba.repository.ClientRepository;
import com.chimba.repository.DocumentItemRepository;
import com.chimba.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentItemRepository documentItemRepository;
    private final CargoFileRepository cargoFileRepository;
    private final ClientRepository clientRepository;
    private final PaymentRepository paymentRepository;

    public DocumentService(
            DocumentRepository documentRepository,
            DocumentItemRepository documentItemRepository,
            CargoFileRepository cargoFileRepository,
            ClientRepository clientRepository,
            PaymentRepository paymentRepository
    ) {
        this.documentRepository = documentRepository;
        this.documentItemRepository = documentItemRepository;
        this.cargoFileRepository = cargoFileRepository;
        this.clientRepository = clientRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<DocumentDto> filterDocuments(
            String dateFrom, String dateTo, String docType, String clientName, String sort
    ) {
        LocalDate df = dateFrom != null && !dateFrom.trim().isEmpty() ? LocalDate.parse(dateFrom.trim()) : null;
        LocalDate dt = dateTo != null && !dateTo.trim().isEmpty() ? LocalDate.parse(dateTo.trim()) : null;
        String type = docType != null && !docType.trim().isEmpty() ? docType.trim() : null;
        String cn = clientName != null && !clientName.trim().isEmpty() ? clientName.trim() : null;

        List<Document> docs = documentRepository.filterDocuments(df, dt, type, cn, null, null);

        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "doc_no":
                    docs.sort(Comparator.comparing(Document::getDocumentNumber, Comparator.nullsLast(String::compareTo)));
                    break;
                case "type":
                    docs.sort(Comparator.comparing(Document::getDocumentType, Comparator.nullsLast(String::compareTo)));
                    break;
                case "file_id":
                    docs.sort(Comparator.comparing(d -> d.getCargoFile() != null ? d.getCargoFile().getFileId() : "", String::compareTo));
                    break;
                case "client":
                    docs.sort(Comparator.comparing(d -> d.getClient() != null ? d.getClient().getName() : "", String::compareTo));
                    break;
                case "date":
                    docs.sort(Comparator.comparing(Document::getFileDate, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                case "total":
                case "highest":
                    docs.sort(Comparator.comparing(Document::getTotal, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                case "lowest":
                    docs.sort(Comparator.comparing(Document::getTotal, Comparator.nullsLast(Comparator.naturalOrder())));
                    break;
                case "oldest":
                    docs.sort(Comparator.comparing(Document::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())));
                    break;
                case "newest":
                default:
                    docs.sort(Comparator.comparing(Document::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
            }
        } else {
            docs.sort(Comparator.comparing(Document::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        }

        return docs.stream().map(this::toDto).collect(Collectors.toList());
    }

    public DocumentDto getDocumentById(Integer id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        DocumentDto dto = toDto(doc);
        List<DocumentItem> items = documentItemRepository.findByDocumentId(id);
        dto.setItems(items.stream()
                .map(i -> new DocumentDto.ItemDto(i.getId(), i.getItemName(), i.getQty(), i.getUnitPrice(), i.getLineTotal()))
                .collect(Collectors.toList()));
        return dto;
    }

    @Transactional
    public DocumentDto createDocument(DocumentCreateRequest request) {
        if (request.getDocumentType() == null || request.getDocumentType().isEmpty()) {
            throw new RuntimeException("Document Type is required!");
        }
        if (request.getFileId() == null || request.getFileCode() == null || request.getFileCode().isEmpty()) {
            throw new RuntimeException("File is required!");
        }
        if (request.getClientId() == null) {
            throw new RuntimeException("Client is required!");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("No items provided!");
        }

        CargoFile cargoFile = cargoFileRepository.findById(request.getFileId())
                .orElseThrow(() -> new RuntimeException("File not found with id: " + request.getFileId()));

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + request.getClientId()));

        String documentNumber;
        String docTypeInput = request.getDocumentType().equalsIgnoreCase("Invoice") ? "invoice" : "debit_note";

        if (docTypeInput.equals("invoice")) {
            documentNumber = "CLL/" + request.getFileCode();
        } else {
            String baseNumber = "DN/23" + request.getFileCode();
            documentNumber = baseNumber;
            int counter = 0;
            while (documentRepository.existsByDocumentNumber(documentNumber)) {
                counter++;
                char suffix = (char) (65 + counter);
                documentNumber = baseNumber + suffix;
            }
        }

        Document document = new Document();
        document.setDocumentType(docTypeInput);
        document.setDocumentNumber(documentNumber);
        document.setCargoFile(cargoFile);
        document.setFileCode(request.getFileCode());
        document.setClient(client);
        document.setTransportType(request.getTransportType());

        if (request.getFileDate() != null && !request.getFileDate().isEmpty()) {
            document.setFileDate(LocalDate.parse(request.getFileDate()));
        } else {
            document.setFileDate(cargoFile.getFileDate());
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<DocumentItem> validItems = new ArrayList<>();

        for (DocumentCreateRequest.ItemInput itemInput : request.getItems()) {
            BigDecimal qty = itemInput.getQty() != null ? itemInput.getQty() : BigDecimal.ZERO;
            BigDecimal price = itemInput.getUnitPrice() != null ? itemInput.getUnitPrice() : BigDecimal.ZERO;

            if (qty.compareTo(BigDecimal.ZERO) <= 0 || price.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            BigDecimal lineTotal = qty.multiply(price);
            totalAmount = totalAmount.add(lineTotal);

            DocumentItem item = new DocumentItem();
            item.setDocument(document);
            item.setItemName(itemInput.getItemName());
            item.setQty(qty);
            item.setUnitPrice(price);
            item.setLineTotal(lineTotal);
            validItems.add(item);
        }

        if (validItems.isEmpty()) {
            throw new RuntimeException("No valid non-zero items to save!");
        }

        document.setSubtotal(totalAmount);
        document.setVat(BigDecimal.ZERO);
        document.setTotal(totalAmount);
        document.setPaidAmount(BigDecimal.ZERO);
        document.setItems(validItems);

        Document saved = documentRepository.save(document);
        return getDocumentById(saved.getId());
    }

    public DocumentDto toDto(Document doc) {
        DocumentDto dto = new DocumentDto();
        dto.setId(doc.getId());
        dto.setDocumentNumber(doc.getDocumentNumber());
        dto.setFileCode(doc.getFileCode());
        dto.setFileDate(doc.getFileDate());
        dto.setDocumentType(doc.getDocumentType());
        dto.setTransportType(doc.getTransportType());
        dto.setSubtotal(doc.getSubtotal());
        dto.setVat(doc.getVat());
        BigDecimal docTotal = doc.getTotal() != null ? doc.getTotal() : BigDecimal.ZERO;
        dto.setTotal(docTotal);
        dto.setCreatedAt(doc.getCreatedAt());

        // Calculate document-specific payments from Payments table
        BigDecimal paidSum = paymentRepository.sumPaidAmountByDocumentId(doc.getId());
        if (paidSum == null) paidSum = BigDecimal.ZERO;
        dto.setPaidAmount(paidSum);

        BigDecimal balance = docTotal.subtract(paidSum);
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            balance = BigDecimal.ZERO;
        }
        dto.setBalance(balance);

        if (paidSum.compareTo(BigDecimal.ZERO) == 0) {
            dto.setStatus("UNPAID");
        } else if (paidSum.compareTo(docTotal) >= 0) {
            dto.setStatus("PAID");
        } else {
            dto.setStatus("PARTIALLY_PAID");
        }

        List<Payment> paymentEntities = paymentRepository.findByDocumentIdOrderByPaymentDateDesc(doc.getId());
        dto.setPaymentsCount(paymentEntities.size());
        List<PaymentDto> history = paymentEntities.stream().map(p -> {
            PaymentDto pd = new PaymentDto();
            pd.setId(p.getId());
            pd.setFileId(p.getFileId());
            pd.setDocumentId(p.getDocument().getId());
            pd.setDocumentNumber(doc.getDocumentNumber());
            pd.setDocumentType(doc.getDocumentType());
            pd.setAmount(p.getAmount());
            pd.setMethod(p.getMethod());
            pd.setPaymentReference(p.getPaymentReference());
            pd.setPaymentDate(p.getPaymentDate());
            pd.setCreatedAt(p.getCreatedAt());
            return pd;
        }).collect(Collectors.toList());
        dto.setPaymentHistory(history);

        if (doc.getCargoFile() != null) {
            dto.setFileId(doc.getCargoFile().getId());
            dto.setJobNumber(doc.getCargoFile().getJobNumber());
            dto.setAwbBl(doc.getCargoFile().getAwbBl());
            dto.setReference(doc.getCargoFile().getReference());
            dto.setDescription(doc.getCargoFile().getDescription());
            dto.setVessel(doc.getCargoFile().getVessel());
            dto.setPlaceOfLoading(doc.getCargoFile().getPlaceOfLoading());
            dto.setSupplierName(doc.getCargoFile().getSupplierName());
            if (dto.getFileCode() == null || dto.getFileCode().isEmpty()) {
                dto.setFileCode(doc.getCargoFile().getFileId());
            }
        }
        if (dto.getFileCode() == null) {
            dto.setFileCode("N/A");
        }

        if (doc.getClient() != null) {
            dto.setClientId(doc.getClient().getId());
            dto.setClientName(doc.getClient().getName() != null ? doc.getClient().getName() : "General Client");
            dto.setClientAddress(doc.getClient().getAddress());
            dto.setClientCity(doc.getClient().getCity());
            dto.setClientEmail(doc.getClient().getEmail());
            dto.setClientTin(doc.getClient().getTin());
        } else {
            dto.setClientName("General Client");
        }

        return dto;
    }
}
