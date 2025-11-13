"""
Unit tests for the Ruvanta Omnidim HR Agent
"""

import pytest
from datetime import datetime, timedelta

from ruvanta_omnidim_hr import HRAgent, Employee, Department, LeaveRequest
from ruvanta_omnidim_hr.models import EmployeeStatus, LeaveStatus


class TestHRAgent:
    """Test cases for HRAgent class"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.hr_agent = HRAgent()
    
    def test_create_department(self):
        """Test creating a department"""
        dept = self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        
        assert dept.id == "dept-001"
        assert dept.name == "Engineering"
        assert dept.description == "Engineering Department"
        assert len(self.hr_agent.list_departments()) == 1
    
    def test_create_duplicate_department(self):
        """Test creating duplicate department raises error"""
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        
        with pytest.raises(ValueError):
            self.hr_agent.create_department(
                id="dept-001",
                name="HR",
                description="HR Department"
            )
    
    def test_add_employee(self):
        """Test adding an employee"""
        # First create department
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        
        emp = self.hr_agent.add_employee(
            id="emp-001",
            first_name="John",
            last_name="Doe",
            email="john.doe@company.com",
            department_id="dept-001",
            position="Engineer",
            salary=75000.0
        )
        
        assert emp.id == "emp-001"
        assert emp.full_name == "John Doe"
        assert emp.status == EmployeeStatus.ACTIVE
        assert len(self.hr_agent.list_employees()) == 1
    
    def test_add_employee_invalid_department(self):
        """Test adding employee to non-existent department"""
        with pytest.raises(ValueError):
            self.hr_agent.add_employee(
                id="emp-001",
                first_name="John",
                last_name="Doe",
                email="john.doe@company.com",
                department_id="invalid-dept",
                position="Engineer"
            )
    
    def test_update_employee_status(self):
        """Test updating employee status"""
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        
        self.hr_agent.add_employee(
            id="emp-001",
            first_name="John",
            last_name="Doe",
            email="john.doe@company.com",
            department_id="dept-001",
            position="Engineer"
        )
        
        emp = self.hr_agent.update_employee_status(
            "emp-001",
            EmployeeStatus.ON_LEAVE
        )
        
        assert emp.status == EmployeeStatus.ON_LEAVE
    
    def test_list_employees_by_department(self):
        """Test listing employees filtered by department"""
        # Create departments
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        self.hr_agent.create_department(
            id="dept-002",
            name="HR",
            description="HR Department"
        )
        
        # Add employees
        self.hr_agent.add_employee(
            id="emp-001",
            first_name="John",
            last_name="Doe",
            email="john.doe@company.com",
            department_id="dept-001",
            position="Engineer"
        )
        self.hr_agent.add_employee(
            id="emp-002",
            first_name="Jane",
            last_name="Smith",
            email="jane.smith@company.com",
            department_id="dept-002",
            position="HR Manager"
        )
        
        eng_employees = self.hr_agent.list_employees(department_id="dept-001")
        assert len(eng_employees) == 1
        assert eng_employees[0].id == "emp-001"
    
    def test_create_leave_request(self):
        """Test creating a leave request"""
        # Setup
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        self.hr_agent.add_employee(
            id="emp-001",
            first_name="John",
            last_name="Doe",
            email="john.doe@company.com",
            department_id="dept-001",
            position="Engineer"
        )
        
        # Create leave request
        start_date = datetime.now()
        end_date = datetime.now() + timedelta(days=5)
        
        leave = self.hr_agent.create_leave_request(
            id="leave-001",
            employee_id="emp-001",
            start_date=start_date,
            end_date=end_date,
            leave_type="vacation",
            reason="Family vacation"
        )
        
        assert leave.id == "leave-001"
        assert leave.employee_id == "emp-001"
        assert leave.status == LeaveStatus.PENDING
        assert leave.duration_days == 6
    
    def test_create_leave_request_invalid_dates(self):
        """Test creating leave request with invalid dates"""
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        self.hr_agent.add_employee(
            id="emp-001",
            first_name="John",
            last_name="Doe",
            email="john.doe@company.com",
            department_id="dept-001",
            position="Engineer"
        )
        
        with pytest.raises(ValueError):
            self.hr_agent.create_leave_request(
                id="leave-001",
                employee_id="emp-001",
                start_date=datetime.now(),
                end_date=datetime.now() - timedelta(days=5),
                leave_type="vacation",
                reason="Family vacation"
            )
    
    def test_approve_leave_request(self):
        """Test approving a leave request"""
        # Setup
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        self.hr_agent.add_employee(
            id="emp-001",
            first_name="John",
            last_name="Doe",
            email="john.doe@company.com",
            department_id="dept-001",
            position="Engineer"
        )
        self.hr_agent.create_leave_request(
            id="leave-001",
            employee_id="emp-001",
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=5),
            leave_type="vacation",
            reason="Family vacation"
        )
        
        # Approve
        leave = self.hr_agent.approve_leave_request("leave-001", "manager-001")
        
        assert leave.status == LeaveStatus.APPROVED
        assert leave.approved_by == "manager-001"
        assert leave.approved_at is not None
    
    def test_reject_leave_request(self):
        """Test rejecting a leave request"""
        # Setup
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        self.hr_agent.add_employee(
            id="emp-001",
            first_name="John",
            last_name="Doe",
            email="john.doe@company.com",
            department_id="dept-001",
            position="Engineer"
        )
        self.hr_agent.create_leave_request(
            id="leave-001",
            employee_id="emp-001",
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=5),
            leave_type="vacation",
            reason="Family vacation"
        )
        
        # Reject
        leave = self.hr_agent.reject_leave_request("leave-001", "manager-001")
        
        assert leave.status == LeaveStatus.REJECTED
        assert leave.approved_by == "manager-001"
    
    def test_get_statistics(self):
        """Test getting HR statistics"""
        # Create department
        self.hr_agent.create_department(
            id="dept-001",
            name="Engineering",
            description="Engineering Department"
        )
        
        # Add employees
        self.hr_agent.add_employee(
            id="emp-001",
            first_name="John",
            last_name="Doe",
            email="john.doe@company.com",
            department_id="dept-001",
            position="Engineer"
        )
        self.hr_agent.add_employee(
            id="emp-002",
            first_name="Jane",
            last_name="Smith",
            email="jane.smith@company.com",
            department_id="dept-001",
            position="Engineer"
        )
        
        # Create leave request
        self.hr_agent.create_leave_request(
            id="leave-001",
            employee_id="emp-001",
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=5),
            leave_type="vacation",
            reason="Family vacation"
        )
        
        stats = self.hr_agent.get_statistics()
        
        assert stats["total_employees"] == 2
        assert stats["active_employees"] == 2
        assert stats["total_departments"] == 1
        assert stats["pending_leave_requests"] == 1
