package com.chimba.controller;

import com.chimba.dto.DocumentDto;
import com.chimba.dto.PaymentRequest;
import com.chimba.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/mark-paid")
    public ResponseEntity<?> markPaid(@RequestBody PaymentRequest request) {
        try {
            DocumentDto updated = paymentService.markPayment(request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
