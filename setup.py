"""
Setup configuration for Ruvanta Omnidim HR Agent
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="ruvanta-omnidim-hr-agent",
    version="1.0.0",
    author="Ruvanta Team",
    description="A comprehensive HR management agent for the Ruvanta Omnidim platform",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yashtiwari750/ruvanta_omnidim_hr_agent",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        "python-dateutil>=2.8.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=3.0.0",
        ],
    },
)
