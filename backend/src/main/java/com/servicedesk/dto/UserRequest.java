package com.servicedesk.dto;

import com.servicedesk.entity.UserRole;
import com.servicedesk.entity.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    private String phone;

    private String department;

    @NotNull(message = "Role is required")
    private UserRole role;

    private UserStatus status;
}
