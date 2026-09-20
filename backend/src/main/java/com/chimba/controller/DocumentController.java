package com.chimba.controller;

import com.chimba.dto.DocumentCreateRequest;
import com.chimba.dto.DocumentDto;
import com.chimba.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentDto>> getDocuments(
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String documentType,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(documentService.filterDocuments(dateFrom, dateTo, documentType, clientName, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDto> getDocumentById(@PathVariable Integer id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDocument(@RequestBody DocumentCreateRequest request) {
        try {
            DocumentDto created = documentService.createDocument(request);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable Integer id, @RequestBody DocumentCreateRequest request) {
        try {
            DocumentDto updated = documentService.updateDocument(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
