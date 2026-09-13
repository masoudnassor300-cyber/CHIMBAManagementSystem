package com.chimba.controller;

import com.chimba.dto.DocumentDto;
import com.chimba.dto.PaymentDto;
import com.chimba.dto.PaymentRequest;
import com.chimba.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getPayments() {
        return ResponseEntity.ok(paymentService.getPaymentsData());
    }

    @GetMapping("/history/{documentId}")
    public ResponseEntity<List<PaymentDto>> getPaymentHistory(@PathVariable Integer documentId) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(documentId));
    }

    @PostMapping("/record")
    public ResponseEntity<?> recordPayment(@RequestBody PaymentRequest request) {
        try {
            DocumentDto updated = paymentService.recordPayment(request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/mark-paid")
    public ResponseEntity<?> markPaid(@RequestBody PaymentRequest request) {
        try {
            DocumentDto updated = paymentService.recordPayment(request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
