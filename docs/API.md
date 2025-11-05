# API Documentation

## Ruvanta Omnidim HR Agent API

### Overview

The Ruvanta Omnidim HR Agent provides a comprehensive API for managing human resources operations.

### Classes

#### HRAgent

The main class for all HR operations.

**Methods:**

##### Department Management

- `create_department(id: str, name: str, description: str, manager_id: Optional[str] = None) -> Department`
  - Creates a new department
  - Raises `ValueError` if department ID already exists

- `get_department(department_id: str) -> Optional[Department]`
  - Retrieves a department by ID
  - Returns `None` if not found

- `list_departments() -> List[Department]`
  - Returns all departments

##### Employee Management

- `add_employee(id: str, first_name: str, last_name: str, email: str, department_id: str, position: str, salary: Optional[float] = None, manager_id: Optional[str] = None) -> Employee`
  - Adds a new employee
  - Raises `ValueError` if employee ID already exists or department doesn't exist

- `get_employee(employee_id: str) -> Optional[Employee]`
  - Retrieves an employee by ID
  - Returns `None` if not found

- `update_employee_status(employee_id: str, status: EmployeeStatus) -> Employee`
  - Updates employee status
  - Raises `ValueError` if employee not found

- `list_employees(department_id: Optional[str] = None, status: Optional[EmployeeStatus] = None) -> List[Employee]`
  - Lists employees with optional filters

##### Leave Request Management

- `create_leave_request(id: str, employee_id: str, start_date: datetime, end_date: datetime, leave_type: str, reason: str) -> LeaveRequest`
  - Creates a new leave request
  - Raises `ValueError` if request ID exists, employee not found, or dates are invalid

- `approve_leave_request(request_id: str, approved_by: str) -> LeaveRequest`
  - Approves a pending leave request
  - Raises `ValueError` if request not found or not pending

- `reject_leave_request(request_id: str, rejected_by: str) -> LeaveRequest`
  - Rejects a pending leave request
  - Raises `ValueError` if request not found or not pending

- `get_leave_request(request_id: str) -> Optional[LeaveRequest]`
  - Retrieves a leave request by ID
  - Returns `None` if not found

- `list_leave_requests(employee_id: Optional[str] = None, status: Optional[LeaveStatus] = None) -> List[LeaveRequest]`
  - Lists leave requests with optional filters

##### Statistics

- `get_statistics() -> Dict`
  - Returns HR statistics including:
    - `total_employees`: Total number of employees
    - `active_employees`: Number of active employees
    - `total_departments`: Total number of departments
    - `pending_leave_requests`: Number of pending leave requests

### Data Models

#### Employee

Employee information and status.

**Attributes:**
- `id: str` - Unique employee identifier
- `first_name: str` - Employee's first name
- `last_name: str` - Employee's last name
- `email: str` - Employee's email address
- `department_id: str` - ID of employee's department
- `position: str` - Job position
- `status: EmployeeStatus` - Current employment status
- `hire_date: datetime` - Date of hire
- `salary: Optional[float]` - Salary (optional)
- `manager_id: Optional[str]` - ID of manager (optional)

**Properties:**
- `full_name: str` - Returns full name (first + last)

#### Department

Department organization information.

**Attributes:**
- `id: str` - Unique department identifier
- `name: str` - Department name
- `description: str` - Department description
- `manager_id: Optional[str]` - ID of department manager (optional)
- `created_at: datetime` - Creation timestamp

#### LeaveRequest

Leave request with approval workflow.

**Attributes:**
- `id: str` - Unique request identifier
- `employee_id: str` - ID of requesting employee
- `start_date: datetime` - Leave start date
- `end_date: datetime` - Leave end date
- `leave_type: str` - Type of leave (e.g., "vacation", "sick")
- `reason: str` - Reason for leave
- `status: LeaveStatus` - Current status
- `created_at: datetime` - Request creation timestamp
- `approved_by: Optional[str]` - ID of approver (optional)
- `approved_at: Optional[datetime]` - Approval timestamp (optional)

**Properties:**
- `duration_days: int` - Number of days for the leave request

### Enumerations

#### EmployeeStatus

Employee status values:
- `ACTIVE` - Active employee
- `INACTIVE` - Inactive employee
- `ON_LEAVE` - Currently on leave
- `TERMINATED` - Employment terminated

#### LeaveStatus

Leave request status values:
- `PENDING` - Awaiting approval
- `APPROVED` - Approved by manager
- `REJECTED` - Rejected by manager
- `CANCELLED` - Cancelled by employee

### Error Handling

The API raises `ValueError` exceptions for invalid operations:
- Duplicate IDs (employee, department, leave request)
- Non-existent references (employee, department)
- Invalid state transitions (e.g., approving non-pending requests)
- Invalid data (e.g., end date before start date)

### Example Usage

```python
from ruvanta_omnidim_hr import HRAgent, EmployeeStatus, LeaveStatus
from datetime import datetime, timedelta

# Initialize
hr_agent = HRAgent()

# Create department
dept = hr_agent.create_department(
    id="eng-001",
    name="Engineering",
    description="Software Engineering"
)

# Add employee
employee = hr_agent.add_employee(
    id="emp-001",
    first_name="John",
    last_name="Doe",
    email="john@company.com",
    department_id="eng-001",
    position="Engineer",
    salary=75000.0
)

# Create leave request
leave = hr_agent.create_leave_request(
    id="leave-001",
    employee_id="emp-001",
    start_date=datetime.now(),
    end_date=datetime.now() + timedelta(days=5),
    leave_type="vacation",
    reason="Family vacation"
)

# Approve leave
hr_agent.approve_leave_request("leave-001", "manager-001")

# Get statistics
stats = hr_agent.get_statistics()
print(f"Active Employees: {stats['active_employees']}")
```
