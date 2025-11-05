"""
Main HR Agent implementation
"""

from typing import List, Optional, Dict
from datetime import datetime
import logging

from .models import Employee, Department, LeaveRequest, EmployeeStatus, LeaveStatus


logger = logging.getLogger(__name__)


class HRAgent:
    """
    Main HR Agent class for managing employees, departments, and leave requests
    """

    def __init__(self):
        """Initialize the HR Agent"""
        self.employees: Dict[str, Employee] = {}
        self.departments: Dict[str, Department] = {}
        self.leave_requests: Dict[str, LeaveRequest] = {}
        logger.info("HR Agent initialized")

    # Department Management
    def create_department(self, id: str, name: str, description: str, 
                         manager_id: Optional[str] = None) -> Department:
        """Create a new department"""
        if id in self.departments:
            raise ValueError(f"Department with id {id} already exists")
        
        department = Department(
            id=id,
            name=name,
            description=description,
            manager_id=manager_id
        )
        self.departments[id] = department
        logger.info(f"Created department: {department}")
        return department

    def get_department(self, department_id: str) -> Optional[Department]:
        """Get a department by ID"""
        return self.departments.get(department_id)

    def list_departments(self) -> List[Department]:
        """List all departments"""
        return list(self.departments.values())

    # Employee Management
    def add_employee(self, id: str, first_name: str, last_name: str, 
                    email: str, department_id: str, position: str,
                    salary: Optional[float] = None, 
                    manager_id: Optional[str] = None) -> Employee:
        """Add a new employee"""
        if id in self.employees:
            raise ValueError(f"Employee with id {id} already exists")
        
        if department_id not in self.departments:
            raise ValueError(f"Department {department_id} does not exist")
        
        employee = Employee(
            id=id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            department_id=department_id,
            position=position,
            salary=salary,
            manager_id=manager_id
        )
        self.employees[id] = employee
        logger.info(f"Added employee: {employee}")
        return employee

    def get_employee(self, employee_id: str) -> Optional[Employee]:
        """Get an employee by ID"""
        return self.employees.get(employee_id)

    def update_employee_status(self, employee_id: str, 
                              status: EmployeeStatus) -> Employee:
        """Update employee status"""
        employee = self.employees.get(employee_id)
        if not employee:
            raise ValueError(f"Employee {employee_id} not found")
        
        employee.status = status
        logger.info(f"Updated employee {employee_id} status to {status.value}")
        return employee

    def list_employees(self, department_id: Optional[str] = None, 
                      status: Optional[EmployeeStatus] = None) -> List[Employee]:
        """List employees with optional filters"""
        employees = list(self.employees.values())
        
        if department_id:
            employees = [e for e in employees if e.department_id == department_id]
        
        if status:
            employees = [e for e in employees if e.status == status]
        
        return employees

    # Leave Request Management
    def create_leave_request(self, id: str, employee_id: str, 
                           start_date: datetime, end_date: datetime,
                           leave_type: str, reason: str) -> LeaveRequest:
        """Create a new leave request"""
        if id in self.leave_requests:
            raise ValueError(f"Leave request with id {id} already exists")
        
        if employee_id not in self.employees:
            raise ValueError(f"Employee {employee_id} not found")
        
        if start_date > end_date:
            raise ValueError("Start date must be before end date")
        
        leave_request = LeaveRequest(
            id=id,
            employee_id=employee_id,
            start_date=start_date,
            end_date=end_date,
            leave_type=leave_type,
            reason=reason
        )
        self.leave_requests[id] = leave_request
        logger.info(f"Created leave request: {leave_request}")
        return leave_request

    def approve_leave_request(self, request_id: str, 
                            approved_by: str) -> LeaveRequest:
        """Approve a leave request"""
        leave_request = self.leave_requests.get(request_id)
        if not leave_request:
            raise ValueError(f"Leave request {request_id} not found")
        
        if leave_request.status != LeaveStatus.PENDING:
            raise ValueError(f"Leave request {request_id} is not pending")
        
        leave_request.status = LeaveStatus.APPROVED
        leave_request.approved_by = approved_by
        leave_request.approved_at = datetime.now()
        logger.info(f"Approved leave request {request_id} by {approved_by}")
        return leave_request

    def reject_leave_request(self, request_id: str, 
                           rejected_by: str) -> LeaveRequest:
        """Reject a leave request"""
        leave_request = self.leave_requests.get(request_id)
        if not leave_request:
            raise ValueError(f"Leave request {request_id} not found")
        
        if leave_request.status != LeaveStatus.PENDING:
            raise ValueError(f"Leave request {request_id} is not pending")
        
        leave_request.status = LeaveStatus.REJECTED
        leave_request.approved_by = rejected_by
        leave_request.approved_at = datetime.now()
        logger.info(f"Rejected leave request {request_id} by {rejected_by}")
        return leave_request

    def get_leave_request(self, request_id: str) -> Optional[LeaveRequest]:
        """Get a leave request by ID"""
        return self.leave_requests.get(request_id)

    def list_leave_requests(self, employee_id: Optional[str] = None,
                          status: Optional[LeaveStatus] = None) -> List[LeaveRequest]:
        """List leave requests with optional filters"""
        requests = list(self.leave_requests.values())
        
        if employee_id:
            requests = [r for r in requests if r.employee_id == employee_id]
        
        if status:
            requests = [r for r in requests if r.status == status]
        
        return requests

    def get_statistics(self) -> Dict:
        """Get HR statistics"""
        total_employees = len(self.employees)
        active_employees = len([e for e in self.employees.values() 
                              if e.status == EmployeeStatus.ACTIVE])
        total_departments = len(self.departments)
        pending_leave_requests = len([r for r in self.leave_requests.values() 
                                     if r.status == LeaveStatus.PENDING])
        
        return {
            "total_employees": total_employees,
            "active_employees": active_employees,
            "total_departments": total_departments,
            "pending_leave_requests": pending_leave_requests
        }
