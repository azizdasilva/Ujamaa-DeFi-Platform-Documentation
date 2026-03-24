"""
Impact Tracker - ESG and Development Impact Measurement

Tracks impact metrics for liquidity pools including:
- Industrial growth (capacity increase)
- Value-add ratio (processed vs raw)
- Job creation
- SDG alignment
- Environmental impact

@reference docs/03_OPERATIONS/KPI_IMPLEMENTATION_PLAN.md
@reference docs/03_OPERATIONS/POOL_KPI_FRAMEWORK.md
@reference UN Sustainable Development Goals (SDGs)
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime
from enum import Enum


class SDG(Enum):
    """UN Sustainable Development Goals"""
    NO_POVERTY = ("SDG 1", "No Poverty")
    ZERO_HUNGER = ("SDG 2", "Zero Hunger")
    GOOD_HEALTH = ("SDG 3", "Good Health and Well-being")
    QUALITY_EDUCATION = ("SDG 4", "Quality Education")
    GENDER_EQUALITY = ("SDG 5", "Gender Equality")
    CLEAN_WATER = ("SDG 6", "Clean Water and Sanitation")
    CLEAN_ENERGY = ("SDG 7", "Affordable and Clean Energy")
    DECENT_WORK = ("SDG 8", "Decent Work and Economic Growth")
    INDUSTRY = ("SDG 9", "Industry, Innovation and Infrastructure")
    REDUCED_INEQUALITIES = ("SDG 10", "Reduced Inequalities")
    RESPONSIBLE_CONSUMPTION = ("SDG 12", "Responsible Consumption and Production")
    CLIMATE_ACTION = ("SDG 13", "Climate Action")
    PARTNERSHIPS = ("SDG 17", "Partnerships for the Goals")


@dataclass
class IndustrialProject:
    """Industrial project data for impact tracking"""
    project_id: str
    company_name: str
    sector: str
    financing_amount: int  # 18 decimals
    financing_date: str
    
    # Capacity metrics
    initial_capacity: int  # Units per year
    current_capacity: int  # Units per year
    capacity_unit: str  # e.g., "tons", "units"
    
    # Value metrics
    raw_material_value: int  # EUR value of raw materials
    processed_goods_value: int  # EUR value of processed goods
    
    # Employment
    direct_jobs: int  # Direct jobs created
    indirect_jobs: int  # Indirect jobs supported
    women_employed: int  # Women employed
    youth_employed: int  # Youth (<35) employed
    
    # Environmental
    co2_reduction_tons: int  # CO2 reduction (tons/year)
    renewable_energy_kwh: int  # Renewable energy generated (kWh/year)
    
    # SDG alignment
    sdg_alignment: List[SDG]
    
    # Location
    country: str
    region: str


@dataclass
class ImpactMetrics:
    """Pool impact metrics"""
    pool_id: str
    calculated_at: str
    reporting_period: str
    
    # Industrial Growth
    total_projects: int
    total_financed: int  # EUR
    avg_capacity_increase: float  # %
    total_capacity_increase: float  # %
    
    # Value-Add
    total_raw_value: int  # EUR
    total_processed_value: int  # EUR
    value_add_ratio: float  # Processed/Raw
    
    # Job Creation
    total_direct_jobs: int
    total_indirect_jobs: int
    jobs_per_million: int  # Per €1M financed
    women_employment_rate: float  # %
    youth_employment_rate: float  # %
    
    # Environmental
    total_co2_reduction: int  # Tons/year
    total_renewable_energy: int  # kWh/year
    
    # SDG Alignment
    sdg_distribution: Dict[str, int]  # SDG -> project count
    primary_sdg: str
    sdg_coverage: float  # % of SDGs covered
    
    # Geographic
    countries_served: int
    regions_served: int
    
    # Overall Impact
    impact_score: int  # 0-100
    impact_grade: str  # A, B, C, D


class ImpactTracker:
    """
    Impact tracking engine for liquidity pools.
    
    Measures economic, social, and environmental impact
    of financed industrial projects.
    """
    
    # Sector classifications
    SECTORS = {
        'MFG': 'Manufacturing',
        'AGR': 'Agriculture & Agribusiness',
        'TEXT': 'Textiles & Garments',
        'FOOD': 'Food Processing',
        'ENERGY': 'Energy & Utilities',
        'MINING': 'Mining & Natural Resources',
    }
    
    # Impact scoring weights
    WEIGHTS = {
        'jobs': 0.25,
        'growth': 0.25,
        'value_add': 0.20,
        'environmental': 0.15,
        'sdg': 0.15,
    }
    
    def __init__(self):
        """Initialize impact tracker"""
        self.projects: Dict[str, IndustrialProject] = {}
    
    def add_project(
        self,
        project: IndustrialProject
    ) -> Tuple[bool, str]:
        """
        Add industrial project for tracking.
        
        Args:
            project: IndustrialProject object
            
        Returns:
            Tuple of (success, message)
        """
        if project.project_id in self.projects:
            return (False, f"Project {project.project_id} already exists")
        
        self.projects[project.project_id] = project
        return (True, f"Project {project.project_id} added successfully")
    
    def calculate_industrial_growth(self) -> Tuple[float, float]:
        """
        Calculate industrial growth metrics.
        
        Returns:
            Tuple of (average_increase_%, total_increase_%)
        """
        if not self.projects:
            return (0.0, 0.0)
        
        total_increase = 0
        count = 0
        
        for project in self.projects.values():
            if project.initial_capacity > 0:
                increase = (
                    (project.current_capacity - project.initial_capacity)
                    / project.initial_capacity
                ) * 100
                total_increase += increase
                count += 1
        
        if count == 0:
            return (0.0, 0.0)
        
        avg_increase = total_increase / count
        
        return (round(avg_increase, 2), round(total_increase, 2))
    
    def calculate_value_add_ratio(self) -> Tuple[float, int, int]:
        """
        Calculate value-add ratio.
        
        Formula: Processed Goods Value / Raw Material Value
        
        Target: >2.5x
        
        Returns:
            Tuple of (ratio, raw_value, processed_value)
        """
        total_raw = sum(p.raw_material_value for p in self.projects.values())
        total_processed = sum(p.processed_goods_value for p in self.projects.values())
        
        if total_raw == 0:
            return (0.0, 0, 0)
        
        ratio = total_processed / total_raw
        
        return (round(ratio, 2), total_raw, total_processed)
    
    def calculate_job_creation(
        self,
        total_financed: int
    ) -> Tuple[int, int, int, float, float]:
        """
        Calculate job creation metrics.
        
        Args:
            total_financed: Total amount financed (18 decimals)
            
        Returns:
            Tuple of (direct_jobs, indirect_jobs, jobs_per_million, women_rate, youth_rate)
        """
        total_direct = sum(p.direct_jobs for p in self.projects.values())
        total_indirect = sum(p.indirect_jobs for p in self.projects.values())
        total_women = sum(p.women_employed for p in self.projects.values())
        total_youth = sum(p.youth_employed for p in self.projects.values())
        
        # Convert from 18 decimals to EUR
        financed_eur = total_financed / (10 ** 18)
        millions = financed_eur / 1_000_000
        
        if millions > 0:
            jobs_per_million = int((total_direct + total_indirect) / millions)
        else:
            jobs_per_million = 0
        
        total_employees = total_women + total_youth
        if total_employees > 0:
            women_rate = (total_women / total_employees) * 100
            youth_rate = (total_youth / total_employees) * 100
        else:
            women_rate = 0.0
            youth_rate = 0.0
        
        return (
            total_direct,
            total_indirect,
            jobs_per_million,
            round(women_rate, 2),
            round(youth_rate, 2),
        )
    
    def calculate_environmental_impact(self) -> Tuple[int, int]:
        """
        Calculate environmental impact.
        
        Returns:
            Tuple of (co2_reduction_tons, renewable_energy_kwh)
        """
        total_co2 = sum(p.co2_reduction_tons for p in self.projects.values())
        total_renewable = sum(p.renewable_energy_kwh for p in self.projects.values())
        
        return (total_co2, total_renewable)
    
    def calculate_sdg_alignment(self) -> Tuple[Dict[str, int], str, float]:
        """
        Calculate SDG alignment.
        
        Returns:
            Tuple of (distribution, primary_sdg, coverage_%)
        """
        distribution: Dict[str, int] = {}
        
        for project in self.projects.values():
            for sdg in project.sdg_alignment:
                sdg_code = sdg.value[0]  # e.g., "SDG 1"
                distribution[sdg_code] = distribution.get(sdg_code, 0) + 1
        
        if not distribution:
            return ({}, "N/A", 0.0)
        
        # Find primary SDG
        primary_sdg = max(distribution, key=distribution.get)
        
        # Calculate coverage (out of 17 SDGs)
        coverage = (len(distribution) / 17) * 100
        
        return (distribution, primary_sdg, round(coverage, 2))
    
    def calculate_impact_score(self) -> Tuple[int, str]:
        """
        Calculate overall impact score.
        
        Returns:
            Tuple of (score, grade)
        """
        score = 0
        
        # Jobs score (25 points)
        _, _, jobs_per_million, _, _ = self.calculate_job_creation(
            sum(p.financing_amount for p in self.projects.values())
        )
        if jobs_per_million >= 100:
            score += 25
        elif jobs_per_million >= 50:
            score += 20
        elif jobs_per_million >= 25:
            score += 15
        
        # Growth score (25 points)
        avg_growth, _ = self.calculate_industrial_growth()
        if avg_growth >= 20:
            score += 25
        elif avg_growth >= 15:
            score += 20
        elif avg_growth >= 10:
            score += 15
        
        # Value-add score (20 points)
        value_ratio, _, _ = self.calculate_value_add_ratio()
        if value_ratio >= 2.5:
            score += 20
        elif value_ratio >= 2.0:
            score += 15
        elif value_ratio >= 1.5:
            score += 10
        
        # Environmental score (15 points)
        co2, renewable = self.calculate_environmental_impact()
        if co2 > 1000 or renewable > 100000:
            score += 15
        elif co2 > 500 or renewable > 50000:
            score += 10
        
        # SDG score (15 points)
        _, _, sdg_coverage = self.calculate_sdg_alignment()
        if sdg_coverage >= 30:
            score += 15
        elif sdg_coverage >= 20:
            score += 10
        
        # Determine grade
        if score >= 80:
            grade = 'A'
        elif score >= 60:
            grade = 'B'
        elif score >= 40:
            grade = 'C'
        else:
            grade = 'D'
        
        return (score, grade)
    
    def get_impact_metrics(
        self,
        pool_id: str,
        reporting_period: str = "2026-Q1"
    ) -> ImpactMetrics:
        """
        Get comprehensive impact metrics.
        
        Args:
            pool_id: Pool identifier
            reporting_period: Reporting period (e.g., "2026-Q1")
            
        Returns:
            ImpactMetrics object
        """
        # Total financed
        total_financed = sum(p.financing_amount for p in self.projects.values())
        
        # Industrial growth
        avg_growth, total_growth = self.calculate_industrial_growth()
        
        # Value-add
        value_ratio, raw_value, processed_value = self.calculate_value_add_ratio()
        
        # Jobs
        direct, indirect, jobs_per_m, women_rate, youth_rate = (
            self.calculate_job_creation(total_financed)
        )
        
        # Environmental
        co2, renewable = self.calculate_environmental_impact()
        
        # SDG
        sdg_dist, primary_sdg, sdg_coverage = self.calculate_sdg_alignment()
        
        # Geographic
        countries = len(set(p.country for p in self.projects.values()))
        regions = len(set(p.region for p in self.projects.values()))
        
        # Impact score
        score, grade = self.calculate_impact_score()
        
        return ImpactMetrics(
            pool_id=pool_id,
            calculated_at=datetime.now().isoformat(),
            reporting_period=reporting_period,
            total_projects=len(self.projects),
            total_financed=total_financed,
            avg_capacity_increase=avg_growth,
            total_capacity_increase=total_growth,
            total_raw_value=raw_value,
            total_processed_value=processed_value,
            value_add_ratio=value_ratio,
            total_direct_jobs=direct,
            total_indirect_jobs=indirect,
            jobs_per_million=jobs_per_m,
            women_employment_rate=women_rate,
            youth_employment_rate=youth_rate,
            total_co2_reduction=co2,
            total_renewable_energy=renewable,
            sdg_distribution=sdg_dist,
            primary_sdg=primary_sdg,
            sdg_coverage=sdg_coverage,
            countries_served=countries,
            regions_served=regions,
            impact_score=score,
            impact_grade=grade,
        )


# =============================================================================
# DEMO DATA
# =============================================================================

def generate_demo_impact_metrics(pool_id: str = "POOL-001") -> ImpactMetrics:
    """Generate demo impact metrics for testing"""
    tracker = ImpactTracker()
    
    # Add demo projects
    demo_projects = [
        IndustrialProject(
            project_id="PROJ-001",
            company_name="Abidjan Textiles SA",
            sector="TEXT",
            financing_amount=2_000_000 * 10**18,
            financing_date="2025-06-15",
            initial_capacity=100_000,
            current_capacity=130_000,
            capacity_unit="units/year",
            raw_material_value=5_000_000,
            processed_goods_value=15_000_000,
            direct_jobs=150,
            indirect_jobs=300,
            women_employed=80,
            youth_employed=120,
            co2_reduction_tons=500,
            renewable_energy_kwh=0,
            sdg_alignment=[SDG.DECENT_WORK, SDG.INDUSTRY, SDG.GENDER_EQUALITY],
            country="CI",
            region="West Africa",
        ),
        IndustrialProject(
            project_id="PROJ-002",
            company_name="Kenya Coffee Processors",
            sector="AGR",
            financing_amount=1_500_000 * 10**18,
            financing_date="2025-09-01",
            initial_capacity=500,
            current_capacity=650,
            capacity_unit="tons/year",
            raw_material_value=3_000_000,
            processed_goods_value=9_000_000,
            direct_jobs=200,
            indirect_jobs=500,
            women_employed=120,
            youth_employed=150,
            co2_reduction_tons=200,
            renewable_energy_kwh=50000,
            sdg_alignment=[SDG.DECENT_WORK, SDG.ZERO_HUNGER, SDG.CLIMATE_ACTION],
            country="KE",
            region="East Africa",
        ),
        IndustrialProject(
            project_id="PROJ-003",
            company_name="Solar Energy Mauritius",
            sector="ENERGY",
            financing_amount=3_000_000 * 10**18,
            financing_date="2025-03-20",
            initial_capacity=0,
            current_capacity=5000,
            capacity_unit="kW",
            raw_material_value=0,
            processed_goods_value=2_000_000,
            direct_jobs=50,
            indirect_jobs=100,
            women_employed=20,
            youth_employed=40,
            co2_reduction_tons=2000,
            renewable_energy_kwh=500000,
            sdg_alignment=[SDG.CLEAN_ENERGY, SDG.CLIMATE_ACTION, SDG.INDUSTRY],
            country="MU",
            region="Southern Africa",
        ),
    ]
    
    for project in demo_projects:
        tracker.add_project(project)
    
    return tracker.get_impact_metrics(pool_id)


if __name__ == "__main__":
    # Demo usage
    metrics = generate_demo_impact_metrics()
    print("Pool Impact Metrics")
    print("=" * 50)
    print(f"Pool ID: {metrics.pool_id}")
    print(f"Reporting Period: {metrics.reporting_period}")
    print(f"Impact Score: {metrics.impact_score}/100 (Grade: {metrics.impact_grade})")
    print(f"\nTotal Projects: {metrics.total_projects}")
    print(f"Total Financed: €{metrics.total_financed / 10**18:,.0f}")
    print(f"\nIndustrial Growth: {metrics.avg_capacity_increase}%")
    print(f"Value-Add Ratio: {metrics.value_add_ratio}x")
    print(f"\nJob Creation:")
    print(f"  Direct: {metrics.total_direct_jobs}")
    print(f"  Indirect: {metrics.total_indirect_jobs}")
    print(f"  Per €1M: {metrics.jobs_per_million}")
    print(f"  Women: {metrics.women_employment_rate}%")
    print(f"  Youth: {metrics.youth_employment_rate}%")
    print(f"\nEnvironmental Impact:")
    print(f"  CO2 Reduction: {metrics.total_co2_reduction} tons/year")
    print(f"  Renewable Energy: {metrics.total_renewable_energy} kWh/year")
    print(f"\nSDG Alignment: {metrics.primary_sdg}")
    print(f"SDGs Covered: {metrics.sdg_coverage}%")
