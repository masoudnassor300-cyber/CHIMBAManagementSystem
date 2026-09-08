package com.chimba.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalClients;
    private long totalFiles;
    private BigDecimal totalInvoices;
    private BigDecimal totalDebitNotes;
    private BigDecimal totalUnpaidBalance;
    private List<MonthlyTrendDto> monthlyTrends;
    private Map<String, Long> transportTypeBreakdown;
    private List<RecentActivityDto> recentActivities;

    public DashboardStatsDto() {}

    public long getTotalClients() { return totalClients; }
    public void setTotalClients(long totalClients) { this.totalClients = totalClients; }

    public long getTotalFiles() { return totalFiles; }
    public void setTotalFiles(long totalFiles) { this.totalFiles = totalFiles; }

    public BigDecimal getTotalInvoices() { return totalInvoices; }
    public void setTotalInvoices(BigDecimal totalInvoices) { this.totalInvoices = totalInvoices; }

    public BigDecimal getTotalDebitNotes() { return totalDebitNotes; }
    public void setTotalDebitNotes(BigDecimal totalDebitNotes) { this.totalDebitNotes = totalDebitNotes; }

    public BigDecimal getTotalUnpaidBalance() { return totalUnpaidBalance; }
    public void setTotalUnpaidBalance(BigDecimal totalUnpaidBalance) { this.totalUnpaidBalance = totalUnpaidBalance; }

    public List<MonthlyTrendDto> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyTrendDto> monthlyTrends) { this.monthlyTrends = monthlyTrends; }

    public Map<String, Long> getTransportTypeBreakdown() { return transportTypeBreakdown; }
    public void setTransportTypeBreakdown(Map<String, Long> transportTypeBreakdown) { this.transportTypeBreakdown = transportTypeBreakdown; }

    public List<RecentActivityDto> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<RecentActivityDto> recentActivities) { this.recentActivities = recentActivities; }

    public static class MonthlyTrendDto {
        private String month;
        private BigDecimal invoices;
        private BigDecimal debitNotes;

        public MonthlyTrendDto(String month, BigDecimal invoices, BigDecimal debitNotes) {
            this.month = month;
            this.invoices = invoices;
            this.debitNotes = debitNotes;
        }

        public String getMonth() { return month; }
        public BigDecimal getInvoices() { return invoices; }
        public BigDecimal getDebitNotes() { return debitNotes; }
    }

    public static class RecentActivityDto {
        private String title;
        private String subtitle;
        private String type; // 'client', 'file', 'document', 'payment'
        private String timestamp;

        public RecentActivityDto(String title, String subtitle, String type, String timestamp) {
            this.title = title;
            this.subtitle = subtitle;
            this.type = type;
            this.timestamp = timestamp;
        }

        public String getTitle() { return title; }
        public String getSubtitle() { return subtitle; }
        public String getType() { return type; }
        public String getTimestamp() { return timestamp; }
    }
}
