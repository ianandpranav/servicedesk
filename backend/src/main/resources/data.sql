-- Sample Users
INSERT INTO users (name, email, department, role) VALUES
('John Doe', 'john.doe@company.com', 'IT', 'Employee'),
('Jane Smith', 'jane.smith@company.com', 'HR', 'Employee'),
('Mike Johnson', 'mike.johnson@company.com', 'Finance', 'Employee'),
('Sarah Williams', 'sarah.williams@company.com', 'IT', 'Manager'),
('David Brown', 'david.brown@company.com', 'Sales', 'Employee');

-- Sample Tickets
INSERT INTO tickets (title, description, priority, status, category, user_id, created_at, updated_at) VALUES
('Laptop not connecting to WiFi', 'Unable to connect to office WiFi network', 'HIGH', 'OPEN', 'NETWORK', 1, NOW(), NOW()),
('Email not syncing', 'Outlook email is not syncing with server', 'MEDIUM', 'IN_PROGRESS', 'EMAIL', 2, NOW(), NOW()),
('Software installation request', 'Need installation of Adobe Creative Cloud', 'LOW', 'OPEN', 'SOFTWARE', 3, NOW(), NOW()),
('VPN connection issue', 'VPN disconnects frequently', 'HIGH', 'RESOLVED', 'NETWORK', 4, NOW(), NOW()),
('Printer not working', 'Office printer is showing an error', 'MEDIUM', 'OPEN', 'HARDWARE', 5, NOW(), NOW());

-- Sample Comments
INSERT INTO comments (ticket_id, comment, created_at) VALUES
(1, 'Checking the network configuration.', NOW()),
(2, 'Email server connection is being investigated.', NOW()),
(3, 'Software installation request received.', NOW()),
(4, 'VPN configuration has been updated.', NOW()),
(5, 'Printer driver will be reinstalled.', NOW());
