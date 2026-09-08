package com.chimba.controller;

import com.chimba.service.SummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/summary")
public class SummaryController {

    private final SummaryService summaryService;

    public SummaryController(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSummary(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) Integer clientId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String fileNo
    ) {
        return ResponseEntity.ok(summaryService.getFinancialSummary(from, to, clientId, type, fileNo));
    }
}
