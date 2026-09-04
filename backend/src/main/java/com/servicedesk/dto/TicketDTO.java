package com.servicedesk.dto;

import com.servicedesk.entity.TicketCategory;
import com.servicedesk.entity.TicketPriority;
import com.servicedesk.entity.TicketStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TicketDTO {
    private Long id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;

    private Long requesterId;
    private String requesterName;

    private Long assignedAgentId;
    private String assignedAgentName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
