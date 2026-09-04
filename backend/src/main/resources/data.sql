-- Sample data for ServiceDesk (only inserts if tables are empty)

INSERT INTO users (name, email, phone, department, role, status, created_at, updated_at)
SELECT * FROM (SELECT 'Anand Pranav' AS name, 'anand.admin@servicedesk.local' AS email, '9876500001' AS phone, 'IT Administration' AS department, 'ADMIN' AS role, 'ACTIVE' AS status, NOW() AS created_at, NOW() AS updated_at) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'anand.admin@servicedesk.local') LIMIT 1;

INSERT INTO users (name, email, phone, department, role, status, created_at, updated_at)
SELECT * FROM (SELECT 'Riya Sharma', 'riya.agent@servicedesk.local', '9876500002', 'IT Support', 'SUPPORT_AGENT', 'ACTIVE', NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'riya.agent@servicedesk.local') LIMIT 1;

INSERT INTO users (name, email, phone, department, role, status, created_at, updated_at)
SELECT * FROM (SELECT 'Karan Mehta', 'karan.agent@servicedesk.local', '9876500003', 'IT Support', 'SUPPORT_AGENT', 'ACTIVE', NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'karan.agent@servicedesk.local') LIMIT 1;

INSERT INTO users (name, email, phone, department, role, status, created_at, updated_at)
SELECT * FROM (SELECT 'Neha Verma', 'neha.employee@servicedesk.local', '9876500004', 'Finance', 'EMPLOYEE', 'ACTIVE', NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'neha.employee@servicedesk.local') LIMIT 1;

INSERT INTO users (name, email, phone, department, role, status, created_at, updated_at)
SELECT * FROM (SELECT 'Amit Joshi', 'amit.employee@servicedesk.local', '9876500005', 'Sales', 'EMPLOYEE', 'ACTIVE', NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'amit.employee@servicedesk.local') LIMIT 1;

INSERT INTO users (name, email, phone, department, role, status, created_at, updated_at)
SELECT * FROM (SELECT 'Priya Nair', 'priya.employee@servicedesk.local', '9876500006', 'HR', 'EMPLOYEE', 'INACTIVE', NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'priya.employee@servicedesk.local') LIMIT 1;

-- Tickets (requester_id / assigned_agent_id reference the users inserted above, in order 1-6)
INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'Laptop not powering on', 'My work laptop does not turn on even after charging overnight.', 'HARDWARE', 'HIGH', 'OPEN',
  (SELECT id FROM users WHERE email='neha.employee@servicedesk.local'), (SELECT id FROM users WHERE email='riya.agent@servicedesk.local'), NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Laptop not powering on') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'Cannot access shared drive', 'Getting permission denied error when accessing the finance shared drive.', 'ACCOUNT_ACCESS', 'MEDIUM', 'IN_PROGRESS',
  (SELECT id FROM users WHERE email='amit.employee@servicedesk.local'), (SELECT id FROM users WHERE email='karan.agent@servicedesk.local'), NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Cannot access shared drive') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'Email not syncing on mobile', 'Outlook app on my phone stopped syncing new emails since yesterday.', 'EMAIL', 'LOW', 'OPEN',
  (SELECT id FROM users WHERE email='neha.employee@servicedesk.local'), NULL, NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Email not syncing on mobile') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'Server outage affecting billing app', 'The internal billing application is completely down for all users.', 'NETWORK', 'CRITICAL', 'IN_PROGRESS',
  (SELECT id FROM users WHERE email='amit.employee@servicedesk.local'), (SELECT id FROM users WHERE email='riya.agent@servicedesk.local'), NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Server outage affecting billing app') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'Printer on 3rd floor jamming', 'The HP printer near the finance desk keeps jamming on every print job.', 'PRINTER', 'LOW', 'PENDING',
  (SELECT id FROM users WHERE email='neha.employee@servicedesk.local'), (SELECT id FROM users WHERE email='karan.agent@servicedesk.local'), NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Printer on 3rd floor jamming') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'New employee laptop setup', 'Need a new laptop configured and handed over for an employee joining Monday.', 'HARDWARE', 'MEDIUM', 'RESOLVED',
  (SELECT id FROM users WHERE email='anand.admin@servicedesk.local'), (SELECT id FROM users WHERE email='karan.agent@servicedesk.local'), NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'New employee laptop setup') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'Suspicious phishing email received', 'Received an email asking to reset password via an external link, looks suspicious.', 'SECURITY', 'HIGH', 'RESOLVED',
  (SELECT id FROM users WHERE email='amit.employee@servicedesk.local'), (SELECT id FROM users WHERE email='riya.agent@servicedesk.local'), NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Suspicious phishing email received') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'Software license expired', 'Design software shows a license expired message and I cannot open my project files.', 'SOFTWARE', 'MEDIUM', 'CLOSED',
  (SELECT id FROM users WHERE email='neha.employee@servicedesk.local'), (SELECT id FROM users WHERE email='karan.agent@servicedesk.local'), NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Software license expired') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'VPN disconnects frequently', 'VPN connection drops every 10-15 minutes while working from home.', 'NETWORK', 'MEDIUM', 'OPEN',
  (SELECT id FROM users WHERE email='amit.employee@servicedesk.local'), NULL, NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'VPN disconnects frequently') LIMIT 1;

INSERT INTO tickets (title, description, category, priority, status, requester_id, assigned_agent_id, created_at, updated_at)
SELECT * FROM (SELECT 'Monitor flickering intermittently', 'External monitor flickers randomly, especially after the laptop wakes from sleep.', 'HARDWARE', 'LOW', 'CLOSED',
  (SELECT id FROM users WHERE email='neha.employee@servicedesk.local'), (SELECT id FROM users WHERE email='riya.agent@servicedesk.local'), NOW(), NOW()) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Monitor flickering intermittently') LIMIT 1;
