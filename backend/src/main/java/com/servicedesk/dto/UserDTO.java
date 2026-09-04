package com.servicedesk.dto;

import com.servicedesk.entity.UserRole;
import com.servicedesk.entity.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
