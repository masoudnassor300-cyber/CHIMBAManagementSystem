package com.chimba.service;

import com.chimba.dto.DocumentDto;
import com.chimba.dto.PaymentRequest;
import com.chimba.model.Document;
import com.chimba.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final DocumentRepository documentRepository;
    private final DocumentService documentService;

    public PaymentService(DocumentRepository documentRepository, DocumentService documentService) {
        this.documentRepository = documentRepository;
        this.documentService = documentService;
    }

    public Map<String, Object> getPaymentsData() {
        List<Document> docs = documentRepository.findAllWithOrdering();
        BigDecimal totalLeft = documentRepository.sumTotalLeftToCollect();

        List<DocumentDto> docDtos = docs.stream().map(documentService::toDto).collect(Collectors.toList());

        return Map.of(
                "totalLeftToCollect", totalLeft != null ? totalLeft : BigDecimal.ZERO,
                "documents", docDtos
        );
    }

    @Transactional
    public DocumentDto markPayment(PaymentRequest request) {
        if (request.getDocumentId() == null) {
            throw new RuntimeException("Document ID is required!");
        }
        if (request.getPaidAmount() == null || request.getPaidAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Paid amount must be greater than zero!");
        }

        Document doc = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + request.getDocumentId()));

        BigDecimal currentPaid = doc.getPaidAmount() != null ? doc.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal newPaid = currentPaid.add(request.getPaidAmount());

        if (newPaid.compareTo(doc.getTotal()) > 0) {
            throw new RuntimeException("Paid amount exceeds the remaining balance!");
        }

        doc.setPaidAmount(newPaid);
        Document saved = documentRepository.save(doc);
        return documentService.toDto(saved);
    }
}
