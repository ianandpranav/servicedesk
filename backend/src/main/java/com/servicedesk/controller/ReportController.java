package com.servicedesk.controller;

import com.servicedesk.dto.ReportDTO;
import com.servicedesk.service.ReportService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ReportDTO getReport() {
        return reportService.getReport();
    }

    @GetMapping("/export")
    public void exportCsv(HttpServletResponse response) throws IOException {
        ReportDTO report = reportService.getReport();

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=servicedesk_report.csv");

        PrintWriter writer = response.getWriter();
        writer.println("ServiceDesk Report");
        writer.println("Total Tickets," + report.getTotalTickets());
        writer.println();

        writer.println("Tickets by Status");
        writeMap(writer, report.getTicketsByStatus());
        writer.println();

        writer.println("Tickets by Priority");
        writeMap(writer, report.getTicketsByPriority());
        writer.println();

        writer.println("Tickets by Category");
        writeMap(writer, report.getTicketsByCategory());
        writer.println();

        writer.println("Tickets by Agent");
        writeMap(writer, report.getTicketsByAgent());

        writer.flush();
    }

    private void writeMap(PrintWriter writer, Map<String, Long> map) {
        for (Map.Entry<String, Long> entry : map.entrySet()) {
            writer.println(entry.getKey() + "," + entry.getValue());
        }
    }
}
