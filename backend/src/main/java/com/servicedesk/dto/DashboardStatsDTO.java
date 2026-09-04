package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long pendingTickets;
    private long resolvedTickets;
    private long closedTickets;
    private Map<String, Long> ticketsByStatus;
    private Map<String, Long> ticketsByPriority;
    private Map<String, Long> ticketsByCategory;
    private List<TicketDTO> recentTickets;
}
