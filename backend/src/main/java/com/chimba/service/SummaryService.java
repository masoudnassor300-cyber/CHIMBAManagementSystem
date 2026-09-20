package com.chimba.service;

import com.chimba.dto.ItemDetailDto;
import com.chimba.dto.ItemSummaryDto;
import com.chimba.model.Document;
import com.chimba.repository.DocumentItemRepository;
import com.chimba.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SummaryService {

    private final DocumentRepository documentRepository;
    private final DocumentItemRepository documentItemRepository;
    private final com.chimba.repository.PaymentRepository paymentRepository;

    public SummaryService(
            DocumentRepository documentRepository,
            DocumentItemRepository documentItemRepository,
            com.chimba.repository.PaymentRepository paymentRepository
    ) {
        this.documentRepository = documentRepository;
        this.documentItemRepository = documentItemRepository;
        this.paymentRepository = paymentRepository;
    }

    public Map<String, Object> getFinancialSummary(
            String from, String to, Integer clientId, String type, String fileNo
    ) {
        LocalDate df = from != null && !from.isEmpty() ? LocalDate.parse(from) : null;
        LocalDate dt = to != null && !to.isEmpty() ? LocalDate.parse(to) : null;
        String t = type != null && !type.isEmpty() ? type.trim() : null;
        String fn = fileNo != null && !fileNo.isEmpty() ? fileNo.trim() : null;

        List<Document> filteredDocs = documentRepository.filterDocuments(df, dt, t, null, clientId, fn);

        long invoiceCount = filteredDocs.stream().filter(d -> d.getDocumentType().equalsIgnoreCase("invoice")).count();
        BigDecimal invoiceTotal = filteredDocs.stream()
                .filter(d -> d.getDocumentType().equalsIgnoreCase("invoice"))
                .map(Document::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long debitCount = filteredDocs.stream().filter(d -> d.getDocumentType().toLowerCase().contains("debit")).count();
        BigDecimal debitTotal = filteredDocs.stream()
                .filter(d -> d.getDocumentType().toLowerCase().contains("debit"))
                .map(Document::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal overpaymentTotal = BigDecimal.ZERO;
        for (Document doc : filteredDocs) {
            BigDecimal paidSum = paymentRepository.sumPaidAmountByDocumentId(doc.getId());
            if (paidSum != null) {
                BigDecimal docTotal = doc.getTotal() != null ? doc.getTotal() : BigDecimal.ZERO;
                BigDecimal diff = paidSum.subtract(docTotal);
                if (diff.compareTo(BigDecimal.ZERO) > 0) {
                    overpaymentTotal = overpaymentTotal.add(diff);
                }
            }
        }

        Map<String, Object> kpis = new HashMap<>();
        kpis.put("invoiceCount", invoiceCount);
        kpis.put("invoiceTotal", invoiceTotal);
        kpis.put("debitCount", debitCount);
        kpis.put("debitTotal", debitTotal);
        kpis.put("overpaymentTotal", overpaymentTotal);

        List<Object[]> rawItems = documentItemRepository.getItemSummaries(df, dt, clientId, t, fn);
        List<ItemSummaryDto> itemSummaries = new ArrayList<>();

        for (Object[] row : rawItems) {
            String itemName = (String) row[0];
            BigDecimal invSum = row[1] != null ? (BigDecimal) row[1] : BigDecimal.ZERO;
            BigDecimal debSum = row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO;
            String itemId = itemName.replaceAll("[^a-zA-Z0-9]", "");

            ItemSummaryDto itemDto = new ItemSummaryDto(itemName, itemId, invSum, debSum);

            List<Object[]> rawDetails = documentItemRepository.getItemDetails(itemName, df, dt, clientId, t, fn);
            List<ItemDetailDto> details = new ArrayList<>();
            for (Object[] det : rawDetails) {
                details.add(new ItemDetailDto(
                        (String) det[0],
                        (String) det[1],
                        (String) det[2],
                        det[3] != null ? (BigDecimal) det[3] : BigDecimal.ZERO
                ));
            }
            itemDto.setDetails(details);
            itemSummaries.add(itemDto);
        }

        return Map.of(
                "kpi", kpis,
                "items", itemSummaries
        );
    }
}
