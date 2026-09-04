package com.servicedesk.service;

import com.servicedesk.dto.TicketDTO;
import com.servicedesk.dto.TicketRequest;
import com.servicedesk.entity.*;
import com.servicedesk.exception.ResourceNotFoundException;
import com.servicedesk.repository.TicketRepository;
import com.servicedesk.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream().map(this::toDTO).toList();
    }

    public TicketDTO getTicketById(Long id) {
        return toDTO(findTicketOrThrow(id));
    }

    public List<TicketDTO> searchAndFilter(String keyword, TicketStatus status, TicketPriority priority,
                                            TicketCategory category, Long agentId,
                                            LocalDate from, LocalDate to) {
        Specification<Ticket> spec = Specification
                .where(TicketSpecifications.hasKeyword(keyword))
                .and(TicketSpecifications.hasStatus(status))
                .and(TicketSpecifications.hasPriority(priority))
                .and(TicketSpecifications.hasCategory(category))
                .and(TicketSpecifications.hasAgent(agentId))
                .and(TicketSpecifications.createdAfter(from))
                .and(TicketSpecifications.createdBefore(to));

        return ticketRepository.findAll(spec).stream().map(this::toDTO).toList();
    }

    public TicketDTO createTicket(TicketRequest request) {
        Ticket ticket = new Ticket();
        applyRequest(ticket, request, true);
        return toDTO(ticketRepository.save(ticket));
    }

    public TicketDTO updateTicket(Long id, TicketRequest request) {
        Ticket ticket = findTicketOrThrow(id);
        applyRequest(ticket, request, false);
        return toDTO(ticketRepository.save(ticket));
    }

    public void deleteTicket(Long id) {
        Ticket ticket = findTicketOrThrow(id);
        ticketRepository.delete(ticket);
    }

    private void applyRequest(Ticket ticket, TicketRequest request, boolean isNew) {
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(request.getStatus() != null ? request.getStatus()
                : (isNew ? TicketStatus.OPEN : ticket.getStatus()));

        User requester = userRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Requester (user) not found with id: " + request.getRequesterId()));
        ticket.setRequester(requester);

        if (request.getAssignedAgentId() != null) {
            User agent = userRepository.findById(request.getAssignedAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Assigned agent (user) not found with id: " + request.getAssignedAgentId()));
            ticket.setAssignedAgent(agent);
        } else {
            ticket.setAssignedAgent(null);
        }
    }

    private Ticket findTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
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
