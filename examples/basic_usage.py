"""
Example usage of the Ruvanta Omnidim HR Agent
"""

from datetime import datetime, timedelta
from ruvanta_omnidim_hr import HRAgent, EmployeeStatus, LeaveStatus


def main():
    """Demonstrate HR Agent functionality"""
    
    # Initialize the HR Agent
    print("=" * 60)
    print("Ruvanta Omnidim HR Agent - Example Usage")
    print("=" * 60)
    print()
    
    hr_agent = HRAgent()
    
    # Create departments
    print("Creating departments...")
    eng_dept = hr_agent.create_department(
        id="eng-001",
        name="Engineering",
        description="Software Engineering Department"
    )
    print(f"✓ Created: {eng_dept}")
    
    hr_dept = hr_agent.create_department(
        id="hr-001",
        name="Human Resources",
        description="HR Department"
    )
    print(f"✓ Created: {hr_dept}")
    print()
    
    # Add employees
    print("Adding employees...")
    emp1 = hr_agent.add_employee(
        id="emp-001",
        first_name="John",
        last_name="Doe",
        email="john.doe@company.com",
        department_id="eng-001",
        position="Senior Software Engineer",
        salary=95000.0
    )
    print(f"✓ Added: {emp1}")
    
    emp2 = hr_agent.add_employee(
        id="emp-002",
        first_name="Jane",
        last_name="Smith",
        email="jane.smith@company.com",
        department_id="eng-001",
        position="Software Engineer",
        salary=75000.0,
        manager_id="emp-001"
    )
    print(f"✓ Added: {emp2}")
    
    emp3 = hr_agent.add_employee(
        id="emp-003",
        first_name="Alice",
        last_name="Johnson",
        email="alice.johnson@company.com",
        department_id="hr-001",
        position="HR Manager",
        salary=80000.0
    )
    print(f"✓ Added: {emp3}")
    print()
    
    # List employees
    print("Listing all employees...")
    all_employees = hr_agent.list_employees()
    for emp in all_employees:
        print(f"  • {emp.full_name} - {emp.position} ({emp.department_id})")
    print()
    
    # List engineering employees
    print("Listing engineering department employees...")
    eng_employees = hr_agent.list_employees(department_id="eng-001")
    for emp in eng_employees:
        print(f"  • {emp.full_name} - {emp.position}")
    print()
    
    # Create leave requests
    print("Creating leave requests...")
    leave1 = hr_agent.create_leave_request(
        id="leave-001",
        employee_id="emp-001",
        start_date=datetime.now() + timedelta(days=7),
        end_date=datetime.now() + timedelta(days=11),
        leave_type="vacation",
        reason="Family vacation"
    )
    print(f"✓ Created: {leave1} ({leave1.duration_days} days)")
    
    leave2 = hr_agent.create_leave_request(
        id="leave-002",
        employee_id="emp-002",
        start_date=datetime.now() + timedelta(days=3),
        end_date=datetime.now() + timedelta(days=5),
        leave_type="sick",
        reason="Medical appointment"
    )
    print(f"✓ Created: {leave2} ({leave2.duration_days} days)")
    print()
    
    # Approve leave request
    print("Processing leave requests...")
    hr_agent.approve_leave_request("leave-001", approved_by="emp-003")
    print("✓ Approved leave-001")
    
    hr_agent.reject_leave_request("leave-002", rejected_by="emp-003")
    print("✓ Rejected leave-002")
    print()
    
    # List pending leave requests
    print("Listing pending leave requests...")
    pending_leaves = hr_agent.list_leave_requests(status=LeaveStatus.PENDING)
    print(f"  Pending requests: {len(pending_leaves)}")
    print()
    
    # Update employee status
    print("Updating employee status...")
    hr_agent.update_employee_status("emp-001", EmployeeStatus.ON_LEAVE)
    print("✓ Set emp-001 to ON_LEAVE status")
    print()
    
    # Get HR statistics
    print("HR Statistics:")
    print("-" * 60)
    stats = hr_agent.get_statistics()
    print(f"  Total Employees:          {stats['total_employees']}")
    print(f"  Active Employees:         {stats['active_employees']}")
    print(f"  Total Departments:        {stats['total_departments']}")
    print(f"  Pending Leave Requests:   {stats['pending_leave_requests']}")
    print()
    
    print("=" * 60)
    print("Example completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
