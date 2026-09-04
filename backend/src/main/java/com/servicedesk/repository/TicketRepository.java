package com.servicedesk.repository;

import com.servicedesk.entity.Ticket;
import com.servicedesk.entity.TicketCategory;
import com.servicedesk.entity.TicketPriority;
import com.servicedesk.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Ticket> {

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByPriority(TicketPriority priority);

    List<Ticket> findByCategory(TicketCategory category);

    List<Ticket> findByAssignedAgentId(Long agentId);

    long countByStatus(TicketStatus status);

    @Query("SELECT t FROM Ticket t ORDER BY t.createdAt DESC")
    List<Ticket> findRecentTickets(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT t.status as key, COUNT(t) as value FROM Ticket t GROUP BY t.status")
    List<Object[]> countGroupedByStatus();

    @Query("SELECT t.priority as key, COUNT(t) as value FROM Ticket t GROUP BY t.priority")
    List<Object[]> countGroupedByPriority();

    @Query("SELECT t.category as key, COUNT(t) as value FROM Ticket t GROUP BY t.category")
    List<Object[]> countGroupedByCategory();

    @Query("SELECT COALESCE(u.name, 'Unassigned') as key, COUNT(t) as value FROM Ticket t LEFT JOIN t.assignedAgent u GROUP BY u.name")
    List<Object[]> countGroupedByAgent();
}
