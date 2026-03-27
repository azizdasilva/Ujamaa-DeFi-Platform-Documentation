# Deployment Guide

## UJAMAA DEFI PLATFORM Infrastructure & Operations

**Author:** Aziz Da Silva - Lead Architect  
**Version:** 2.0 (SRS v2.0 Aligned)  
**Date:** March 17, 2026  
**Classification:** Technical / Operations  
**Audience:** DevOps Engineers, SREs, Platform Engineers

**Aligned with:** SRS v2.0 Section 9 (DevOps & Infrastructure Layer)

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Infrastructure Architecture](#2-infrastructure-architecture)
3. [Kubernetes Configuration](#3-kubernetes-configuration)
4. [Terraform Infrastructure as Code](#4-terraform-infrastructure-as-code)
5. [CI/CD Pipelines](#5-cicd-pipelines)
6. [Environment Configuration](#6-environment-configuration)
7. [Monitoring & Observability](#7-monitoring--observability)
8. [Secrets Management](#8-secrets-management)
9. [Backup & Recovery](#9-backup--recovery)
10. [Scaling Procedures](#10-scaling-procedures)

---

# 1. Executive Summary

## 1.1 Deployment Overview

UJAMAA DEFI PLATFORM is deployed as a cloud-native, containerized application using:

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Cloud Provider** | AWS (primary), GCP (DR) | Infrastructure hosting |
| **Container Orchestration** | Kubernetes (EKS/GKE) | Container management |
| **Infrastructure as Code** | Terraform | Provisioning automation |
| **CI/CD** | GitHub Actions + ArgoCD | Build, test, deploy |
| **Container Registry** | AWS ECR + GitHub Packages | Image storage |
| **Service Mesh** | Istio | Traffic management, mTLS |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting |
| **Logging** | Loki + Grafana | Log aggregation |
| **Tracing** | Jaeger | Distributed tracing |

## 1.2 Deployment Environments

| Environment | Purpose | Cloud | Region | Replicas |
|-------------|---------|-------|--------|----------|
| **Development** | Developer testing | AWS | Cape Town (af-south-1) | 1 per service |
| **Staging** | Pre-production validation | AWS | Cape Town (af-south-1) | 2 per service |
| **Production** | Live traffic | AWS | Cape Town (af-south-1) | 3+ per service |
| **DR** | Disaster recovery | GCP | Johannesburg (africa-south1) | Hot standby |

## 1.3 Deployment Checklist

- [ ] Terraform infrastructure provisioned
- [ ] Kubernetes cluster configured
- [ ] Istio service mesh installed
- [ ] Monitoring stack deployed
- [ ] CI/CD pipelines configured
- [ ] Secrets populated in Vault
- [ ] Database migrations executed
- [ ] Smoke tests passing
- [ ] Runbook documentation complete

---

# 2. Infrastructure Architecture

## 2.1 AWS Production Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AWS PRODUCTION (af-south-1)                         │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │                           VPC: 10.0.0.0/16                                 │ │
│  │                                                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    Public Subnets (3 AZs)                            │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │ │ │
│  │  │  │ 10.0.1.0/24 │  │ 10.0.2.0/24 │  │ 10.0.3.0/24 │                 │ │ │
│  │  │  │   AZ: a     │  │   AZ: b     │  │   AZ: c     │                 │ │ │
│  │  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │ │ │
│  │  │         │                │                │                         │ │ │
│  │  │  ┌──────▼────────────────▼────────────────▼──────┐                 │ │ │
│  │  │  │           Application Load Balancer            │                 │ │ │
│  │  │  │         (Internet-facing, TLS termination)     │                 │ │ │
│  │  │  └────────────────────────────────────────────────┘                 │ │ │
│  │  │                                                                      │ │ │
│  │  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │  │                    NAT Gateways (3 AZs)                         │ │ │
│  │  │  └────────────────────────────────────────────────────────────────┘ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                   Private Subnets (3 AZs)                            │ │ │
│  │  │                                                                      │ │ │
│  │  │  ┌──────────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │                  EKS Cluster (Managed Node Groups)            │   │ │ │
│  │  │  │                                                               │   │ │ │
│  │  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │   │ │ │
│  │  │  │  │  Node Group │  │  Node Group │  │  Node Group │          │   │ │ │
│  │  │  │  │  (General)  │  │  (Compute)  │  │  (Memory)   │          │   │ │ │
│  │  │  │  │  m6i.2xlarge│  │  c6i.4xlarge│  │  r6i.2xlarge│          │   │ │ │
│  │  │  │  │  min: 3     │  │  min: 3     │  │  min: 3     │          │   │ │ │
│  │  │  │  │  max: 20    │  │  max: 30    │  │  max: 15    │          │   │ │ │
│  │  │  │  └─────────────┘  └─────────────┘  └─────────────┘          │   │ │ │
│  │  │  │                                                               │   │ │ │
│  │  │  │  Pods: FastAPI services, Kafka brokers, sidecars             │   │ │ │
│  │  │  └──────────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                      │ │ │
│  │  │  ┌──────────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │                  RDS PostgreSQL (Multi-AZ)                    │   │ │ │
│  │  │  │                                                               │   │ │ │
│  │  │  │  Primary: db.r6g.2xlarge    Standby: db.r6g.2xlarge           │   │ │ │
│  │  │  │  Storage: 500GB GP3 (auto-scale to 1TB)                       │   │ │ │
│  │  │  │  Multi-AZ deployment across 3 AZs                             │   │ │ │
│  │  │  └──────────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                      │ │ │
│  │  │  ┌──────────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │                  ElastiCache Redis (Cluster)                  │   │ │ │
│  │  │  │                                                               │   │ │ │
│  │  │  │  3 nodes (cache.r6g.large), cluster mode enabled              │   │ │ │
│  │  │  │  10GB per node, automatic failover                            │   │ │ │
│  │  │  └──────────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                      │ │ │
│  │  │  ┌──────────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │                  MSK Kafka (Managed Streaming)                │   │ │ │
│  │  │  │                                                               │   │ │ │
│  │  │  │  3 brokers (kafka.m7g.large), 3 AZs                           │   │ │ │
│  │  │  │  100GB per broker, auto-expand enabled                        │   │ │ │
│  │  │  └──────────────────────────────────────────────────────────────┘   │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                      Security Groups                                 │ │ │
│  │  │                                                                      │ │ │
│  │  │  • ALB SG: 443 from 0.0.0.0/0                                       │ │ │
│  │  │  • EKS SG: 443, 8000-8004 from ALB SG                               │ │ │
│  │  │  • RDS SG: 5432 from EKS SG only                                    │ │ │
│  │  │  • Redis SG: 6379 from EKS SG only                                  │ │ │
│  │  │  • Kafka SG: 9092, 9094 from EKS SG only                            │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │                      CloudFront CDN (Global)                               │ │
│  │                                                                            │ │
│  │  • 50+ edge locations globally                                             │ │
│  │  • 10+ edge locations in Africa (JNB, CPT, LOS, NBO, ACC)                 │ │
│  │  • Static assets: React PWA, images, fonts                                │ │
│  │  • Cache TTL: 1 hour (HTML), 1 week (JS/CSS), 1 month (images)            │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │                      AWS Global Accelerator                                │ │
│  │                                                                            │ │
│  │  • Static anycast IP addresses                                             │ │
│  │  • Route to optimal AWS region                                             │ │
│  │  • DDoS protection (AWS Shield Standard)                                   │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 GCP Disaster Recovery Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         GCP DISASTER RECOVERY (africa-south1)                   │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │                         VPC: 10.1.0.0/16                                   │ │
│  │                                                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    GKE Cluster (Autopilot)                            │ │ │
│  │  │                                                                       │ │ │
│  │  │  • Hot standby configuration                                          │ │ │
│  │  │  • Same Kubernetes manifests as production                            │ │ │
│  │  │  • Database: Cloud SQL PostgreSQL (read replica from AWS)             │ │ │
│  │  │  • Cache: Memorystore Redis (async replication)                       │ │ │
│  │  │                                                                       │ │ │
│  │  │  Scaling:                                                              │ │ │
│  │  │  • Normal: 50% of production capacity                                 │ │ │
│  │  │  • Failover: Auto-scale to 100%                                       │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    Cloud Load Balancing                              │ │ │
│  │  │                                                                       │ │ │
│  │  │  • Global HTTP(S) load balancer                                       │ │ │
│  │  │  • Failover routing from AWS                                          │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2.3 Network Topology

```
                              Internet
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   AWS Global Accelerator │
                    │   (Anycast IPs)          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   AWS CloudFront CDN    │
                    │   (Static Assets)       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Application LB        │
                    │   (TLS Termination)     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Istio Ingress Gateway │
                    │   (Service Mesh)        │
                    └────────────┬────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
            ▼                    ▼                    ▼
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │   Assets     │      │   Investors  │      │   Trades     │
    │   Service    │      │   Service    │      │   Service    │
    │   :8000      │      │   :8001      │      │   :8002      │
    └──────────────┘      └──────────────┘      └──────────────┘
```

---

# 3. Kubernetes Configuration

## 3.1 Cluster Configuration

```yaml
# terraform/eks/cluster.tf

resource "aws_eks_cluster" "ujamaa_prod" {
  name     = "ujamaa-prod"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = aws_subnet.private[*].id
    endpoint_private_access = true
    endpoint_public_access  = false
    security_group_ids      = [aws_security_group.eks_cluster.id]
  }

  enabled_cluster_log_types = [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler"
  ]

  tags = {
    Environment = "production"
    Project     = "ujamaa-defi"
  }

  depends_on = [aws_iam_role_policy_attachment.eks_cluster_policy]
}

resource "aws_eks_node_group" "general" {
  cluster_name    = aws_eks_cluster.ujamaa_prod.name
  node_group_name = "general"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.private[*].id

  instance_types = ["m6i.2xlarge"]

  scaling_config {
    desired_size = 6
    max_size     = 20
    min_size     = 3
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    workload-type = "general"
  }

  taint {
    key    = "workload-type"
    value  = "general"
    effect = "NO_SCHEDULE"
  }
}

resource "aws_eks_node_group" "compute" {
  cluster_name    = aws_eks_cluster.ujamaa_prod.name
  node_group_name = "compute"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.private[*].id

  instance_types = ["c6i.4xlarge"]

  scaling_config {
    desired_size = 6
    max_size     = 30
    min_size     = 3
  }

  labels = {
    workload-type = "compute"
  }
}

resource "aws_eks_node_group" "memory" {
  cluster_name    = aws_eks_cluster.ujamaa_prod.name
  node_group_name = "memory"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.private[*].id

  instance_types = ["r6i.2xlarge"]

  scaling_config {
    desired_size = 6
    max_size     = 15
    min_size     = 3
  }

  labels = {
    workload-type = "memory"
  }
}
```

## 3.2 Namespace Configuration

```yaml
# k8s/namespaces.yaml

apiVersion: v1
kind: Namespace
metadata:
  name: ujamaa-production
  labels:
    name: production
    istio-injection: enabled
  annotations:
    description: "UJAMAA DEFI PLATFORM Production Environment"
---
apiVersion: v1
kind: Namespace
metadata:
  name: ujamaa-staging
  labels:
    name: staging
    istio-injection: enabled
---
apiVersion: v1
kind: Namespace
metadata:
  name: ujamaa-development
  labels:
    name: development
    istio-injection: enabled
---
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
  labels:
    name: monitoring
---
apiVersion: v1
kind: Namespace
metadata:
  name: istio-system
  labels:
    name: istio-system
```

## 3.3 Service Deployment (FastAPI)

```yaml
# k8s/services/assets-service.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: assets-service
  namespace: ujamaa-production
  labels:
    app: assets-service
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: assets-service
      version: v1
  template:
    metadata:
      labels:
        app: assets-service
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8000"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: ujamaa-service-account
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchLabels:
                  app: assets-service
              topologyKey: kubernetes.io/hostname
      nodeSelector:
        workload-type: general
      tolerations:
      - key: "workload-type"
        operator: "Equal"
        value: "general"
        effect: "NO_SCHEDULE"
      containers:
      - name: assets-service
        image: ghcr.io/ujamaa-defi/assets-service:v1.0.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
          name: http
          protocol: TCP
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: LOG_LEVEL
          value: "INFO"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: postgres-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: cache-secrets
              key: redis-url
        - name: KAFKA_BOOTSTRAP_SERVERS
          value: "kafka-0.kafka-headless:9092,kafka-1.kafka-headless:9092,kafka-2.kafka-headless:9092"
        - name: BLOCKCHAIN_RPC_URL
          valueFrom:
            secretKeyRef:
              name: blockchain-secrets
              key: polygon-rpc
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "2000m"
            memory: "2Gi"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
      volumes:
      - name: config
        configMap:
          name: assets-service-config
---
apiVersion: v1
kind: Service
metadata:
  name: assets-service
  namespace: ujamaa-production
  labels:
    app: assets-service
spec:
  type: ClusterIP
  ports:
  - port: 8000
    targetPort: 8000
    protocol: TCP
    name: http
  selector:
    app: assets-service
---
apiVersion: policy/v1
kind: PodDisruLPionBudget
metadata:
  name: assets-service-pdb
  namespace: ujamaa-production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: assets-service
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: assets-service-hpa
  namespace: ujamaa-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: assets-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 15
      selectPolicy: Max
```

## 3.4 Istio Service Mesh Configuration

```yaml
# k8s/istio/virtual-service.yaml

apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ujamaa-api
  namespace: ujamaa-production
spec:
  hosts:
  - "api.ujamaa-defi.com"
  gateways:
  - ujamaa-gateway
  http:
  - match:
    - uri:
        prefix: /api/v1/assets
    route:
    - destination:
        host: assets-service
        port:
          number: 8000
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s
      retryOn: 5xx,reset,connect-failure
  - match:
    - uri:
        prefix: /api/v1/investors
    route:
    - destination:
        host: investors-service
        port:
          number: 8000
  - match:
    - uri:
        prefix: /api/v1/trades
    route:
    - destination:
        host: trades-service
        port:
          number: 8000
  - match:
    - uri:
        prefix: /api/v1/compliance
    route:
    - destination:
        host: compliance-service
        port:
          number: 8000
  - match:
    - uri:
        prefix: /api/v1/reports
    route:
    - destination:
        host: reporting-service
        port:
          number: 8000
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: assets-service
  namespace: ujamaa-production
spec:
  host: assets-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: UPGRADE
        http1MaxPendingRequests: 100
        http2MaxRequests: 1000
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
  subsets:
  - name: v1
    labels:
      version: v1
---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: ujamaa-production
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: require-jwt
  namespace: ujamaa-production
spec:
  selector:
    matchLabels:
      app: assets-service
  action: ALLOW
  rules:
  - from:
    - source:
        requestPrincipals: ["*"]
    to:
    - operation:
        methods: ["GET", "POST", "PUT", "DELETE"]
```

---

# 4. Terraform Infrastructure as Code

## 4.1 Terraform Project Structure

```
terraform/
├── backend.tf                 # Remote state (S3 + DynamoDB)
├── variables.tf               # Input variables
├── outputs.tf                 # Output values
├── providers.tf               # Provider configurations
├── versions.tf                # Version constraints
│
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── eks/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── rds/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── redis/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── kafka/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
│
├── environments/
│   ├── production/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   │   └── ...
│   └── development/
│       └── ...
│
└── scripts/
    ├── init.sh
    ├── plan.sh
    └── apply.sh
```

## 4.2 VPC Module

```hcl
# terraform/modules/vpc/main.tf

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_subnet" "private" {
  count             = var.az_count
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 1)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name        = "${var.environment}-private-${count.index + 1}"
    Environment = var.environment
    Type        = "private"
  }
}

resource "aws_subnet" "public" {
  count             = var.az_count
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.environment}-public-${count.index + 1}"
    Environment = var.environment
    Type        = "public"
  }
}

resource "aws_nat_gateway" "main" {
  count         = var.az_count
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name        = "${var.environment}-nat-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_eip" "nat" {
  count = var.az_count

  tags = {
    Name        = "${var.environment}-nat-eip-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_route_table" "private" {
  count  = var.az_count
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = {
    Name        = "${var.environment}-private-rt-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_route_table_association" "private" {
  count          = var.az_count
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}
```

## 4.3 RDS Module

```hcl
# terraform/modules/rds/main.tf

resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_db_parameter_group" "main" {
  name   = "${var.environment}-postgres-params"
  family = "postgres${var.postgres_version}"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"  # Log queries > 1 second
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  tags = {
    Name        = "${var.environment}-postgres-params"
    Environment = var.environment
  }
}

resource "aws_db_instance" "main" {
  identifier = "${var.environment}-ujamaa-db"

  engine         = "postgres"
  engine_version = var.postgres_version
  instance_class = var.instance_class

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.rds.arn

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name

  multi_az               = var.multi_az
  publicly_accessible    = false
  deletion_protection    = var.deletion_protection
  skip_final_snapshot    = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${var.environment}-final-snapshot"

  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  maintenance_window     = var.maintenance_window

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  performance_insights_enabled = true
  performance_insights_retention_period = 7

  tags = {
    Name        = "${var.environment}-ujamaa-db"
    Environment = var.environment
  }
}
```

---

# 5. CI/CD Pipelines

## 5.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml

name: Deploy to Kubernetes

on:
  push:
    branches: [main]
    tags:
      - 'v*'
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
        cache: 'pip'

    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install -r requirements-dev.txt

    - name: Run linting
      run: |
        flake8 .
        black --check .
        isort --check-only .

    - name: Run type checking
      run: |
        mypy .

    - name: Run tests
      run: |
        pytest --cov=. --cov-report=xml

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - uses: actions/checkout@v4

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging

    steps:
    - uses: actions/checkout@v4

    - name: Configure kubectl
      uses: azure/k8s-set-context@v3
      with:
        method: kubeconfig
        kubeconfig: ${{ secrets.KUBE_CONFIG_STAGING }}

    - name: Deploy to staging
      run: |
        kubectl apply -f k8s/namespaces.yaml
        kubectl apply -f k8s/configmaps/staging/
        kubectl apply -f k8s/secrets/staging/
        kubectl apply -f k8s/services/
        kubectl apply -f k8s/istio/

    - name: Wait for rollout
      run: |
        kubectl rollout status deployment/assets-service -n ujamaa-staging
        kubectl rollout status deployment/investors-service -n ujamaa-staging
        kubectl rollout status deployment/trades-service -n ujamaa-staging

    - name: Run smoke tests
      run: |
        python tests/smoke/staging_smoke_tests.py

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    environment: production

    steps:
    - uses: actions/checkout@v4

    - name: Configure kubectl
      uses: azure/k8s-set-context@v3
      with:
        method: kubeconfig
        kubeconfig: ${{ secrets.KUBE_CONFIG_PRODUCTION }}

    - name: Deploy to production
      run: |
        kubectl apply -f k8s/namespaces.yaml
        kubectl apply -f k8s/configmaps/production/
        kubectl apply -f k8s/secrets/production/
        kubectl apply -f k8s/services/
        kubectl apply -f k8s/istio/

    - name: Wait for rollout
      run: |
        kubectl rollout status deployment/assets-service -n ujamaa-production
        kubectl rollout status deployment/investors-service -n ujamaa-production
        kubectl rollout status deployment/trades-service -n ujamaa-production

    - name: Run smoke tests
      run: |
        python tests/smoke/production_smoke_tests.py

    - name: Notify Slack
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "Production deployment successful: ${{ github.ref }}"
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 5.2 ArgoCD Application

```yaml
# k8s/argocd/application.yaml

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ujamaa-production
  namespace: argocd
spec:
  project: ujamaa
  source:
    repoURL: https://github.com/ujamaa-defi/infrastructure.git
    targetRevision: HEAD
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: ujamaa-production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PruneLast=true
    - ApplyOutOfSyncOnly=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  ignoreDifferences:
  - group: apps
    kind: Deployment
    jsonPointers:
    - /spec/replicas
```

---

# 6. Environment Configuration

## 6.1 Environment Variables

```yaml
# k8s/configmaps/production/assets-service.yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: assets-service-config
  namespace: ujamaa-production
data:
  ENVIRONMENT: "production"
  LOG_LEVEL: "INFO"
  LOG_FORMAT: "json"
  
  # Database
  DATABASE_POOL_SIZE: "20"
  DATABASE_MAX_OVERFLOW: "10"
  DATABASE_POOL_TIMEOUT: "30"
  DATABASE_ECHO: "false"
  
  # Redis
  REDIS_MAX_CONNECTIONS: "50"
  REDIS_SOCKET_TIMEOUT: "5"
  REDIS_RETRY_ON_TIMEOUT: "true"
  
  # Kafka
  KAFKA_CONSUMER_GROUP: "assets-service-prod"
  KAFKA_AUTO_OFFSET_RESET: "earliest"
  KAFKA_ENABLE_AUTO_COMMIT: "false"
  
  # Blockchain
  BLOCKCHAIN_CHAIN_ID: "137"  # Polygon
  BLOCKCHAIN_CONFIRMATIONS: "3"
  BLOCKCHAIN_GAS_PRICE_BUFFER_BPS: "10"
  
  # Rate Limiting
  RATE_LIMIT_ENABLED: "true"
  RATE_LIMIT_DEFAULT_PER_MINUTE: "100"
  RATE_LIMIT_BURST: "30"
  
  # CORS
  CORS_ORIGINS: "https://ujamaa-defi.com,https://app.ujamaa-defi.com"
  CORS_ALLOW_CREDENTIALS: "true"
  
  # Security
  CSP_REPORT_URI: "/api/csp-report"
  HSTS_MAX_AGE: "31536000"
  HSTS_INCLUDE_SUBDOMAINS: "true"
  
  # Monitoring
  METRICS_ENABLED: "true"
  METRICS_PATH: "/metrics"
  TRACING_ENABLED: "true"
  TRACING_SAMPLE_RATE: "0.1"
  
  # Feature Flags
  FEATURE_SECONDARY_MARKET: "true"
  FEATURE_CROSS_CHAIN_BRIDGE: "true"
  FEATURE_AUTO_REBALANCE: "false"
```

## 6.2 Secrets Management

```yaml
# k8s/secrets/production/database-secrets.yaml (encrypted with SOPS)

apiVersion: v1
kind: Secret
metadata:
  name: database-secrets
  namespace: ujamaa-production
  annotations:
    sealedsecrets.bitnami.com/cluster-wide: "true"
type: Opaque
stringData:
  postgres-url: "postgresql://ujamaa:***@***.rds.amazonaws.com:5432/ujamaa_prod"
  postgres-username: "ujamaa"
  postgres-password: "***"
```

---

# 7. Monitoring & Observability

## 7.1 Prometheus Configuration

```yaml
# monitoring/prometheus/prometheus.yml

global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - alertmanager:9093

rule_files:
  - /etc/prometheus/rules/*.yml

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__

  - job_name: 'kubernetes-services'
    kubernetes_sd_configs:
    - role: service
    relabel_configs:
    - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
      action: keep
      regex: true

  - job_name: 'kafka'
    kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
        - kafka
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: kafka

  - job_name: 'postgresql'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: postgresql
```

## 7.2 Alert Rules

```yaml
# monitoring/prometheus/rules/alerts.yml

groups:
- name: ujamaa-alerts
  rules:
  - alert: ServiceDown
    expr: up{job="kubernetes-pods"} == 0
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Service {{ $labels.pod }} is down"
      description: "{{ $labels.pod }} has been down for more than 2 minutes."

  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{status=~"5.."}[5m])) 
      / sum(rate(http_requests_total[5m])) > 0.01
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value | humanizePercentage }}"

  - alert: HighLatency
    expr: |
      histogram_quantile(0.95, 
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
      ) > 1
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High latency detected"
      description: "95th percentile latency is {{ $value }}s"

  - alert: DatabaseConnectionsHigh
    expr: |
      pg_stat_activity_count / pg_settings_max_connections > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Database connections high"
      description: "{{ $value | humanizePercentage }} of connections in use"

  - alert: RedisMemoryHigh
    expr: |
      redis_memory_used_bytes / redis_memory_max_bytes > 0.85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Redis memory high"
      description: "{{ $value | humanizePercentage }} of memory in use"

  - alert: KafkaLagHigh
    expr: |
      kafka_consumer_group_lag > 10000
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Kafka consumer lag high"
      description: "Consumer group {{ $labels.group }} lag is {{ $value }}"

  - alert: BlockchainSyncBehind
    expr: |
      time() - blockchain_latest_block_timestamp > 300
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Blockchain sync behind"
      description: "Latest block is {{ $value | humanizeDuration }} old"
```

## 7.3 Grafana Dashboards

Dashboard JSON files stored in `monitoring/grafana/dashboards/`:

- `platform-overview.json` - High-level platform metrics
- `service-performance.json` - Per-service latency, throughput, errors
- `database-metrics.json` - PostgreSQL performance
- `cache-metrics.json` - Redis performance
- `kafka-metrics.json` - Kafka broker and consumer metrics
- `blockchain-metrics.json` - Blockchain sync status, gas prices
- `business-metrics.json` - AUM, transactions, investor counts

---

# 8. Secrets Management

## 8.1 HashiCorp Vault Integration

```hcl
# terraform/vault/main.tf

resource "vault_kubernetes_auth_backend" "eks" {
  kubernetes_host    = aws_eks_cluster.ujamaa_prod.endpoint
  kubernetes_ca_cert = base64decode(aws_eks_cluster.ujamaa_prod.certificate_authority[0].data)
}

resource "vault_kubernetes_auth_backend_role" "ujamaa" {
  backend                          = vault_kubernetes_auth_backend.eks.path
  role_name                        = "ujamaa-service"
  bound_service_account_names      = ["ujamaa-service-account"]
  bound_service_account_namespaces = ["ujamaa-production"]
  ttl                              = 3600

  token_policies = ["ujamaa-policy"]
}

resource "vault_mount" "secrets" {
  path        = "ujamaa-secrets"
  type        = "kv-v2"
  description = "UJAMAA DEFI PLATFORM secrets"
}

resource "vault_kv_secret_v2" "database" {
  mount      = vault_mount.secrets.path
  name       = "database"
  data_json  = jsonencode({
    username = "ujamaa"
    password = random_password.db_password.result
    host     = aws_db_instance.main.address
    port     = 5432
    database = "ujamaa_prod"
  })
}
```

## 8.2 External Secrets Operator

```yaml
# k8s/external-secrets/external-secret.yaml

apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-secrets
  namespace: ujamaa-production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: ClusterSecretStore
  target:
    name: database-secrets
    creationPolicy: Owner
  data:
  - secretKey: postgres-url
    remoteRef:
      key: ujamaa-secrets/database
      property: url
  - secretKey: postgres-username
    remoteRef:
      key: ujamaa-secrets/database
      property: username
  - secretKey: postgres-password
    remoteRef:
      key: ujamaa-secrets/database
      property: password
```

---

# 9. Backup & Recovery

## 9.1 Backup Strategy

| Component | Backup Method | Frequency | Retention | RPO | RTO |
|-----------|---------------|-----------|-----------|-----|-----|
| **PostgreSQL** | AWS RDS automated snapshots | Every 6 hours | 30 days | 6 hours | 1 hour |
| **PostgreSQL** | Continuous WAL archiving | Real-time | 7 days | 5 minutes | 30 minutes |
| **Redis** | RDB snapshots | Every hour | 7 days | 1 hour | 30 minutes |
| **Kafka** | Topic replication (3x) | Real-time | Per retention | 0 | 0 |
| **ConfigMaps/Secrets** | Git (version control) | Per change | Indefinite | 0 | 5 minutes |
| **Blockchain state** | Full node sync | N/A | N/A | N/A | 4 hours |

## 9.2 Disaster Recovery Procedures

```yaml
# runbooks/disaster-recovery.md

## DR Failover Procedure

### Trigger Conditions
- Primary region (AWS af-south-1) unavailable for > 30 minutes
- Data corruLPion requiring point-in-time recovery
- Security incident requiring isolation

### Failover Steps

1. **Assess Situation** (5 minutes)
   - Confirm primary region outage
   - Notify incident response team
   - Update status page

2. **DNS Failover** (5 minutes)
   - Update Route53 health check
   - Failover to GCP africa-south1
   - Verify DNS propagation

3. **Scale DR Environment** (10 minutes)
   - Scale GKE cluster to production capacity
   - Promote Cloud SQL read replica to primary
   - Verify connectivity

4. **Validate Services** (10 minutes)
   - Run health checks on all services
   - Verify database connectivity
   - Test critical user flows

5. **Communicate** (ongoing)
   - Update stakeholders
   - Post incident updates
   - Document timeline

### Failback Procedure

1. Wait for primary region recovery
2. Re-establish replication from DR to primary
3. Schedule maintenance window
4. Execute controlled failback
5. Validate and monitor
```

---

# 10. Scaling Procedures

## 10.1 Horizontal Pod Autoscaling

```yaml
# k8s/hpa/custom-metrics.yaml

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: trades-service-hpa
  namespace: ujamaa-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: trades-service
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
  - type: External
    external:
      metric:
        name: kafka_lag
        selector:
          matchLabels:
            consumer-group: trades-service
      target:
        type: AverageValue
        averageValue: "1000"
```

## 10.2 Cluster Autoscaling

```hcl
# terraform/eks/autoscaling.tf

resource "aws_autoscaling_group" "eks_nodes" {
  name                = "${var.cluster_name}-nodes"
  vpc_zone_identifier = var.subnet_ids
  target_group_arns   = aws_lb_target_group.eks[*].arn
  health_check_type   = "EC2"

  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.desired_size

  tag {
    key                 = "kubernetes.io/cluster/${var.cluster_name}"
    value               = "owned"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/enabled"
    value               = "true"
    propagate_at_launch = true
  }

  tag {
    key                 = "k8s.io/cluster-autoscaler/${var.cluster_name}"
    value               = "owned"
    propagate_at_launch = true
  }
}
```

## 10.3 Database Scaling

```hcl
# terraform/modules/rds/scaling.tf

resource "aws_db_instance" "main" {
  # ... other configuration
  
  # Read replicas for read scaling
  create_read_replica = var.create_read_replicas
  replicate_source_db = var.create_read_replicas ? null : aws_db_instance.main.identifier
  
  # Auto-scaling storage
  max_allocated_storage = 1000  # Auto-scale up to 1TB
  
  # Instance class updates (manual or via Terraform)
  # For zero-downtime upgrades, use blue-green deployment
}
```

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-27 | DevOps Lead | Initial release |

**Related Documents**

- `01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - Requirements specification
- `02_ARCHITECTURE_SPECIFICATION.md` - System architecture
- `05_SMART_CONTRACT_SPECIFICATION.md` - Smart contract deployment procedures
- `09_PRODUCT_ROADMAP.md` - Deployment timeline and milestones
- `07_MONITORING_SPECIFICATION.md` - Monitoring stack configuration
- `08_OPERATIONAL_RUNBOOKS.md` - Operational procedures and incident response

**Runbooks**

See `runbooks/` directory for detailed operational procedures:
- `runbooks/deployment.md` - Deployment procedures
- `runbooks/incident-response.md` - Incident handling
- `runbooks/disaster-recovery.md` - DR failover
- `runbooks/scaling.md` - Manual scaling procedures
- `runbooks/backup-restore.md` - Backup and restore operations

