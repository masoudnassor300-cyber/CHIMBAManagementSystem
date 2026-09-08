package com.chimba.service;

import com.chimba.dto.DashboardStatsDto;
import com.chimba.model.CargoFile;
import com.chimba.model.Client;
import com.chimba.model.Document;
import com.chimba.repository.CargoFileRepository;
import com.chimba.repository.ClientRepository;
import com.chimba.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ClientRepository clientRepository;
    private final CargoFileRepository cargoFileRepository;
    private final DocumentRepository documentRepository;

    public DashboardService(
            ClientRepository clientRepository,
            CargoFileRepository cargoFileRepository,
            DocumentRepository documentRepository
    ) {
        this.clientRepository = clientRepository;
        this.cargoFileRepository = cargoFileRepository;
        this.documentRepository = documentRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto dto = new DashboardStatsDto();

        dto.setTotalClients(clientRepository.count());
        dto.setTotalFiles(cargoFileRepository.count());

        BigDecimal invTotal = documentRepository.sumInvoiceTotals();
        BigDecimal debTotal = documentRepository.sumDebitNoteTotals();
        BigDecimal leftTotal = documentRepository.sumTotalLeftToCollect();

        dto.setTotalInvoices(invTotal != null ? invTotal : BigDecimal.ZERO);
        dto.setTotalDebitNotes(debTotal != null ? debTotal : BigDecimal.ZERO);
        dto.setTotalUnpaidBalance(leftTotal != null ? leftTotal : BigDecimal.ZERO);

        // Fetch documents for trend analysis & transport breakdown
        List<Document> docs = documentRepository.findAllWithOrdering();

        Map<String, BigDecimal> monthlyInvoices = new LinkedHashMap<>();
        Map<String, BigDecimal> monthlyDebits = new LinkedHashMap<>();
        Map<String, Long> transportBreakdown = new HashMap<>();

        for (Document d : docs) {
            String monthKey = d.getFileDate() != null ? d.getFileDate().format(DateTimeFormatter.ofPattern("MMM yyyy")) : "Other";
            BigDecimal tot = d.getTotal() != null ? d.getTotal() : BigDecimal.ZERO;
            String type = d.getDocumentType() != null ? d.getDocumentType() : "";

            if (type.equalsIgnoreCase("invoice")) {
                monthlyInvoices.put(monthKey, monthlyInvoices.getOrDefault(monthKey, BigDecimal.ZERO).add(tot));
            } else {
                monthlyDebits.put(monthKey, monthlyDebits.getOrDefault(monthKey, BigDecimal.ZERO).add(tot));
            }

            String transport = d.getTransportType() != null && !d.getTransportType().isEmpty() ? d.getTransportType() : "Unspecified";
            transportBreakdown.put(transport, transportBreakdown.getOrDefault(transport, 0L) + 1);
        }

        Set<String> allMonths = new LinkedHashSet<>();
        allMonths.addAll(monthlyInvoices.keySet());
        allMonths.addAll(monthlyDebits.keySet());

        List<DashboardStatsDto.MonthlyTrendDto> trends = new ArrayList<>();
        for (String m : allMonths) {
            trends.add(new DashboardStatsDto.MonthlyTrendDto(
                    m,
                    monthlyInvoices.getOrDefault(m, BigDecimal.ZERO),
                    monthlyDebits.getOrDefault(m, BigDecimal.ZERO)
            ));
        }
        dto.setMonthlyTrends(trends);
        dto.setTransportTypeBreakdown(transportBreakdown);

        // Recent activities feed
        List<DashboardStatsDto.RecentActivityDto> activities = new ArrayList<>();

        List<Client> recentClients = clientRepository.findAllByOrderByCreatedAtDesc().stream().limit(3).collect(Collectors.toList());
        for (Client c : recentClients) {
            activities.add(new DashboardStatsDto.RecentActivityDto(
                    "New Client Registered",
                    c.getName() + " (" + c.getClientId() + ")",
                    "client",
                    c.getCreatedAt() != null ? c.getCreatedAt().toString() : ""
            ));
        }

        List<CargoFile> recentFiles = cargoFileRepository.findAll().stream()
                .sorted(Comparator.comparing(CargoFile::getId, Comparator.reverseOrder()))
                .limit(3).collect(Collectors.toList());

        for (CargoFile f : recentFiles) {
            activities.add(new DashboardStatsDto.RecentActivityDto(
                    "New Job File Opened",
                    "File #" + f.getFileId() + " - " + (f.getClient() != null ? f.getClient().getName() : ""),
                    "file",
                    f.getCreatedAt() != null ? f.getCreatedAt().toString() : ""
            ));
        }

        List<Document> recentDocs = docs.stream().limit(3).collect(Collectors.toList());
        for (Document d : recentDocs) {
            String docTypeStr = d.getDocumentType() != null ? d.getDocumentType().toUpperCase() : "DOCUMENT";
            activities.add(new DashboardStatsDto.RecentActivityDto(
                    "Document Issued: " + (d.getDocumentNumber() != null ? d.getDocumentNumber() : "N/A"),
                    docTypeStr + " • " + (d.getClient() != null ? d.getClient().getName() : "General Client") + " • TSH " + d.getTotal(),
                    "document",
                    d.getCreatedAt() != null ? d.getCreatedAt().toString() : ""
            ));
        }

        dto.setRecentActivities(activities);
        return dto;
    }
}
