package com.servicedesk.service;

import com.servicedesk.entity.Ticket;
import com.servicedesk.entity.TicketCategory;
import com.servicedesk.entity.TicketPriority;
import com.servicedesk.entity.TicketStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TicketSpecifications {

    public static Specification<Ticket> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return cb.conjunction();
            String like = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("description")), like),
                    cb.like(cb.lower(root.join("requester").get("name")), like)
            );
        };
    }

    public static Specification<Ticket> hasStatus(TicketStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Ticket> hasPriority(TicketPriority priority) {
        return (root, query, cb) -> priority == null ? cb.conjunction() : cb.equal(root.get("priority"), priority);
    }

    public static Specification<Ticket> hasCategory(TicketCategory category) {
        return (root, query, cb) -> category == null ? cb.conjunction() : cb.equal(root.get("category"), category);
    }

    public static Specification<Ticket> hasAgent(Long agentId) {
        return (root, query, cb) -> agentId == null ? cb.conjunction() : cb.equal(root.join("assignedAgent").get("id"), agentId);
    }

    public static Specification<Ticket> createdAfter(LocalDate date) {
        return (root, query, cb) -> date == null ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("createdAt"), date.atStartOfDay());
    }

    public static Specification<Ticket> createdBefore(LocalDate date) {
        return (root, query, cb) -> date == null ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("createdAt"), date.atTime(23, 59, 59));
    }
}
