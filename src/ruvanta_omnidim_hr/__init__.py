"""
Ruvanta Omnidim HR Agent
A comprehensive HR management agent for the Ruvanta Omnidim platform.
"""

__version__ = "1.0.0"
__author__ = "Ruvanta Team"

from .agent import HRAgent
from .models import Employee, Department, LeaveRequest, EmployeeStatus, LeaveStatus

__all__ = ["HRAgent", "Employee", "Department", "LeaveRequest", "EmployeeStatus", "LeaveStatus"]
