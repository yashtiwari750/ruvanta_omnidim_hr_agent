# Ruvanta Omnidim HR Agent

A comprehensive HR management agent for the Ruvanta Omnidim platform version 1.0.0.

## Overview

The Ruvanta Omnidim HR Agent is a Python-based human resources management system that provides functionality for:

- **Employee Management**: Add, update, and track employee information
- **Department Management**: Organize employees into departments
- **Leave Management**: Handle employee leave requests with approval workflows
- **HR Analytics**: Get insights and statistics about your workforce

## Features

- ✅ Complete employee lifecycle management
- ✅ Department hierarchy and organization
- ✅ Leave request workflow (create, approve, reject)
- ✅ Employee status tracking (active, inactive, on leave, terminated)
- ✅ HR statistics and reporting
- ✅ Type-safe data models with Python dataclasses
- ✅ Comprehensive logging

## Installation

### From Source

```bash
git clone https://github.com/yashtiwari750/ruvanta_omnidim_hr_agent.git
cd ruvanta_omnidim_hr_agent
pip install -e .
```

### Using pip

```bash
pip install -r requirements.txt
```

## Quick Start

```python
from ruvanta_omnidim_hr import HRAgent, EmployeeStatus

# Initialize the HR Agent
hr_agent = HRAgent()

# Create a department
dept = hr_agent.create_department(
    id="eng-001",
    name="Engineering",
    description="Software Engineering Department"
)

# Add an employee
employee = hr_agent.add_employee(
    id="emp-001",
    first_name="John",
    last_name="Doe",
    email="john.doe@company.com",
    department_id="eng-001",
    position="Software Engineer",
    salary=75000.0
)

# Get HR statistics
stats = hr_agent.get_statistics()
print(f"Total Employees: {stats['total_employees']}")
```

## Usage Examples

### Employee Management

```python
# List all active employees
active_employees = hr_agent.list_employees(status=EmployeeStatus.ACTIVE)

# Get specific employee
employee = hr_agent.get_employee("emp-001")
print(f"Employee: {employee.full_name}")

# Update employee status
hr_agent.update_employee_status("emp-001", EmployeeStatus.ON_LEAVE)
```

### Leave Request Management

```python
from datetime import datetime, timedelta

# Create a leave request
leave = hr_agent.create_leave_request(
    id="leave-001",
    employee_id="emp-001",
    start_date=datetime.now(),
    end_date=datetime.now() + timedelta(days=5),
    leave_type="vacation",
    reason="Family vacation"
)

# Approve leave request
hr_agent.approve_leave_request("leave-001", approved_by="manager-001")

# List pending leave requests
from ruvanta_omnidim_hr import LeaveStatus
pending_leaves = hr_agent.list_leave_requests(status=LeaveStatus.PENDING)
```

### Department Management

```python
# List all departments
departments = hr_agent.list_departments()

# Get employees in a specific department
eng_employees = hr_agent.list_employees(department_id="eng-001")
```

## Project Structure

```
ruvanta_omnidim_hr_agent/
├── src/
│   └── ruvanta_omnidim_hr/
│       ├── __init__.py       # Package initialization
│       ├── agent.py          # Main HR Agent class
│       └── models.py         # Data models (Employee, Department, LeaveRequest)
├── tests/                    # Unit tests
├── examples/                 # Example scripts
├── docs/                     # Documentation
├── requirements.txt          # Python dependencies
├── setup.py                  # Package setup
└── README.md                 # This file
```

## API Reference

### HRAgent Class

Main class for HR operations:

- `create_department(id, name, description, manager_id=None)`: Create a new department
- `add_employee(id, first_name, last_name, email, department_id, position, ...)`: Add an employee
- `update_employee_status(employee_id, status)`: Update employee status
- `create_leave_request(id, employee_id, start_date, end_date, leave_type, reason)`: Create leave request
- `approve_leave_request(request_id, approved_by)`: Approve a leave request
- `reject_leave_request(request_id, rejected_by)`: Reject a leave request
- `get_statistics()`: Get HR statistics

### Data Models

- **Employee**: Employee information and status
- **Department**: Department organization
- **LeaveRequest**: Leave request with approval workflow

### Enumerations

- **EmployeeStatus**: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED
- **LeaveStatus**: PENDING, APPROVED, REJECTED, CANCELLED

## Development

### Running Tests

```bash
python -m pytest tests/
```

### Code Style

This project follows PEP 8 style guidelines.

## Version

Current version: **1.0.0** (Ruvanta Omnidim Version)

## Security Considerations

This implementation includes logging for audit trail purposes. When deploying in production:

- **Logging**: Configure logging levels appropriately. The system logs employee operations at INFO level for compliance and audit purposes.
- **Data Access**: Implement proper authentication and authorization before exposing the HR Agent API.
- **Data Storage**: The in-memory storage is suitable for demonstrations. Use a secure database in production.
- **Sensitive Data**: Consider your organization's data handling policies when logging employee information.
- **Network Security**: If exposing via API, use HTTPS and implement proper API security (authentication, rate limiting, etc.).

## License

Copyright © 2025 Ruvanta Team. All rights reserved.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support and questions, please open an issue on the GitHub repository.