package com.servicedesk.service;

import com.servicedesk.dto.UserDTO;
import com.servicedesk.dto.UserRequest;
import com.servicedesk.entity.User;
import com.servicedesk.entity.UserStatus;
import com.servicedesk.exception.ResourceNotFoundException;
import com.servicedesk.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    public UserDTO getUserById(Long id) {
        return toDTO(findUserOrThrow(id));
    }

    public List<UserDTO> searchUsers(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllUsers();
        }
        return userRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword)
                .stream().map(this::toDTO).toList();
    }

    public List<UserDTO> getAgents() {
        return userRepository.findByRole(com.servicedesk.entity.UserRole.SUPPORT_AGENT)
                .stream().map(this::toDTO).toList();
    }

    public UserDTO createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("A user with this email already exists");
        }
        User user = new User();
        applyRequest(user, request);
        return toDTO(userRepository.save(user));
    }

    public UserDTO updateUser(Long id, UserRequest request) {
        User user = findUserOrThrow(id);
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("A user with this email already exists");
        }
        applyRequest(user, request);
        return toDTO(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = findUserOrThrow(id);
        userRepository.delete(user);
    }

    private void applyRequest(User user, UserRequest request) {
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setRole(request.getRole());
        user.setStatus(request.getStatus() != null ? request.getStatus() : UserStatus.ACTIVE);
    }

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setDepartment(user.getDepartment());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
