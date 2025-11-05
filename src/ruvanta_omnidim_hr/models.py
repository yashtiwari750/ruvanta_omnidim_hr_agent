"""
Data models for the HR Agent
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional
from enum import Enum


class EmployeeStatus(Enum):
    """Employee status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    ON_LEAVE = "on_leave"
    TERMINATED = "terminated"


class LeaveStatus(Enum):
    """Leave request status enumeration"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


@dataclass
class Department:
    """Department model"""
    id: str
    name: str
    description: str
    manager_id: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)

    def __str__(self):
        return f"Department(id={self.id}, name={self.name})"


@dataclass
class Employee:
    """Employee model"""
    id: str
    first_name: str
    last_name: str
    email: str
    department_id: str
    position: str
    status: EmployeeStatus = EmployeeStatus.ACTIVE
    hire_date: datetime = field(default_factory=datetime.now)
    salary: Optional[float] = None
    manager_id: Optional[str] = None

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"Employee(id={self.id}, name={self.full_name}, position={self.position})"


@dataclass
class LeaveRequest:
    """Leave request model"""
    id: str
    employee_id: str
    start_date: datetime
    end_date: datetime
    leave_type: str
    reason: str
    status: LeaveStatus = LeaveStatus.PENDING
    created_at: datetime = field(default_factory=datetime.now)
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None

    @property
    def duration_days(self):
        return (self.end_date - self.start_date).days + 1

    def __str__(self):
        return f"LeaveRequest(id={self.id}, employee_id={self.employee_id}, status={self.status.value})"
