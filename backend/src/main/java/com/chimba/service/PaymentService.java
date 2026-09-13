package com.chimba.service;

import com.chimba.dto.DocumentDto;
import com.chimba.dto.PaymentDto;
import com.chimba.dto.PaymentRequest;
import com.chimba.model.Document;
import com.chimba.model.Payment;
import com.chimba.repository.DocumentRepository;
import com.chimba.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final DocumentRepository documentRepository;
    private final PaymentRepository paymentRepository;
    private final DocumentService documentService;

    public PaymentService(
            DocumentRepository documentRepository,
            PaymentRepository paymentRepository,
            DocumentService documentService
    ) {
        this.documentRepository = documentRepository;
        this.paymentRepository = paymentRepository;
        this.documentService = documentService;
    }

    public Map<String, Object> getPaymentsData() {
        List<Document> docs = documentRepository.findAllWithOrdering();
        List<DocumentDto> docDtos = docs.stream().map(documentService::toDto).collect(Collectors.toList());

        BigDecimal totalInvoices = BigDecimal.ZERO;
        BigDecimal totalDebitNotes = BigDecimal.ZERO;
        BigDecimal totalCollected = BigDecimal.ZERO;
        BigDecimal totalOutstanding = BigDecimal.ZERO;

        for (DocumentDto d : docDtos) {
            BigDecimal total = d.getTotal() != null ? d.getTotal() : BigDecimal.ZERO;
            BigDecimal paid = d.getPaidAmount() != null ? d.getPaidAmount() : BigDecimal.ZERO;
            BigDecimal bal = d.getBalance() != null ? d.getBalance() : BigDecimal.ZERO;

            if (d.getDocumentType() != null && d.getDocumentType().equalsIgnoreCase("invoice")) {
                totalInvoices = totalInvoices.add(total);
            } else {
                totalDebitNotes = totalDebitNotes.add(total);
            }

            totalCollected = totalCollected.add(paid);
            totalOutstanding = totalOutstanding.add(bal);
        }

        List<Payment> recentPayments = paymentRepository.findAllByOrderByCreatedAtDesc();
        List<PaymentDto> recentDtos = recentPayments.stream().limit(10).map(p -> {
            PaymentDto pd = new PaymentDto();
            pd.setId(p.getId());
            pd.setFileId(p.getFileId());
            pd.setDocumentId(p.getDocument().getId());
            pd.setDocumentNumber(p.getDocument().getDocumentNumber());
            pd.setDocumentType(p.getDocument().getDocumentType());
            pd.setClientName(p.getDocument().getClient() != null ? p.getDocument().getClient().getName() : "General Client");
            pd.setAmount(p.getAmount());
            pd.setMethod(p.getMethod());
            pd.setPaymentReference(p.getPaymentReference());
            pd.setPaymentDate(p.getPaymentDate());
            pd.setCreatedAt(p.getCreatedAt());
            return pd;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("totalLeftToCollect", totalOutstanding);
        response.put("totalInvoicesValue", totalInvoices);
        response.put("totalDebitNotesValue", totalDebitNotes);
        response.put("totalCollectedValue", totalCollected);
        response.put("documents", docDtos);
        response.put("recentPayments", recentDtos);

        return response;
    }

    public List<PaymentDto> getPaymentHistory(Integer documentId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));

        List<Payment> payments = paymentRepository.findByDocumentIdOrderByPaymentDateDesc(documentId);
        return payments.stream().map(p -> {
            PaymentDto pd = new PaymentDto();
            pd.setId(p.getId());
            pd.setFileId(p.getFileId());
            pd.setDocumentId(doc.getId());
            pd.setDocumentNumber(doc.getDocumentNumber());
            pd.setDocumentType(doc.getDocumentType());
            pd.setClientName(doc.getClient() != null ? doc.getClient().getName() : "General Client");
            pd.setAmount(p.getAmount());
            pd.setMethod(p.getMethod());
            pd.setPaymentReference(p.getPaymentReference());
            pd.setPaymentDate(p.getPaymentDate());
            pd.setCreatedAt(p.getCreatedAt());
            return pd;
        }).collect(Collectors.toList());
    }

    @Transactional
    public DocumentDto recordPayment(PaymentRequest request) {
        if (request.getDocumentId() == null) {
            throw new RuntimeException("Document ID is required!");
        }
        if (request.getPaidAmount() == null || request.getPaidAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Paid amount must be greater than zero!");
        }

        Document doc = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + request.getDocumentId()));

        BigDecimal currentPaid = paymentRepository.sumPaidAmountByDocumentId(doc.getId());
        if (currentPaid == null) currentPaid = BigDecimal.ZERO;

        BigDecimal docTotal = doc.getTotal() != null ? doc.getTotal() : BigDecimal.ZERO;
        BigDecimal currentBalance = docTotal.subtract(currentPaid);
        if (currentBalance.compareTo(BigDecimal.ZERO) < 0) {
            currentBalance = BigDecimal.ZERO;
        }

        if (request.getPaidAmount().compareTo(currentBalance) > 0) {
            throw new RuntimeException("Payment amount (TSH " + request.getPaidAmount() + 
                    ") exceeds remaining balance (TSH " + currentBalance + ")!");
        }

        Payment payment = new Payment();
        payment.setDocument(doc);
        payment.setFileId(doc.getCargoFile() != null ? doc.getCargoFile().getId() : 0);
        payment.setAmount(request.getPaidAmount());
        payment.setMethod(request.getMethod() != null && !request.getMethod().isEmpty() ? request.getMethod() : "Cash");
        payment.setPaymentReference(request.getPaymentReference());

        if (request.getPaymentDate() != null && !request.getPaymentDate().trim().isEmpty()) {
            payment.setPaymentDate(LocalDate.parse(request.getPaymentDate().trim()));
        } else {
            payment.setPaymentDate(LocalDate.now());
        }

        paymentRepository.save(payment);
        return documentService.toDto(doc);
    }
}
