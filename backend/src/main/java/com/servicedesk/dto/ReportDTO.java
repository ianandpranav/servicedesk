package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class ReportDTO {
    private long totalTickets;
    private Map<String, Long> ticketsByStatus;
    private Map<String, Long> ticketsByPriority;
    private Map<String, Long> ticketsByCategory;
    private Map<String, Long> ticketsByAgent;
}
