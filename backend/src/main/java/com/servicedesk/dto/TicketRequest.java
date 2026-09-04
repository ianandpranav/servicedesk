package com.servicedesk.dto;

import com.servicedesk.entity.TicketCategory;
import com.servicedesk.entity.TicketPriority;
import com.servicedesk.entity.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    private TicketStatus status;

    @NotNull(message = "Requester is required")
    private Long requesterId;

    private Long assignedAgentId;
}
