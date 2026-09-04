package com.servicedesk.service;

import com.servicedesk.dto.ReportDTO;
import com.servicedesk.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final TicketRepository ticketRepository;

    public ReportService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public ReportDTO getReport() {
        long total = ticketRepository.count();
        Map<String, Long> byStatus = groupToMap(ticketRepository.countGroupedByStatus());
        Map<String, Long> byPriority = groupToMap(ticketRepository.countGroupedByPriority());
        Map<String, Long> byCategory = groupToMap(ticketRepository.countGroupedByCategory());
        Map<String, Long> byAgent = groupToMap(ticketRepository.countGroupedByAgent());

        return new ReportDTO(total, byStatus, byPriority, byCategory, byAgent);
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
}
