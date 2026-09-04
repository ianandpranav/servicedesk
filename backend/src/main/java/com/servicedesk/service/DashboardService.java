package com.servicedesk.service;

import com.servicedesk.dto.DashboardStatsDTO;
import com.servicedesk.dto.TicketDTO;
import com.servicedesk.entity.Ticket;
import com.servicedesk.entity.TicketStatus;
import com.servicedesk.repository.TicketRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;

    public DashboardService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public DashboardStatsDTO getStats() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgress = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long pending = ticketRepository.countByStatus(TicketStatus.PENDING);
        long resolved = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closed = ticketRepository.countByStatus(TicketStatus.CLOSED);

        Map<String, Long> byStatus = groupToMap(ticketRepository.countGroupedByStatus());
        Map<String, Long> byPriority = groupToMap(ticketRepository.countGroupedByPriority());
        Map<String, Long> byCategory = groupToMap(ticketRepository.countGroupedByCategory());

        List<TicketDTO> recent = ticketRepository
                .findRecentTickets(PageRequest.of(0, 5))
                .stream().map(this::toDTO).toList();

        return new DashboardStatsDTO(total, open, inProgress, pending, resolved, closed,
                byStatus, byPriority, byCategory, recent);
    }

    private Map<String, Long> groupToMap(List<Object[]> rows) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String key = row[0] != null ? row[0].toString() : "UNKNOWN";
            Long value = (Long) row[1];
            map.put(key, value);
        }
        return map;
    }

    private TicketDTO toDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setCategory(ticket.getCategory());
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus());
        if (ticket.getRequester() != null) {
            dto.setRequesterId(ticket.getRequester().getId());
            dto.setRequesterName(ticket.getRequester().getName());
        }
        if (ticket.getAssignedAgent() != null) {
            dto.setAssignedAgentId(ticket.getAssignedAgent().getId());
            dto.setAssignedAgentName(ticket.getAssignedAgent().getName());
        }
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());
        return dto;
    }
}
