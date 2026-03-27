# Monitoring & Observability Specification

## Ujamaa DeFi Platform Observability Stack

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** February 27, 2026
**Classification:** Technical / Operations
**Audience:** SREs, DevOps Engineers, Platform Engineers, On-Call Staff

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Monitoring Architecture](#2-monitoring-architecture)
3. [Prometheus Configuration](#3-prometheus-configuration)
4. [Metrics Specification](#4-metrics-specification)
5. [Alert Rules](#5-alert-rules)
6. [Grafana Dashboards](#6-grafana-dashboards)
7. [Logging with Loki](#7-logging-with-loki)
8. [Distributed Tracing](#8-distributed-tracing)
9. [Kubernetes Monitoring](#9-kubernetes-monitoring)
10. [Blockchain Monitoring](#10-blockchain-monitoring)
11. [SLO/SLI Framework](#11-slosli-framework)
12. [Runbooks](#12-runbooks)
13. [On-Call Operations](#13-on-call-operations)

---

# 1. Executive Summary

## 1.1 Monitoring Stack Overview

Ujamaa DeFi Platform implements a comprehensive observability stack based on the CNCF Prometheus/Grafana ecosystem:

| Component | Technology | Purpose | Deployment |
|-----------|------------|---------|------------|
| **Metrics Collection** | Prometheus 2.48 | Time-series metrics scraping, storage, alerting | Kubernetes (StatefulSet) |
| **Metrics Visualization** | Grafana 10.2 | Dashboards, alerting, data exploration | Kubernetes (Deployment) |
| **Log Aggregation** | Loki 2.9 | Log collection, indexing, querying | Kubernetes (StatefulSet) |
| **Distributed Tracing** | Tempo 2.3 / Jaeger | Trace collection, visualization | Kubernetes (StatefulSet) |
| **Alert Management** | Alertmanager 0.26 | Alert routing, deduplication, silencing | Kubernetes (StatefulSet) |
| **Service Discovery** | Kubernetes SD + Consul | Automatic target discovery | Built-in |
| **Long-term Storage** | Thanos 0.32 / Mimir | Metrics retention, global view | Multi-cluster |
| **On-Call Management** | PagerDuty / Opsgenie | Incident escalation, rotation | SaaS |

## 1.2 Monitoring Tiers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MONITORING PYRAMID                                    │
│                                                                              │
│                              ┌───────┐                                       │
│                              │  SLO  │  Business outcomes, user satisfaction │
│                              └───────┘                                       │
│                           ┌───────────┐                                      │
│                           │  Alerts   │  Actionable pages, runbooks          │
│                           └───────────┘                                      │
│                        ┌─────────────────┐                                   │
│                        │   Dashboards    │  Visualization, exploration        │
│                        └─────────────────┘                                   │
│                     ┌─────────────────────┐                                  │
│                     │      Metrics        │  RED, USE, business metrics       │
│                     └─────────────────────┘                                  │
│                  ┌─────────────────────────┐                                 │
│                  │       Logs + Traces     │  Debugging, root cause          │
│                  └─────────────────────────┘                                 │
│                                                                              │
│  Data Volume:     Logs > Traces > Metrics                                    │
│  Query Cost:      Logs > Traces > Metrics                                    │
│  Retention:       Metrics > Logs > Traces                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 1.3 Key Monitoring Requirements

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| **Metrics Retention** | 90 days hot, 1 year cold | Prometheus + Thanos |
| **Scrape Interval** | 15s default, 5s critical | Per-job configuration |
| **Alert Latency** | <60s from incident to page | Alertmanager + PagerDuty |
| **Dashboard Refresh** | <5s for real-time panels | Grafana streaming |
| **Log Query** | <10s for 24h search | Loki indexing |
| **Trace Query** | <5s for trace lookup | Tempo indexing |
| **Data Points** | 1M+ samples/second | Prometheus sharding |

---

# 2. Monitoring Architecture

## 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         MONITORING ARCHITECTURE                                   │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                      DATA SOURCES (Kubernetes Cluster)                      │ │
│  │                                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │   FastAPI    │  │   FastAPI    │  │   FastAPI    │  │   FastAPI    │   │ │
│  │  │   Assets     │  │   Investors  │  │   Trades     │  │   Compliance │   │ │
│  │  │   :8000      │  │   :8001      │  │   :8002      │  │   :8003      │   │ │
│  │  │   /metrics   │  │   /metrics   │  │   /metrics   │  │   /metrics   │   │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │ │
│  │         │                 │                 │                 │            │ │
│  │  ┌──────▼─────────────────▼─────────────────▼─────────────────▼───────┐   │ │
│  │  │                    Istio Service Mesh (Envoy)                       │   │ │
│  │  │         • Request metrics (HTTP/gRPC)                               │   │ │
│  │  │         • Latency histograms                                        │   │ │
│  │  │         • Error rates                                               │   │ │
│  │  └──────┬──────────────────────────────────────────────────────────────┘   │ │
│  │         │                                                                   │ │
│  │  ┌──────▼──────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Node Exporter (per node)                          │   │ │
│  │  │         • CPU, Memory, Disk, Network                                 │   │ │
│  │  └──────┬──────────────────────────────────────────────────────────────┘   │ │
│  │         │                                                                   │ │
│  │  ┌──────▼──────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Kubernetes Components                             │   │ │
│  │  │         • API Server, Scheduler, Controller Manager                  │   │ │
│  │  │         • Kubelet, Kube-proxy                                        │   │ │
│  │  │         • CoreDNS, Etcd                                              │   │ │
│  │  └──────┬──────────────────────────────────────────────────────────────┘   │ │
│  │         │                                                                   │ │
│  │  ┌──────▼──────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Stateful Services                                 │   │ │
│  │  │         • PostgreSQL (RDS/Cloud SQL)                                 │   │ │
│  │  │         • Redis (ElastiCache/Memorystore)                            │   │ │
│  │  │         • Kafka (MSK)                                                │   │ │
│  │  └──────┬──────────────────────────────────────────────────────────────┘   │ │
│  │         │                                                                   │ │
│  │  ┌──────▼──────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Blockchain Nodes                                  │   │ │
│  │  │         • Polygon RPC                                                │   │ │
│  │  │         • Ethereum RPC                                               │   │ │
│  │  │         • Custom exporters                                           │   │ │
│  │  └──────────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│                                   ▼                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                      PROMETHEUS CLUSTER                                     │ │
│  │                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Prometheus Primary (StatefulSet)                  │   │ │
│  │  │                                                                      │   │ │
│  │  │  • Scrape interval: 15s (default), 5s (critical)                     │   │ │
│  │  │  • Retention: 15 days local                                          │   │ │
│  │  │  • TSDB blocks: 2h duration                                          │   │ │
│  │  │  • Remote write to Thanos                                            │   │ │
│  │  │  • Rules evaluation: 30s                                             │   │ │
│  │  │                                                                      │   │ │
│  │  │  Resource Allocation:                                                │   │ │
│  │  │  • CPU: 4 cores request, 8 cores limit                               │   │ │
│  │  │  • Memory: 16Gi request, 32Gi limit                                  │   │ │
│  │  │  • Storage: 500Gi PVC (SSD)                                          │   │ │
│  │  └─────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Prometheus Secondary (HA Pair)                    │   │ │
│  │  │         Same configuration as primary                                │   │ │
│  │  └─────────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│                                   ▼                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                      THANOS (Long-term Storage)                             │ │
│  │                                                                             │ │
│  │  • Sidecar: Uploads TSDB blocks to S3/GCS                                  │ │
│  │  • Store Gateway: Queries object storage                                   │ │
│  │  • Query: Global query layer (PromQL)                                      │ │
│  │  • Compactor: Downsampling (5m, 1h), retention                             │ │
│  │  • Ruler: Recording rules, alerts                                          │ │
│  │                                                                             │ │
│  │  Retention Policy:                                                          │ │
│  │  • Raw data: 90 days                                                       │ │
│  │  • 5m downsampled: 1 year                                                  │ │
│  │  • 1h downsampled: 5 years                                                 │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│              ┌────────────────────┼────────────────────┐                       │
│              ▼                    ▼                    ▼                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐             │
│  │     Grafana      │  │   Alertmanager   │  │      Loki        │             │
│  │   (Dashboards)   │  │    (Alerting)    │  │     (Logs)       │             │
│  │                  │  │                  │  │                  │             │
│  │  • 20+ dashboards│  │  • Routing       │  │  • Promtail      │             │
│  │  • 200+ panels   │  │  • Deduplication │  │  • Log collection│             │
│  │  • 50+ alerts    │  │  • Silencing     │  │  • 30d retention │             │
│  │                  │  │  • Inhibition    │  │                  │             │
│  │  Resource:       │  │  Resource:       │  │  Resource:       │             │
│  │  • 2 cores, 4Gi  │  │  • 1 core, 2Gi   │  │  • 4 cores, 16Gi │             │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘             │
│                                   │                                             │
│                                   ▼                                             │
│                          ┌─────────────────┐                                    │
│                          │   PagerDuty     │                                    │
│                          │   (Escalation)  │                                    │
│                          └─────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Network Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MONITORING NETWORK TOPOLOGY                           │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    Monitoring Namespace (istio-system)                  │ │
│  │                                                                         │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │ │
│  │  │                    Prometheus Service                             │  │ │
│  │  │                                                                   │  │ │
│  │  │  ClusterIP: 10.100.50.10:9090                                     │  │ │
│  │  │  NodePort: 30090                                                  │  │ │
│  │  │                                                                   │  │ │
│  │  │  Access:                                                          │  │ │
│  │  │  • Internal: All pods via ClusterIP                               │  │ │
│  │  │  • External: Via Istio Ingress (auth required)                    │  │ │
│  │  │  • Federated: Thanos Query                                        │  │ │
│  │  └──────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                         │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │ │
│  │  │                    Grafana Service                                │  │ │
│  │  │                                                                   │  │ │
│  │  │  ClusterIP: 10.100.50.11:3000                                     │  │ │
│  │  │  Ingress: monitoring.ujamaa-defi.com                              │  │ │
│  │  │                                                                   │  │ │
│  │  │  Authentication:                                                  │  │ │
│  │  │  • OAuth2 (Google SSO)                                            │  │ │
│  │  │  • LDAP (internal users)                                          │  │ │
│  │  │  • API Keys (automation)                                          │  │ │
│  │  └──────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                         │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │ │
│  │  │                    Alertmanager Service                           │  │ │
│  │  │                                                                   │  │ │
│  │  │  ClusterIP: 10.100.50.12:9093                                     │  │ │
│  │  │  Ingress: alertmanager.ujamaa-defi.com                            │  │ │
│  │  │                                                                   │  │ │
│  │  │  Receivers:                                                       │  │ │
│  │  │  • PagerDuty (critical)                                           │  │ │
│  │  │  • Slack (warning, info)                                          │  │ │
│  │  │  • Email (daily digest)                                           │  │ │
│  │  └──────────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Firewall Rules:                                                             │
│  • Allow 9090 from Kubernetes pods                                          │
│  • Allow 3000 from corporate network                                        │
│  • Allow 9093 from Prometheus only                                          │
│  • Deny all other inbound                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 3. Prometheus Configuration

## 3.1 Main Configuration

```yaml
# monitoring/prometheus/prometheus.yml

global:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_timeout: 10s
  external_labels:
    cluster: production
    region: af-south-1
    environment: production

# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - alertmanager:9093
    scheme: http
    timeout: 10s
    api_version: v2

# Rule files
rule_files:
  - /etc/prometheus/rules/alerts/*.yml
  - /etc/prometheus/rules/recording/*.yml

# Scrape configurations
scrape_configs:
  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
    - targets: ['localhost:9090']
    metrics_path: /metrics
    scheme: http
    scrape_interval: 5s  # High-frequency self-monitoring

  # Kubernetes API server
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
    - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      insecure_skip_verify: false
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
    - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
      action: keep
      regex: default;kubernetes;https

  # Kubernetes nodes (kubelet)
  - job_name: 'kubernetes-nodes'
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      insecure_skip_verify: true
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    kubernetes_sd_configs:
    - role: node
    relabel_configs:
    - action: labelmap
      regex: __meta_kubernetes_node_label_(.+)
    - target_label: __address__
      replacement: kubernetes.default.svc:443
    - source_labels: [__meta_kubernetes_node_name]
      regex: (.+)
      target_label: __metrics_path__
      replacement: /api/v1/nodes/${1}/proxy/metrics

  # Kubernetes nodes (cAdvisor)
  - job_name: 'kubernetes-nodes-cadvisor'
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      insecure_skip_verify: true
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    kubernetes_sd_configs:
    - role: node
    relabel_configs:
    - action: labelmap
      regex: __meta_kubernetes_node_label_(.+)
    - target_label: __address__
      replacement: kubernetes.default.svc:443
    - source_labels: [__meta_kubernetes_node_name]
      regex: (.+)
      target_label: __metrics_path__
      replacement: /api/v1/nodes/${1}/proxy/metrics/cadvisor

  # Kubernetes service discovery (pods)
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
    - action: labelmap
      regex: __meta_kubernetes_pod_annotation_(.+)
      replacement: $1
    - action: labelmap
      regex: __meta_kubernetes_pod_label_(.+)
      replacement: pod_$1
    - source_labels: [__meta_kubernetes_namespace]
      target_label: namespace
    - source_labels: [__meta_kubernetes_pod_name]
      target_label: pod
    - source_labels: [__meta_kubernetes_pod_container_name]
      target_label: container

  # Kubernetes service discovery (services)
  - job_name: 'kubernetes-services'
    kubernetes_sd_configs:
    - role: service
    metrics_path: /probe
    params:
      module: [http_2xx]
    relabel_configs:
    - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_probe]
      action: keep
      regex: true
    - source_labels: [__address__]
      target_label: __param_target
    - target_label: __address__
      replacement: blackbox-exporter:9115
    - source_labels: [__param_target]
      target_label: instance
    - action: labelmap
      regex: __meta_kubernetes_service_annotation_(.+)
      replacement: $1
    - source_labels: [__meta_kubernetes_namespace]
      target_label: namespace
    - source_labels: [__meta_kubernetes_service_name]
      target_label: service

  # FastAPI services (ujamaa-production namespace)
  - job_name: 'fastapi-services'
    kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
        - ujamaa-production
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: .+-service
    - source_labels: [__meta_kubernetes_pod_container_port_number]
      action: keep
      regex: 800[0-4]
    - source_labels: [__meta_kubernetes_pod_label_app]
      target_label: service
    - source_labels: [__meta_kubernetes_pod_label_version]
      target_label: version
    - action: labelmap
      regex: __meta_kubernetes_pod_label_(.+)
      replacement: $1
    - source_labels: [__meta_kubernetes_namespace]
      target_label: namespace
    - source_labels: [__meta_kubernetes_pod_name]
      target_label: pod
    metric_relabel_configs:
    - source_labels: [__name__]
      regex: 'go_.*'
      action: drop
    - source_labels: [__name__]
      regex: 'process_.*'
      action: drop

  # Istio service mesh
  - job_name: 'istio-mesh'
    kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
        - istio-system
        - ujamaa-production
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_container_port_name]
      action: keep
      regex: http-monitoring
    - source_labels: [__meta_kubernetes_pod_label_app]
      target_label: component
    - source_labels: [__meta_kubernetes_namespace]
      target_label: namespace

  # Node Exporter
  - job_name: 'node-exporter'
    static_configs:
    - targets: ['node-exporter:9100']
    relabel_configs:
    - source_labels: [__address__]
      target_label: instance

  # Kafka (MSK or self-managed)
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
    - source_labels: [__meta_kubernetes_pod_container_port_number]
      action: keep
      regex: 9092|9094
    - source_labels: [__meta_kubernetes_pod_name]
      target_label: broker

  # PostgreSQL (via postgres-exporter sidecar)
  - job_name: 'postgresql'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: postgresql
    - source_labels: [__meta_kubernetes_pod_container_port_number]
      action: keep
      regex: 9187
    - source_labels: [__meta_kubernetes_pod_name]
      target_label: instance

  # Redis (via redis-exporter sidecar)
  - job_name: 'redis'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: redis
    - source_labels: [__meta_kubernetes_pod_container_port_number]
      action: keep
      regex: 9121
    - source_labels: [__meta_kubernetes_pod_name]
      target_label: instance

  # Blockchain exporters
  - job_name: 'blockchain-polygon'
    static_configs:
    - targets: ['blockchain-exporter-polygon:9500']
      labels:
        blockchain: polygon
        network: mainnet
    scrape_interval: 10s  # Higher frequency for chain data

  - job_name: 'blockchain-ethereum'
    static_configs:
    - targets: ['blockchain-exporter-ethereum:9500']
      labels:
        blockchain: ethereum
        network: mainnet
    scrape_interval: 30s  # Slower due to block times

  # Blackbox exporter (endpoint health)
  - job_name: 'blackbox'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
    - targets:
      - https://api.ujamaa-defi.com/health/live
      - https://api.ujamaa-defi.com/health/ready
      - https://monitoring.ujamaa-defi.com
      - https://app.ujamaa-defi.com
    relabel_configs:
    - source_labels: [__address__]
      target_label: __param_target
    - source_labels: [__param_target]
      target_label: instance
    - target_label: __address__
      replacement: blackbox-exporter:9115

# Remote write to Thanos
remote_write:
- url: http://thanos-receive:19291/api/v1/receive
  queue_config:
    max_samples_per_send: 10000
    max_shards: 200
    capacity: 25000
  write_relabel_configs:
  - source_labels: [__name__]
    regex: 'go_.*'
    action: drop
```

## 3.2 Kubernetes Deployment

```yaml
# monitoring/prometheus/deployment.yaml

apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
  labels:
    name: monitoring
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    # (Configuration from above)
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: prometheus
  namespace: monitoring
  labels:
    app: prometheus
spec:
  serviceName: prometheus
  replicas: 2  # HA pair
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
      annotations:
        prometheus.io/scrape: "false"  # Don't scrape Prometheus itself via SD
    spec:
      serviceAccountName: prometheus
      securityContext:
        fsGroup: 65534
        runAsNonRoot: true
        runAsUser: 65534
      initContainers:
      - name: init-chmod-data
        image: busybox:1.36
        command: ['sh', '-c']
        args:
        - |
          chown -R 65534:65534 /prometheus
          mkdir -p /prometheus/rules/alerts
          mkdir -p /prometheus/rules/recording
          chown -R 65534:65534 /prometheus/rules
        volumeMounts:
        - name: prometheus-data
          mountPath: /prometheus
      containers:
      - name: prometheus
        image: prom/prometheus:v2.48.1
        args:
        - --config.file=/etc/prometheus/prometheus.yml
        - --storage.tsdb.path=/prometheus
        - --storage.tsdb.retention.time=15d
        - --storage.tsdb.retention.size=400GB
        - --web.enable-lifecycle
        - --web.enable-admin-api
        - --web.route-prefix=/
        - --web.external-url=https://prometheus.ujamaa-defi.com
        - --storage.tsdb.min-block-duration=2h
        - --storage.tsdb.max-block-duration=2h
        - --log.level=info
        - --log.format=logfmt
        ports:
        - containerPort: 9090
          name: http
          protocol: TCP
        - containerPort: 9090
          name: grpc
          protocol: TCP
        readinessProbe:
          httpGet:
            path: /-/ready
            port: 9090
            scheme: HTTP
          initialDelaySeconds: 30
          periodSeconds: 5
          timeoutSeconds: 5
          failureThreshold: 3
        livenessProbe:
          httpGet:
            path: /-/healthy
            port: 9090
            scheme: HTTP
          initialDelaySeconds: 30
          periodSeconds: 15
          timeoutSeconds: 5
          failureThreshold: 3
        resources:
          requests:
            cpu: 4000m
            memory: 16Gi
          limits:
            cpu: 8000m
            memory: 32Gi
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
        - name: prometheus-data
          mountPath: /prometheus
        - name: prometheus-rules
          mountPath: /etc/prometheus/rules
      - name: thanos-sidecar
        image: thanosio/thanos:v0.32.5
        args:
        - sidecar
        - --prometheus.url=http://localhost:9090
        - --grpc-address=:10901
        - --http-address=:10902
        - --objstore.config=$(OBJSTORE_CONFIG)
        - --tsdb.path=/prometheus
        - --log.level=info
        env:
        - name: OBJSTORE_CONFIG
          valueFrom:
            secretKeyRef:
              name: thanos-objstore-config
              key: objstore.yml
        ports:
        - containerPort: 10901
          name: grpc
        - containerPort: 10902
          name: http
        resources:
          requests:
            cpu: 1000m
            memory: 2Gi
          limits:
            cpu: 2000m
            memory: 4Gi
        volumeMounts:
        - name: prometheus-data
          mountPath: /prometheus
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
      - name: prometheus-rules
        configMap:
          name: prometheus-rules
      - name: prometheus-data
        persistentVolumeClaim:
          claimName: prometheus-data
  volumeClaimTemplates:
  - metadata:
      name: prometheus-data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: gp3
      resources:
        requests:
          storage: 500Gi
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: monitoring
  labels:
    app: prometheus
spec:
  type: ClusterIP
  clusterIP: None  # Headless for StatefulSet
  ports:
  - port: 9090
    targetPort: 9090
    protocol: TCP
    name: http
  - port: 10901
    targetPort: 10901
    protocol: TCP
    name: grpc
  - port: 10902
    targetPort: 10902
    protocol: TCP
    name: sidecar
  selector:
    app: prometheus
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
  namespace: monitoring
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
- apiGroups: [""]
  resources:
  - nodes
  - nodes/proxy
  - services
  - endpoints
  - pods
  verbs: ["get", "list", "watch"]
- apiGroups: ["extensions"]
  resources:
  - ingresses
  verbs: ["get", "list", "watch"]
- nonResourceURLs: ["/metrics"]
  verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
- kind: ServiceAccount
  name: prometheus
  namespace: monitoring
```

---

# 4. Metrics Specification

## 4.1 Metric Categories

Ujamaa DeFi Platform implements the **RED Method** for services and **USE Method** for infrastructure:

| Category | Metrics | Purpose |
|----------|---------|---------|
| **RED (Services)** | Rate, Errors, Duration | User-facing service health |
| **USE (Infrastructure)** | Utilization, Saturation, Errors | Resource health |
| **Business** | AUM, transactions, investors | Business KPIs |
| **Blockchain** | Block lag, gas, contracts | Chain health |

## 4.2 Application Metrics (FastAPI Services)

### HTTP Request Metrics

```python
# metrics.py - FastAPI Prometheus metrics

from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from prometheus_client import REGISTRY
from fastapi import Request, Response
import time
import functools

# RED Metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['service', 'method', 'handler', 'status', 'namespace']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['service', 'method', 'handler', 'namespace'],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

http_requests_in_flight = Gauge(
    'http_requests_in_flight',
    'Number of HTTP requests currently being processed',
    ['service', 'handler', 'namespace']
)

# Business Metrics
asset_tokenization_total = Counter(
    'asset_tokenization_total',
    'Total number of assets tokenized',
    ['asset_class', 'blockchain', 'status']
)

investor_onboarding_total = Counter(
    'investor_onboarding_total',
    'Total investor onboarding attempts',
    ['status', 'jurisdiction', 'investor_type']
)

transaction_volume_usd = Counter(
    'transaction_volume_usd',
    'Total transaction volume in USD',
    ['type', 'asset_class', 'blockchain']
)

compliance_checks_total = Counter(
    'compliance_checks_total',
    'Total compliance checks performed',
    ['check_type', 'result', 'asset_id']
)

# Database Metrics
db_query_duration_seconds = Histogram(
    'db_query_duration_seconds',
    'Database query duration in seconds',
    ['service', 'query_type', 'table'],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
)

db_connections_active = Gauge(
    'db_connections_active',
    'Number of active database connections',
    ['service', 'pool']
)

# Cache Metrics
cache_hits_total = Counter(
    'cache_hits_total',
    'Total cache hits',
    ['service', 'cache_type']
)

cache_misses_total = Counter(
    'cache_misses_total',
    'Total cache misses',
    ['service', 'cache_type']
)

cache_operation_duration_seconds = Histogram(
    'cache_operation_duration_seconds',
    'Cache operation duration in seconds',
    ['service', 'operation', 'cache_type'],
    buckets=[0.0005, 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5]
)

# Kafka Metrics
kafka_messages_produced_total = Counter(
    'kafka_messages_produced_total',
    'Total Kafka messages produced',
    ['service', 'topic']
)

kafka_messages_consumed_total = Counter(
    'kafka_messages_consumed_total',
    'Total Kafka messages consumed',
    ['service', 'topic', 'consumer_group']
)

kafka_consumer_lag = Gauge(
    'kafka_consumer_lag',
    'Kafka consumer lag (messages behind)',
    ['service', 'topic', 'partition', 'consumer_group']
)

kafka_message_processing_duration_seconds = Histogram(
    'kafka_message_processing_duration_seconds',
    'Kafka message processing duration in seconds',
    ['service', 'topic', 'consumer_group'],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

# Middleware for automatic metrics collection
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    
    # Extract handler name
    handler = request.url.path
    service = request.app.title
    namespace = "ujamaa-production"
    
    http_requests_in_flight.labels(
        service=service,
        handler=handler,
        namespace=namespace
    ).inc()
    
    try:
        response = await call_next(request)
        
        duration = time.time() - start_time
        
        http_requests_total.labels(
            service=service,
            method=request.method,
            handler=handler,
            status=response.status_code,
            namespace=namespace
        ).inc()
        
        http_request_duration_seconds.labels(
            service=service,
            method=request.method,
            handler=handler,
            namespace=namespace
        ).observe(duration)
        
        return response
    finally:
        http_requests_in_flight.labels(
            service=service,
            handler=handler,
            namespace=namespace
        ).dec()

# Metrics endpoint
async def metrics_endpoint():
    return Response(
        content=generate_latest(REGISTRY),
        media_type=CONTENT_TYPE_LATEST
    )
```

## 4.3 Infrastructure Metrics

### Node Exporter Metrics (Selected)

| Metric | Description | Query Example |
|--------|-------------|---------------|
| `node_cpu_seconds_total` | CPU time spent | `rate(node_cpu_seconds_total{mode="idle"}[5m])` |
| `node_memory_MemAvailable_bytes` | Available memory | `node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes` |
| `node_filesystem_avail_bytes` | Disk space available | `node_filesystem_avail_bytes / node_filesystem_size_bytes` |
| `node_network_receive_bytes_total` | Network received | `rate(node_network_receive_bytes_total[5m])` |
| `node_disk_io_time_seconds_total` | Disk I/O time | `rate(node_disk_io_time_seconds_total[5m])` |

### Kubernetes Metrics

| Metric | Description | Query Example |
|--------|-------------|---------------|
| `kube_pod_status_phase` | Pod phase | `kube_pod_status_phase{phase="Running"}` |
| `kube_pod_container_status_waiting` | Container waiting | `kube_pod_container_status_waiting == 1` |
| `kube_pod_container_status_restarts_total` | Container restarts | `increase(kube_pod_container_status_restarts_total[1h])` |
| `kube_deployment_status_replicas_available` | Deployment replicas | `kube_deployment_status_replicas_available / kube_deployment_spec_replicas` |
| `kube_hpa_status_current_replicas` | HPA current replicas | `kube_hpa_status_current_replicas` |

## 4.4 Blockchain Metrics

```python
# blockchain_exporter.py

from prometheus_client import Gauge, Counter, Histogram
import web3
import time

# Blockchain state
blockchain_latest_block_number = Gauge(
    'blockchain_latest_block_number',
    'Latest block number on blockchain',
    ['blockchain', 'network']
)

blockchain_sync_lag_blocks = Gauge(
    'blockchain_sync_lag_blocks',
    'Number of blocks behind latest (sync lag)',
    ['blockchain', 'network']
)

blockchain_block_time_seconds = Histogram(
    'blockchain_block_time_seconds',
    'Time between blocks in seconds',
    ['blockchain', 'network'],
    buckets=[1, 2, 5, 10, 15, 20, 30, 45, 60, 90, 120]
)

# Gas metrics
blockchain_gas_price_gwei = Gauge(
    'blockchain_gas_price_gwei',
    'Current gas price in Gwei',
    ['blockchain', 'network', 'percentile']
)

blockchain_gas_used_ratio = Gauge(
    'blockchain_gas_used_ratio',
    'Gas used / gas limit ratio per block',
    ['blockchain', 'network']
)

# Smart contract metrics
smart_contract_calls_total = Counter(
    'smart_contract_calls_total',
    'Total smart contract function calls',
    ['blockchain', 'contract', 'function', 'status']
)

smart_contract_events_total = Counter(
    'smart_contract_events_total',
    'Total smart contract events emitted',
    ['blockchain', 'contract', 'event_type']
)

smart_contract_balance = Gauge(
    'smart_contract_balance',
    'Token balance in smart contract',
    ['blockchain', 'contract', 'token']
)

# Transaction metrics
blockchain_transactions_pending = Gauge(
    'blockchain_transactions_pending',
    'Number of pending transactions in mempool',
    ['blockchain', 'network']
)

blockchain_transaction_confirmation_time_seconds = Histogram(
    'blockchain_transaction_confirmation_time_seconds',
    'Time to transaction confirmation',
    ['blockchain', 'network'],
    buckets=[5, 10, 15, 30, 45, 60, 90, 120, 180, 300, 600]
)

# Bridge metrics
bridge_locked_tokens = Gauge(
    'bridge_locked_tokens',
    'Number of tokens locked in bridge',
    ['blockchain', 'token', 'direction']
)

bridge_transfer_total = Counter(
    'bridge_transfer_total',
    'Total bridge transfers',
    ['source_chain', 'destination_chain', 'status']
)

bridge_transfer_duration_seconds = Histogram(
    'bridge_transfer_duration_seconds',
    'Time for cross-chain transfer',
    ['source_chain', 'destination_chain'],
    buckets=[60, 120, 180, 300, 420, 600, 900, 1200, 1800, 3600]
)

async def collect_blockchain_metrics():
    """Collect blockchain metrics periodically."""
    w3 = web3.Web3(web3.Web3.HTTPProvider(RPC_URL))
    
    while True:
        try:
            # Get latest block
            latest_block = w3.eth.get_block('latest')
            
            blockchain_latest_block_number.labels(
                blockchain='polygon',
                network='mainnet'
            ).set(latest_block['number'])
            
            # Calculate block time
            if latest_block['number'] > 0:
                prev_block = w3.eth.get_block(latest_block['number'] - 1)
                block_time = latest_block['timestamp'] - prev_block['timestamp']
                blockchain_block_time_seconds.labels(
                    blockchain='polygon',
                    network='mainnet'
                ).observe(block_time)
            
            # Gas price
            gas_price = w3.eth.gas_price / 1e9  # Convert to Gwei
            blockchain_gas_price_gwei.labels(
                blockchain='polygon',
                network='mainnet',
                percentile='50'
            ).set(gas_price)
            
            # Gas used ratio
            gas_used_ratio = latest_block['gasUsed'] / latest_block['gasLimit']
            blockchain_gas_used_ratio.labels(
                blockchain='polygon',
                network='mainnet'
            ).set(gas_used_ratio)
            
        except Exception as e:
            logger.error(f"Error collecting blockchain metrics: {e}")
        
        await asyncio.sleep(10)  # Collect every 10 seconds
```

## 4.5 Business Metrics

```python
# business_metrics.py

from prometheus_client import Gauge, Counter, Summary

# AUM metrics
total_aum_usd = Gauge(
    'total_aum_usd',
    'Total Assets Under Management in USD',
    ['asset_class']
)

asset_aum_usd = Gauge(
    'asset_aum_usd',
    'AUM per asset',
    ['asset_id', 'asset_name', 'asset_class']
)

# Investor metrics
total_investors = Gauge(
    'total_investors',
    'Total number of verified investors',
    ['status', 'jurisdiction']
)

investors_by_type = Gauge(
    'investors_by_type',
    'Number of investors by type',
    ['investor_type']
)

kyc_applications = Gauge(
    'kyc_applications',
    'KYC applications in pipeline',
    ['status']
)

kyc_processing_time_seconds = Histogram(
    'kyc_processing_time_seconds',
    'Time to process KYC application',
    buckets=[60, 300, 900, 1800, 3600, 7200, 14400, 28800, 86400, 172800]
)

# Transaction metrics
transactions_24h_total = Gauge(
    'transactions_24h_total',
    'Number of transactions in last 24 hours',
    ['type', 'blockchain']
)

transactions_24h_volume_usd = Gauge(
    'transactions_24h_volume_usd',
    'Transaction volume in USD in last 24 hours',
    ['type', 'blockchain']
)

transaction_value_usd = Histogram(
    'transaction_value_usd',
    'Transaction value in USD',
    ['type', 'asset_class'],
    buckets=[10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]
)

# Compliance metrics
compliance_alerts_active = Gauge(
    'compliance_alerts_active',
    'Number of active compliance alerts',
    ['severity', 'type']
)

transfers_blocked_total = Counter(
    'transfers_blocked_total',
    'Total transfers blocked by compliance',
    ['reason', 'asset_id']
)

aml_screenings_total = Counter(
    'aml_screenings_total',
    'Total AML screenings performed',
    ['result', 'risk_level']
)

# Distribution metrics
distributions_pending = Gauge(
    'distributions_pending',
    'Number of pending distributions',
    ['asset_id', 'distribution_type']
)

distributions_paid_total = Counter(
    'distributions_paid_total',
    'Total distributions paid',
    ['asset_id', 'distribution_type']
)

distributions_amount_usd = Counter(
    'distributions_amount_usd',
    'Total distribution amount in USD',
    ['asset_id', 'distribution_type']
)
```

---

# 5. Alert Rules

## 5.1 Alert Configuration

```yaml
# monitoring/prometheus/rules/alerts/infrastructure.yml

groups:
- name: infrastructure-alerts
  interval: 30s
  rules:
  
  # Node alerts
  - alert: NodeDown
    expr: up{job="kubernetes-nodes"} == 0
    for: 2m
    labels:
      severity: critical
      team: infrastructure
    annotations:
      summary: "Node {{ $labels.node }} is down"
      description: "Node {{ $labels.node }} has been unreachable for more than 2 minutes."
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/node-down"
      dashboard: "https://grafana.ujamaa-defi.com/d/node-overview"
  
  - alert: NodeCPUHigh
    expr: |
      100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 10m
    labels:
      severity: warning
      team: infrastructure
    annotations:
      summary: "High CPU usage on {{ $labels.instance }}"
      description: "CPU usage is {{ $value | humanize }}% on node {{ $labels.instance }}"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/node-cpu-high"
  
  - alert: NodeMemoryHigh
    expr: |
      (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
    for: 10m
    labels:
      severity: warning
      team: infrastructure
    annotations:
      summary: "High memory usage on {{ $labels.instance }}"
      description: "Memory usage is {{ $value | humanize }}% on node {{ $labels.instance }}"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/node-memory-high"
  
  - alert: NodeDiskFull
    expr: |
      (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 15
    for: 30m
    labels:
      severity: critical
      team: infrastructure
    annotations:
      summary: "Disk space critical on {{ $labels.instance }}"
      description: "Disk space is {{ $value | humanize }}% available on {{ $labels.instance }}"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/node-disk-full"
  
  - alert: NodeNetworkUnreachable
    expr: |
      probe_success{job="blackbox"} == 0
    for: 2m
    labels:
      severity: critical
      team: infrastructure
    annotations:
      summary: "Network endpoint unreachable: {{ $labels.instance }}"
      description: "Endpoint {{ $labels.instance }} has been unreachable for 2 minutes"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/network-unreachable"

---
# monitoring/prometheus/rules/alerts/kubernetes.yml

groups:
- name: kubernetes-alerts
  interval: 30s
  rules:
  
  - alert: PodCrashLooping
    expr: |
      increase(kube_pod_container_status_restarts_total[1h]) > 5
    for: 5m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "Pod {{ $labels.pod }} is crash looping"
      description: "Pod {{ $labels.pod }} in namespace {{ $labels.namespace }} has restarted {{ $value }} times in the last hour"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/pod-crash-looping"
  
  - alert: PodPending
    expr: |
      kube_pod_status_phase{phase="Pending"} == 1
    for: 15m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "Pod {{ $labels.pod }} is pending"
      description: "Pod {{ $labels.pod }} has been in Pending state for more than 15 minutes"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/pod-pending"
  
  - alert: DeploymentReplicasMismatch
    expr: |
      kube_deployment_spec_replicas != kube_deployment_status_replicas_available
    for: 15m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "Deployment {{ $labels.deployment }} replicas mismatch"
      description: "Deployment {{ $labels.deployment }} has {{ $value }} available replicas, expected {{ kube_deployment_spec_replicas }}"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/deployment-replicas-mismatch"
  
  - alert: HPOMaxReplicas
    expr: |
      kube_hpa_status_current_replicas == kube_hpa_spec_max_replicas
    for: 10m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "HPA {{ $labels.horizontalpodautoscaler }} at max replicas"
      description: "HPA {{ $labels.horizontalpodautoscaler }} is at maximum replicas ({{ $value }})"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/hpa-max-replicas"

---
# monitoring/prometheus/rules/alerts/application.yml

groups:
- name: application-alerts
  interval: 30s
  rules:
  
  - alert: ServiceDown
    expr: |
      up{job="fastapi-services"} == 0
    for: 2m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "Service {{ $labels.service }} is down"
      description: "Service {{ $labels.service }} (pod: {{ $labels.pod }}) has been down for more than 2 minutes"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/service-down"
  
  - alert: HighErrorRate
    expr: |
      (
        sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
        /
        sum(rate(http_requests_total[5m])) by (service)
      ) * 100 > 1
    for: 5m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "High error rate for {{ $labels.service }}"
      description: "Service {{ $labels.service }} has {{ $value | humanize }}% error rate (5m average)"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/high-error-rate"
  
  - alert: HighLatency
    expr: |
      histogram_quantile(0.95,
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
      ) > 1
    for: 10m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "High latency for {{ $labels.service }}"
      description: "Service {{ $labels.service }} 95th percentile latency is {{ $value }}s"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/high-latency"
  
  - alert: HighLatencyP99
    expr: |
      histogram_quantile(0.99,
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
      ) > 5
    for: 5m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "Critical latency for {{ $labels.service }}"
      description: "Service {{ $labels.service }} 99th percentile latency is {{ $value }}s"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/high-latency-p99"
  
  - alert: DatabaseConnectionsHigh
    expr: |
      (db_connections_active / db_connections_max) * 100 > 80
    for: 5m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "Database connections high for {{ $labels.service }}"
      description: "{{ $value | humanize }}% of database connections in use"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/db-connections-high"
  
  - alert: CacheHitRateLow
    expr: |
      (
        sum(rate(cache_hits_total[5m])) by (service)
        /
        (sum(rate(cache_hits_total[5m])) by (service) + sum(rate(cache_misses_total[5m])) by (service))
      ) * 100 < 70
    for: 15m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "Low cache hit rate for {{ $labels.service }}"
      description: "Cache hit rate is {{ $value | humanize }}% for {{ $labels.service }}"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/cache-hit-rate-low"

---
# monitoring/prometheus/rules/alerts/kafka.yml

groups:
- name: kafka-alerts
  interval: 30s
  rules:
  
  - alert: KafkaConsumerLagHigh
    expr: |
      kafka_consumer_lag > 10000
    for: 10m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "High Kafka consumer lag"
      description: "Consumer group {{ $labels.consumer_group }} has lag of {{ $value }} messages on topic {{ $labels.topic }}"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/kafka-consumer-lag"
  
  - alert: KafkaConsumerLagCritical
    expr: |
      kafka_consumer_lag > 50000
    for: 5m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "Critical Kafka consumer lag"
      description: "Consumer group {{ $labels.consumer_group }} has critical lag of {{ $value }} messages"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/kafka-consumer-lag-critical"
  
  - alert: KafkaBrokerDown
    expr: |
      up{job="kafka"} == 0
    for: 2m
    labels:
      severity: critical
      team: infrastructure
    annotations:
      summary: "Kafka broker {{ $labels.broker }} is down"
      description: "Kafka broker {{ $labels.broker }} has been down for more than 2 minutes"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/kafka-broker-down"

---
# monitoring/prometheus/rules/alerts/blockchain.yml

groups:
- name: blockchain-alerts
  interval: 30s
  rules:
  
  - alert: BlockchainSyncBehind
    expr: |
      blockchain_sync_lag_blocks > 20
    for: 5m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "Blockchain sync behind on {{ $labels.blockchain }}"
      description: "{{ $labels.blockchain }} is {{ $value }} blocks behind"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/blockchain-sync-behind"
  
  - alert: BlockchainGasPriceHigh
    expr: |
      blockchain_gas_price_gwei{percentile="50"} > 100
    for: 10m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "High gas price on {{ $labels.blockchain }}"
      description: "Gas price is {{ $value }} Gwei on {{ $labels.blockchain }}"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/gas-price-high"
  
  - alert: SmartContractPaused
    expr: |
      smart_contract_paused == 1
    for: 1m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "Smart contract paused: {{ $labels.contract }}"
      description: "Smart contract {{ $labels.contract }} is paused"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/smart-contract-paused"
  
  - alert: BridgeTransferDelayed
    expr: |
      bridge_transfer_duration_seconds > 1800
    for: 5m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "Bridge transfer delayed"
      description: "Bridge transfer from {{ $labels.source_chain }} to {{ $labels.destination_chain }} taking {{ $value }}s"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/bridge-transfer-delayed"

---
# monitoring/prometheus/rules/alerts/business.yml

groups:
- name: business-alerts
  interval: 60s
  rules:
  
  - alert: KYCBacklogHigh
    expr: |
      kyc_applications{status="pending"} > 100
    for: 30m
    labels:
      severity: warning
      team: compliance
    annotations:
      summary: "High KYC application backlog"
      description: "{{ $value }} KYC applications pending review"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/kyc-backlog"
  
  - alert: ComplianceAlertsSpike
    expr: |
      increase(compliance_alerts_active[1h]) > 20
    for: 15m
    labels:
      severity: warning
      team: compliance
    annotations:
      summary: "Spike in compliance alerts"
      description: "{{ $value }} new compliance alerts in the last hour"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/compliance-alerts-spike"
  
  - alert: AUMDrop
    expr: |
      (
        total_aum_usd - total_aum_usd offset 24h
      ) / total_aum_usd offset 24h * 100 < -10
    for: 1h
    labels:
      severity: warning
      team: business
    annotations:
      summary: "AUM dropped significantly"
      description: "AUM dropped by {{ $value | humanize }}% in the last 24 hours"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/aum-drop"
  
  - alert: TransactionVolumeAnomaly
    expr: |
      (
        transactions_24h_volume_usd - transactions_24h_volume_usd offset 7d
      ) / transactions_24h_volume_usd offset 7d * 100 < -50
    for: 2h
    labels:
      severity: warning
      team: business
    annotations:
      summary: "Transaction volume anomaly"
      description: "Transaction volume is {{ $value | humanize }}% lower than last week"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/transaction-volume-anomaly"
```

## 5.2 Recording Rules

```yaml
# monitoring/prometheus/rules/recording/rules.yml

groups:
- name: recording-rules
  interval: 30s
  rules:
  
  # Service-level SLO metrics
  - record: service:http_requests:rate5m
    expr: sum(rate(http_requests_total[5m])) by (service)
  
  - record: service:http_errors:rate5m
    expr: sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
  
  - record: service:http_error_ratio:rate5m
    expr: |
      sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
      /
      sum(rate(http_requests_total[5m])) by (service)
  
  - record: service:http_latency:p95
    expr: |
      histogram_quantile(0.95,
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
      )
  
  - record: service:http_latency:p99
    expr: |
      histogram_quantile(0.99,
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
      )
  
  # Business metrics aggregations
  - record: business:aum:total
    expr: sum(total_aum_usd)
  
  - record: business:investors:total
    expr: sum(total_investors)
  
  - record: business:transactions:rate24h
    expr: sum(transactions_24h_total)
  
  - record: business:volume:rate24h
    expr: sum(transactions_24h_volume_usd)
  
  # Kubernetes resource utilization
  - record: namespace:cpu:usage_ratio
    expr: |
      sum(rate(container_cpu_usage_seconds_total[5m])) by (namespace)
      /
      sum(kube_resourcequota{resource="requests.cpu"}) by (namespace)
  
  - record: namespace:memory:usage_ratio
    expr: |
      sum(container_memory_usage_bytes) by (namespace)
      /
      sum(kube_resourcequota{resource="requests.memory"}) by (namespace)
```

---

# 6. Grafana Dashboards

## 6.1 Dashboard Inventory

| Dashboard | ID | Purpose | Refresh |
|-----------|-----|---------|---------|
| **Platform Overview** | `platform-overview` | Executive summary, key metrics | 30s |
| **Service Performance** | `service-performance` | Per-service RED metrics | 10s |
| **Infrastructure** | `infrastructure` | Node, cluster health | 30s |
| **Kubernetes** | `kubernetes` | Pod, deployment, HPA status | 30s |
| **Database** | `database` | PostgreSQL performance | 30s |
| **Cache** | `cache` | Redis performance | 30s |
| **Kafka** | `kafka` | Broker, consumer, topic metrics | 30s |
| **Blockchain** | `blockchain` | Chain sync, gas, contracts | 10s |
| **Business Metrics** | `business-metrics` | AUM, investors, transactions | 1m |
| **Compliance** | `compliance` | KYC, AML, alerts | 1m |
| **Bridge Monitoring** | `bridge` | Cross-chain transfers | 30s |

## 6.2 Platform Overview Dashboard

```json
{
  "dashboard": {
    "title": "Platform Overview",
    "uid": "platform-overview",
    "tags": ["platform", "executive"],
    "timezone": "browser",
    "refresh": "30s",
    "panels": [
      {
        "id": 1,
        "type": "stat",
        "title": "Total AUM",
        "gridPos": {"h": 4, "w": 6, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "sum(total_aum_usd)",
            "legendFormat": "AUM (USD)",
            "format": "time_series"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "USD",
            "decimals": 0,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": 0},
                {"color": "yellow", "value": 5000000},
                {"color": "green", "value": 25000000}
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "type": "stat",
        "title": "Verified Investors",
        "gridPos": {"h": 4, "w": 6, "x": 6, "y": 0},
        "targets": [
          {
            "expr": "sum(total_investors{status=\"verified\"})",
            "legendFormat": "Investors"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "short",
            "decimals": 0
          }
        }
      },
      {
        "id": 3,
        "type": "stat",
        "title": "24h Volume",
        "gridPos": {"h": 4, "w": 6, "x": 12, "y": 0},
        "targets": [
          {
            "expr": "sum(transactions_24h_volume_usd)",
            "legendFormat": "Volume (USD)"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "USD",
            "decimals": 0
          }
        }
      },
      {
        "id": 4,
        "type": "stat",
        "title": "Active Alerts",
        "gridPos": {"h": 4, "w": 6, "x": 18, "y": 0},
        "targets": [
          {
            "expr": "sum(ALERTS{alertstate=\"firing\"})",
            "legendFormat": "Firing Alerts"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "short",
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": 0},
                {"color": "yellow", "value": 1},
                {"color": "red", "value": 5}
              ]
            }
          }
        }
      },
      {
        "id": 5,
        "type": "timeseries",
        "title": "AUM Trend",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 4},
        "targets": [
          {
            "expr": "sum(total_aum_usd)",
            "legendFormat": "Total AUM"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "USD",
            "custom": {
              "lineWidth": 2,
              "fillOpacity": 10
            }
          }
        }
      },
      {
        "id": 6,
        "type": "timeseries",
        "title": "Transaction Volume (24h)",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 4},
        "targets": [
          {
            "expr": "sum(transactions_24h_volume_usd)",
            "legendFormat": "Volume"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "USD"
          }
        }
      },
      {
        "id": 7,
        "type": "table",
        "title": "Service Health",
        "gridPos": {"h": 8, "w": 24, "x": 0, "y": 12},
        "targets": [
          {
            "expr": "up{job=\"fastapi-services\"}",
            "legendFormat": "{{service}}",
            "format": "table",
            "instant": true
          }
        ],
        "transformations": [
          {
            "id": "organize",
            "options": {
              "excludeByName": {"Time": true, "__name__": true, "instance": true, "job": true}
            }
          }
        ]
      }
    ],
    "time": {"from": "now-24h", "to": "now"},
    "templating": {
      "list": [
        {
          "name": "environment",
          "type": "query",
          "query": "label_values(environment)"
        }
      ]
    }
  }
}
```

## 6.3 Service Performance Dashboard

```json
{
  "dashboard": {
    "title": "Service Performance",
    "uid": "service-performance",
    "tags": ["services", "performance"],
    "refresh": "10s",
    "panels": [
      {
        "id": 1,
        "type": "timeseries",
        "title": "Request Rate",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "id": 2,
        "type": "timeseries",
        "title": "Error Rate",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0},
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service)",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "id": 3,
        "type": "timeseries",
        "title": "Latency (p95)",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8},
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))",
            "legendFormat": "{{service}}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "s",
            "custom": {
              "fillOpacity": 10
            }
          }
        }
      },
      {
        "id": 4,
        "type": "timeseries",
        "title": "Latency (p99)",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8},
        "targets": [
          {
            "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "id": 5,
        "type": "heatmap",
        "title": "Latency Heatmap",
        "gridPos": {"h": 8, "w": 24, "x": 0, "y": 16},
        "targets": [
          {
            "expr": "sum(increase(http_request_duration_seconds_bucket[5m])) by (le, service)",
            "legendFormat": "{{le}}",
            "format": "heatmap"
          }
        ]
      }
    ],
    "templating": {
      "list": [
        {
          "name": "service",
          "type": "query",
          "query": "label_values(http_requests_total, service)"
        }
      ]
    }
  }
}
```

---

# 7. Logging with Loki

## 7.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LOKI LOGGING ARCHITECTURE                             │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    Log Sources (Kubernetes Pods)                        │ │
│  │                                                                         │ │
│  │  • FastAPI services: JSON logs to stdout/stderr                         │ │
│  │  • System logs: journald                                                │ │
│  │  • Kubernetes: Container logs, audit logs                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│                                   ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    Promtail (DaemonSet)                                 │ │
│  │                                                                         │ │
│  │  • Collects logs from /var/log/containers                               │ │
│  │  • Adds Kubernetes metadata (pod, namespace, labels)                    │ │
│  │  • Applies relabeling and log processing                                │ │
│  │  • Pushes to Loki via gRPC                                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│                                   ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    Loki (StatefulSet)                                   │ │
│  │                                                                         │ │
│  │  • Indexes log metadata (labels, timestamps)                            │ │
│  │  • Stores compressed log chunks in object storage                       │ │
│  │  • Retention: 30 days                                                   │ │
│  │                                                                         │ │
│  │  Resource Allocation:                                                   │ │
│  │  • CPU: 4 cores request, 8 cores limit                                  │ │
│  │  • Memory: 8Gi request, 16Gi limit                                      │ │
│  │  • Storage: 200Gi PVC                                                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│                                   ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    Grafana (Log Exploration)                            │ │
│  │                                                                         │ │
│  │  • LogQL queries                                                        │ │
│  │  • Log aggregation and filtering                                        │ │
│  │  • Correlation with metrics                                             │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Promtail Configuration

```yaml
# monitoring/loki/promtail-config.yml

server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
- url: http://loki:3100/loki/api/v1/push
  batchwait: 5s
  batchsize: 1048576  # 1MB
  timeout: 10s

scrape_configs:
# Kubernetes container logs
- job_name: kubernetes-pods
  kubernetes_sd_configs:
  - role: pod
  pipeline_stages:
  - cri: {}
  - json:
      expressions:
        level: level
        message: message
        service: service
        trace_id: trace_id
  - labels:
      level:
      service:
      trace_id:
  - static_labels:
      cluster: production
      environment: production
  relabel_configs:
  - source_labels:
    - __meta_kubernetes_pod_name
    target_label: pod
  - source_labels:
    - __meta_kubernetes_namespace
    target_label: namespace
  - source_labels:
    - __meta_kubernetes_pod_label_app
    target_label: app
  - source_labels:
    - __meta_kubernetes_pod_container_name
    target_label: container

# Application logs (FastAPI)
- job_name: fastapi-logs
  kubernetes_sd_configs:
  - role: pod
    namespaces:
      names:
      - ujamaa-production
  relabel_configs:
  - source_labels:
    - __meta_kubernetes_pod_label_app
    action: keep
    regex: .+-service
  pipeline_stages:
  - json:
      expressions:
        timestamp: timestamp
        level: level
        message: message
        service: service
        path: path
        method: method
        status_code: status_code
        response_time: response_time
        user_id: user_id
        request_id: request_id
  - labels:
      level:
      service:
      path:
      method:
      status_code:
      user_id:
      request_id:
  - timestamp:
      source: timestamp
      format: RFC3339
  - output:
      source: message

# Audit logs
- job_name: audit-logs
  kubernetes_sd_configs:
  - role: pod
    namespaces:
      names:
      - ujamaa-production
  relabel_configs:
  - source_labels:
    - __meta_kubernetes_pod_label_app
    action: keep
    regex: compliance-service
  pipeline_stages:
  - json:
      expressions:
        event_type: event_type
        actor_id: actor_id
        resource_type: resource_type
        resource_id: resource_id
        compliance_status: compliance_status
  - labels:
      event_type:
      actor_id:
      resource_type:
      compliance_status:
  - output:
      source: message
```

## 7.3 LogQL Query Examples

```logql
# All error logs from assets service
{app="assets-service", level="error"}

# Error logs with 5xx status code
{app=~".+-service"} | json | status_code =~ "5.."

# Slow requests (>1s)
{app=~".+-service"} | json | response_time > 1.0

# Logs for specific user
{app=~".+-service"} | json | user_id = "inv_001"

# Logs for specific request (trace)
{app=~".+-service"} | json | request_id = "req_abc123"

# Compliance events
{app="compliance-service", event_type="TRANSFER_BLOCKED"}

# Error rate aggregation
sum(rate({app=~".+-service", level="error"}[5m])) by (app)

# Error logs with pattern matching
{app=~".+-service"} |~ "(?i)error|exception|failed"

# Multi-line stack traces
{app="assets-service"} |~ "(?m)^\\s*at "
```

## 7.4 Log Retention

```yaml
# monitoring/loki/loki-config.yml

limits_config:
  retention_period: 720h  # 30 days
  max_entries_limit_per_query: 5000
  max_lines_rate_per_stream: 100
  ingestion_rate_mb: 16
  ingestion_burst_size_mb: 24

compactor:
  working_directory: /tmp/loki/compactor
  shared_store: s3
  retention_enabled: true
  retention_delete_delay: 2h
  retention_delete_worker_count: 150

# Delete requests for GDPR compliance
# POST /loki/api/v1/delete
# {
#   "matchers": "{user_id=\"inv_001\"}",
#   "start": "2026-01-01T00:00:00Z",
#   "end": "2026-02-27T23:59:59Z"
# }
```

---

# 8. Distributed Tracing

## 8.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DISTRIBUTED TRACING ARCHITECTURE                      │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    Instrumented Services (FastAPI)                      │ │
│  │                                                                         │ │
│  │  • OpenTelemetry SDK                                                    │ │
│  │  • Auto-instrumentation for HTTP, database, cache                       │ │
│  │  • Custom spans for business logic                                      │ │
│  │  • Sampling: 10% (production), 100% (staging)                           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│                                   ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                    OpenTelemetry Collector                              │ │
│  │                                                                         │ │
│  │  • Receives spans via OTLP (gRPC)                                       │ │
│  │  • Processes: batching, filtering, enrichment                           │ │
│  │  • Exports to Tempo/Jaeger                                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                         │
│              ┌────────────────────┼────────────────────┐                   │
│              ▼                    ▼                    ▼                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │      Tempo       │  │      Jaeger      │  │    Grafana       │         │
│  │   (Production)   │  │   (Staging)      │  │  (Visualization) │         │
│  │                  │  │                  │  │                  │         │
│  │  • Trace storage │  │  • Debug traces  │  │  • Trace search  │         │
│  │  • Metrics gen   │  │  • Full sampling │  │  • Service graph │         │
│  │  • 7d retention  │  │  • 30d retention │  │  • Latency views │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.2 OpenTelemetry Configuration

```python
# tracing.py - OpenTelemetry setup for FastAPI

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace.sampling import ParentBasedTraceIdRatio
from fastapi import FastAPI

def setup_tracing(app: FastAPI, service_name: str, sample_rate: float = 0.1):
    """
    Set up OpenTelemetry tracing for FastAPI application.
    
    Args:
        app: FastAPI application
        service_name: Service name for tracing
        sample_rate: Sampling rate (0.1 = 10%)
    """
    # Create resource with service info
    resource = Resource.create({
        "service.name": service_name,
        "service.namespace": "ujamaa-production",
        "deployment.environment": "production",
    })
    
    # Set up tracer provider with sampling
    provider = TracerProvider(
        resource=resource,
        sampler=ParentBasedTraceIdRatio(sample_rate)
    )
    
    # Add batch span processor
    exporter = OTLPSpanExporter(
        endpoint="otel-collector:4317",
        insecure=True
    )
    
    processor = BatchSpanProcessor(
        exporter,
        max_queue_size=2048,
        scheduled_delay_millis=5000,
        max_export_batch_size=512
    )
    
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)
    
    # Instrument FastAPI
    FastAPIInstrumentor.instrument_app(app)
    
    # Instrument other libraries
    HTTPXInstrumentor().instrument()
    SQLAlchemyInstrumentor().instrument()
    RedisInstrumentor().instrument()
    
    return trace.get_tracer(service_name)

# Usage in main.py
app = FastAPI(title="Assets Service")
tracer = setup_tracing(app, "assets-service", sample_rate=0.1)

# Custom span example
@app.post("/assets")
async def create_asset(asset: AssetCreate):
    with tracer.start_as_current_span("asset_validation") as span:
        # Business logic
        span.set_attribute("asset.class", asset.asset_class)
        span.set_attribute("asset.jurisdiction", asset.jurisdiction)
        
        # Nested span
        with tracer.start_as_current_span("compliance_check"):
            compliance_result = await check_compliance(asset)
            span.set_attribute("compliance.passed", compliance_result.passed)
        
        # Continue with asset creation
        ...
```

## 8.3 Tempo Configuration

```yaml
# monitoring/tempo/tempo-config.yml

server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
        http:
          endpoint: 0.0.0.0:4318

ingester:
  max_block_duration: 5m
  max_block_bytes: 104857600  # 100MB
  trace_idle_period: 10s

compactor:
  compaction:
    block_retention: 168h  # 7 days
    compacted_block_retention: 24h

storage:
  trace:
    backend: s3
    s3:
      bucket: ujamaa-tempo-traces
      endpoint: s3.af-south-1.amazonaws.com
    wal:
      path: /tmp/tempo/wal
      encoding: snappy
    pool:
      max_workers: 100
      queue_depth: 10000

metrics_generator:
  processor:
    local_blocks:
      filter_server_spans: false
    span_metrics:
      dimensions:
      - service_name
      - span_name
      - span_kind
  storage:
    path: /tmp/tempo/generator
    remote_write:
    - url: http://prometheus:9090/api/v1/write
      send_exemplars: true

overrides:
  metrics_generator_processors:
  - service-graphs
  - span-metrics
```

## 8.4 Trace Query Examples

```
# Grafana Tempo query language

# Find traces by service
{service.name="assets-service"}

# Find traces with errors
{service.name="assets-service"} | @error=true

# Find slow traces (>2s)
{service.name="assets-service"} | duration > 2s

# Find traces by operation
{service.name="assets-service", span.name="POST /api/v1/assets"}

# Find traces by user
{service.name="assets-service", user.id="inv_001"}

# Find traces by request ID
{service.name="assets-service", request.id="req_abc123"}

# Service graph
service_graph({service.name="assets-service"})
```

---

# 9. Kubernetes Monitoring

## 9.1 Kube-State-Metrics

```yaml
# monitoring/kube-state-metrics/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: kube-state-metrics
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kube-state-metrics
  template:
    metadata:
      labels:
        app: kube-state-metrics
    spec:
      serviceAccountName: kube-state-metrics
      containers:
      - name: kube-state-metrics
        image: registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.10.1
        args:
        - --port=8080
        - --resources=certificatesigningrequests,configmaps,cronjobs,daemonsets,deployments,endpoints,horizontalpodautoscalers,ingresses,jobs,limitranges,mutatingwebhookconfigurations,namespaces,networkpolicies,nodes,persistentvolumeclaims,persistentvolumes,poddisruLPionbudgets,pods,replicasets,replicationcontrollers,resourcequotas,secrets,services,statefulsets,storageclasses,validatingwebhookconfigurations,volumeattachments
        - --metric-labels-allowlist=namespaces=[app.kubernetes.io/name],pods=[app.kubernetes.io/name,app.kubernetes.io/component]
        - --metric-annotations-allowlist=pods=[app.kubernetes.io/version]
        ports:
        - containerPort: 8080
          name: http-metrics
        - containerPort: 8081
          name: telemetry
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          timeoutSeconds: 5
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 30
          timeoutSeconds: 5
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
```

## 9.2 HPA Integration with Prometheus

```yaml
# k8s/hpa/prometheus-adapter.yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: adapter-config
  namespace: monitoring
data:
  config.yaml: |
    rules:
    - seriesQuery: 'http_requests_total{namespace!="",pod!=""}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          pod: {resource: "pod"}
      name:
        matches: "^(.*)_total"
        as: "${1}_per_second"
      metricsQuery: 'sum(rate(<<.Series>>{<<.LabelMatchers>>}[2m])) by (<<.GroupBy>>)'
    
    - seriesQuery: 'http_request_duration_seconds_bucket{namespace!="",pod!=""}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          pod: {resource: "pod"}
      name:
        matches: ""
        as: "http_request_duration_seconds_p95"
      metricsQuery: 'histogram_quantile(0.95, sum(rate(<<.Series>>{<<.LabelMatchers>>}[5m])) by (le, <<.GroupBy>>))'
    
    - seriesQuery: 'kafka_consumer_lag{namespace!="",pod!=""}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          pod: {resource: "pod"}
      name:
        matches: ""
        as: "kafka_consumer_lag"
      metricsQuery: 'sum(<<.Series>>{<<.LabelMatchers>>}) by (<<.GroupBy>>)'
    
    # Custom metrics for business scaling
    - seriesQuery: 'transactions_24h_volume_usd'
      resources:
        overrides:
          namespace: {resource: "namespace"}
      name:
        matches: ""
        as: "transactions_volume_usd"
      metricsQuery: 'sum(<<.Series>>{<<.LabelMatchers>>})'
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus-adapter
  namespace: monitoring
spec:
  replicas: 2
  selector:
    matchLabels:
      app: prometheus-adapter
  template:
    metadata:
      labels:
        app: prometheus-adapter
    spec:
      serviceAccountName: prometheus-adapter
      containers:
      - name: prometheus-adapter
        image: registry.k8s.io/prometheus-adapter/prometheus-adapter:v0.10.0
        args:
        - --cert-dir=/var/run/serving-cert
        - --config=/etc/adapter/config.yaml
        - --logtostderr=true
        - --metrics-relist-interval=1m
        - --prometheus-url=http://prometheus:9090/
        - --secure-port=6443
        ports:
        - containerPort: 6443
          name: https
        volumeMounts:
        - mountPath: /etc/adapter
          name: config
          readOnly: true
        - mountPath: /var/run/serving-cert
          name: volume-serving-cert
          readOnly: true
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
      volumes:
      - name: config
        configMap:
          name: adapter-config
      - name: volume-serving-cert
        emptyDir: {}
```

## 9.3 Pod DisruLPion Budget Monitoring

```yaml
# monitoring/prometheus/rules/alerts/kubernetes-pdb.yml

groups:
- name: kubernetes-pdb-alerts
  rules:
  - alert: PDBMisconfigured
    expr: |
      kube_poddisruLPionbudget_status_observed_generation
      !=
      kube_poddisruLPionbudget_metadata_generation
    for: 5m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "PDB {{ $labels.poddisruLPionbudget }} misconfigured"
      description: "PDB {{ $labels.poddisruLPionbudget }} has not been observed by controller"
  
  - alert: PDBNotProtecting
    expr: |
      kube_poddisruLPionbudget_status_pod_disruLPions_allowed == 0
    for: 5m
    labels:
      severity: warning
      team: platform
    annotations:
      summary: "PDB {{ $labels.poddisruLPionbudget }} not protecting pods"
      description: "PDB {{ $labels.poddisruLPionbudget }} allows 0 disruLPions"
```

---

# 10. Blockchain Monitoring

## 10.1 Blockchain Exporter

```python
# blockchain_exporter/main.py

from prometheus_client import start_http_server, Gauge, Counter, Histogram
import asyncio
from web3 import Web3
import logging
from typing import Dict, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Metrics (defined in Section 4.4)
# ...

class BlockchainMonitor:
    def __init__(self, rpc_url: str, blockchain: str, network: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.blockchain = blockchain
        self.network = network
        self.last_block_number = 0
        self.block_times: List[float] = []
        
    async def monitor(self):
        """Main monitoring loop."""
        while True:
            try:
                await self.collect_metrics()
            except Exception as e:
                logger.error(f"Error collecting metrics: {e}")
            await asyncio.sleep(10)
    
    async def collect_metrics(self):
        """Collect all blockchain metrics."""
        # Latest block
        latest_block = self.w3.eth.get_block('latest')
        
        blockchain_latest_block_number.labels(
            blockchain=self.blockchain,
            network=self.network
        ).set(latest_block['number'])
        
        # Sync lag (compare with expected latest)
        expected_block = self.get_expected_block_number()
        if expected_block:
            lag = expected_block - latest_block['number']
            blockchain_sync_lag_blocks.labels(
                blockchain=self.blockchain,
                network=self.network
            ).set(lag)
        
        # Block time
        if latest_block['number'] > 0:
            prev_block = self.w3.eth.get_block(latest_block['number'] - 1)
            block_time = latest_block['timestamp'] - prev_block['timestamp']
            self.block_times.append(block_time)
            if len(self.block_times) > 100:
                self.block_times.pop(0)
            
            blockchain_block_time_seconds.labels(
                blockchain=self.blockchain,
                network=self.network
            ).observe(block_time)
        
        # Gas price
        gas_price = self.w3.eth.gas_price / 1e9  # Gwei
        blockchain_gas_price_gwei.labels(
            blockchain=self.blockchain,
            network=self.network,
            percentile='50'
        ).set(gas_price)
        
        # Gas used ratio
        gas_used_ratio = latest_block['gasUsed'] / latest_block['gasLimit']
        blockchain_gas_used_ratio.labels(
            blockchain=self.blockchain,
            network=self.network
        ).set(gas_used_ratio)
        
        # Pending transactions
        pending_count = self.w3.eth.get_block('pending').transactions.__len__()
        blockchain_transactions_pending.labels(
            blockchain=self.blockchain,
            network=self.network
        ).set(pending_count)
        
        # Smart contract balances
        await self.collect_contract_metrics()
    
    async def collect_contract_metrics(self):
        """Collect metrics for monitored smart contracts."""
        contracts = self.get_monitored_contracts()
        
        for contract_info in contracts:
            contract = self.w3.eth.contract(
                address=contract_info['address'],
                abi=contract_info['abi']
            )
            
            try:
                # Contract balance
                balance = contract.functions.totalSupply().call()
                smart_contract_balance.labels(
                    blockchain=self.blockchain,
                    contract=contract_info['name'],
                    token=contract_info['token']
                ).set(balance)
                
                # Contract paused status
                if 'paused' in contract_info['functions']:
                    paused = contract.functions.paused().call()
                    # Export as gauge (1 = paused, 0 = active)
                    # Note: Define smart_contract_paused metric
                
            except Exception as e:
                logger.error(f"Error collecting contract metrics for {contract_info['name']}: {e}")
    
    def get_expected_block_number(self) -> int:
        """Get expected block number based on average block time."""
        # Implementation depends on blockchain
        # For Polygon: ~2 seconds per block
        # For Ethereum: ~12 seconds per block
        pass
    
    def get_monitored_contracts(self) -> List[Dict]:
        """Get list of contracts to monitor."""
        return [
            {
                'name': 'UjamaaToken',
                'address': '0x...',
                'abi': [...],
                'token': 'LCREIT',
                'functions': ['paused', 'totalSupply']
            },
            # Add more contracts
        ]

# Start monitoring
if __name__ == '__main__':
    # Start Prometheus server
    start_http_server(9500)
    logger.info("Prometheus metrics server started on :9500")
    
    # Create monitors
    polygon_monitor = BlockchainMonitor(
        rpc_url="https://polygon-rpc.com",
        blockchain="polygon",
        network="mainnet"
    )
    
    ethereum_monitor = BlockchainMonitor(
        rpc_url="https://mainnet.infura.io/v3/...",
        blockchain="ethereum",
        network="mainnet"
    )
    
    # Run async
    asyncio.run(asyncio.gather(
        polygon_monitor.monitor(),
        ethereum_monitor.monitor()
    ))
```

## 10.2 Smart Contract Event Monitoring

```python
# blockchain_exporter/event_monitor.py

from web3 import Web3
from web3.logs import DISCARD
import asyncio
from prometheus_client import Counter

# Event metrics
contract_events_total = Counter(
    'smart_contract_events_total',
    'Total smart contract events',
    ['blockchain', 'contract', 'event_type']
)

transfer_with_compliance_total = Counter(
    'transfer_with_compliance_total',
    'ERC-3643 TransferWithCompliance events',
    ['blockchain', 'contract', 'from', 'to', 'compliance_passed']
)

class EventMonitor:
    def __init__(self, w3: Web3, blockchain: str):
        self.w3 = w3
        self.blockchain = blockchain
    
    async def monitor_events(self, contract_address: str, abi: dict, from_block: int):
        """Monitor smart contract events."""
        contract = self.w3.eth.contract(address=contract_address, abi=abi)
        
        # Get latest block
        latest_block = self.w3.eth.block_number
        
        # Process blocks
        for block_num in range(from_block, latest_block + 1):
            try:
                block = self.w3.eth.get_block(block_num)
                
                # Get all logs from block
                logs = block.transactions
                for tx in logs:
                    tx_receipt = self.w3.eth.get_transaction_receipt(tx)
                    
                    # Process TransferWithCompliance events
                    for log in tx_receipt.logs:
                        try:
                            event_data = contract.events.TransferWithCompliance().processLog(log)
                            
                            contract_events_total.labels(
                                blockchain=self.blockchain,
                                contract=contract.address[:10],
                                event_type='TransferWithCompliance'
                            ).inc()
                            
                            transfer_with_compliance_total.labels(
                                blockchain=self.blockchain,
                                contract=contract.address[:10],
                                from=event_data['from'][:10],
                                to=event_data['to'][:10],
                                compliance_passed=str(event_data['compliancePassed'])
                            ).inc()
                            
                        except Exception:
                            # Log doesn't match this event
                            pass
                
            except Exception as e:
                logger.error(f"Error processing block {block_num}: {e}")
            
            await asyncio.sleep(1)  # Rate limit
```

---

# 11. SLO/SLI Framework

## 11.1 Service Level Objectives

| Service | SLI | SLO Target | Error Budget | Measurement Window |
|---------|-----|------------|--------------|-------------------|
| **Assets API** | Availability | 99.9% | 0.1% (43m/month) | 30 days |
| **Assets API** | Latency (p95) | <500ms | 5% violations | 30 days |
| **Investors API** | Availability | 99.5% | 0.5% (3.6h/month) | 30 days |
| **Investors API** | Latency (p95) | <300ms | 5% violations | 30 days |
| **Trades API** | Availability | 99.9% | 0.1% (43m/month) | 30 days |
| **Trades API** | Latency (p95) | <1s | 5% violations | 30 days |
| **Compliance API** | Availability | 99.5% | 0.5% (3.6h/month) | 30 days |
| **Compliance API** | Latency (p95) | <2s | 5% violations | 30 days |
| **Blockchain Sync** | Block Lag | <10 blocks | 1% violations | 7 days |
| **Cross-Chain Bridge** | Finality Time | <15 min | 5% violations | 30 days |

## 11.2 SLO Recording Rules

```yaml
# monitoring/prometheus/rules/recording/slo.yml

groups:
- name: slo-recording-rules
  interval: 1m
  rules:
  
  # Assets API Availability SLO
  - record: slo:assets_api:availability:ratio30d
    expr: |
      avg_over_time(
        sum(rate(http_requests_total{service="assets-service", status!~"5.."}[5m]))
        /
        sum(rate(http_requests_total{service="assets-service"}[5m]))
        [30d:5m]
      )
  
  # Assets API Latency SLO (p95 < 500ms)
  - record: slo:assets_api:latency_p95:violation_ratio30d
    expr: |
      avg_over_time(
        (
          histogram_quantile(0.95,
            sum(rate(http_request_duration_seconds_bucket{service="assets-service"}[5m]))
            by (le)
          ) > 0.5
        )
        [30d:5m]
      )
  
  # Error Budget remaining
  - record: slo:assets_api:error_budget:remaining
    expr: |
      1 - (
        (1 - slo:assets_api:availability:ratio30d)
        /
        (1 - 0.999)  # SLO target
      )
  
  # Burn Rate (how fast we're consuming error budget)
  - record: slo:assets_api:burn_rate:rate1h
    expr: |
      (
        1 - sum(rate(http_requests_total{service="assets-service", status!~"5.."}[1h]))
        / sum(rate(http_requests_total{service="assets-service"}[1h]))
      )
      /
      (1 - 0.999)
  
  - record: slo:assets_api:burn_rate:rate6h
    expr: |
      (
        1 - sum(rate(http_requests_total{service="assets-service", status!~"5.."}[6h]))
        / sum(rate(http_requests_total{service="assets-service"}[6h]))
      )
      /
      (1 - 0.999)
  
  - record: slo:assets_api:burn_rate:rate24h
    expr: |
      (
        1 - sum(rate(http_requests_total{service="assets-service", status!~"5.."}[24h]))
        / sum(rate(http_requests_total{service="assets-service"}[24h]))
      )
      /
      (1 - 0.999)
```

## 11.3 Burn Rate Alerts

```yaml
# monitoring/prometheus/rules/alerts/slo-burn-rate.yml

groups:
- name: slo-burn-rate-alerts
  rules:
  
  # Critical: Burn rate > 14.4x (error budget exhausted in 2 hours)
  - alert: AssetsAPICriticalBurnRate
    expr: |
      slo:assets_api:burn_rate:rate1h > 14.4
      and
      slo:assets_api:burn_rate:rate5m > 14.4
    for: 2m
    labels:
      severity: critical
      team: platform
      slo: assets_api
    annotations:
      summary: "Assets API critical burn rate"
      description: "Error budget will be exhausted in 2 hours at current burn rate ({{ $value }}x)"
      runbook_url: "https://runbooks.ujamaa-defi.com/alerts/slo-burn-rate"
  
  # High: Burn rate > 6x (error budget exhausted in 6 hours)
  - alert: AssetsAPIHighBurnRate
    expr: |
      slo:assets_api:burn_rate:rate6h > 6
      and
      slo:assets_api:burn_rate:rate30m > 6
    for: 5m
    labels:
      severity: warning
      team: platform
      slo: assets_api
    annotations:
      summary: "Assets API high burn rate"
      description: "Error budget will be exhausted in 6 hours at current burn rate ({{ $value }}x)"
  
  # Warning: Burn rate > 3x (error budget exhausted in 1 day)
  - alert: AssetsAPIWarningBurnRate
    expr: |
      slo:assets_api:burn_rate:rate24h > 3
    for: 15m
    labels:
      severity: info
      team: platform
      slo: assets_api
    annotations:
      summary: "Assets API elevated burn rate"
      description: "Error budget will be exhausted in 1 day at current burn rate ({{ $value }}x)"
  
  # Error Budget Remaining < 10%
  - alert: AssetsAPIErrorBudgetLow
    expr: |
      slo:assets_api:error_budget:remaining < 0.1
    for: 1h
    labels:
      severity: warning
      team: platform
      slo: assets_api
    annotations:
      summary: "Assets API error budget low"
      description: "Only {{ $value | humanizePercentage }} of error budget remaining for 30-day window"
```

## 11.4 SLO Dashboard

```json
{
  "dashboard": {
    "title": "SLO Dashboard - Assets API",
    "uid": "slo-assets-api",
    "tags": ["slo", "assets-api"],
    "panels": [
      {
        "id": 1,
        "type": "gauge",
        "title": "Error Budget Remaining",
        "gridPos": {"h": 6, "w": 8, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "slo:assets_api:error_budget:remaining * 100",
            "legendFormat": "Error Budget %"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percent",
            "min": 0,
            "max": 100,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": 0},
                {"color": "yellow", "value": 20},
                {"color": "green", "value": 50}
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "type": "stat",
        "title": "Availability (30d)",
        "gridPos": {"h": 6, "w": 8, "x": 8, "y": 0},
        "targets": [
          {
            "expr": "slo:assets_api:availability:ratio30d * 100",
            "legendFormat": "Availability %"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percent",
            "decimals": 3,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "red", "value": 0},
                {"color": "yellow", "value": 99.5},
                {"color": "green", "value": 99.9}
              ]
            }
          }
        }
      },
      {
        "id": 3,
        "type": "stat",
        "title": "Burn Rate (1h)",
        "gridPos": {"h": 6, "w": 8, "x": 16, "y": 0},
        "targets": [
          {
            "expr": "slo:assets_api:burn_rate:rate1h",
            "legendFormat": "Burn Rate"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "green", "value": 0},
                {"color": "yellow", "value": 3},
                {"color": "red", "value": 6}
              ]
            }
          }
        }
      },
      {
        "id": 4,
        "type": "timeseries",
        "title": "Burn Rate Over Time",
        "gridPos": {"h": 8, "w": 24, "x": 0, "y": 6},
        "targets": [
          {
            "expr": "slo:assets_api:burn_rate:rate1h",
            "legendFormat": "1h burn rate"
          },
          {
            "expr": "slo:assets_api:burn_rate:rate6h",
            "legendFormat": "6h burn rate"
          },
          {
            "expr": "slo:assets_api:burn_rate:rate24h",
            "legendFormat": "24h burn rate"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "custom": {
              "lineWidth": 2
            },
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {"color": "transparent", "value": 0},
                {"color": "yellow", "value": 3},
                {"color": "red", "value": 6}
              ]
            }
          }
        }
      }
    ]
  }
}
```

---

# 12. Runbooks

## 12.1 Runbook Template

```markdown
# Runbook: {Alert Name}

## Alert Details

- **Alert Name:** `{alert_name}`
- **Severity:** {critical|warning|info}
- **Team:** {team}
- **SLO Impact:** {Yes/No}

## Description

{What does this alert mean?}

## Impact

{What is the user/business impact?}

## Diagnosis

### Step 1: Check Dashboard

1. Open Grafana dashboard: {dashboard_url}
2. Check relevant panels:
   - {Panel 1}: Expected value: {X}, Actual: {Y}
   - {Panel 2}: Expected value: {X}, Actual: {Y}

### Step 2: Check Logs

```logql
{logql_query}
```

Look for:
- Error patterns: `{pattern}`
- Recent changes: `{pattern}`

### Step 3: Check Recent Changes

1. Check deployment history: `kubectl get deployments -n {namespace}`
2. Check recent config changes: `kubectl get configmaps -n {namespace}`
3. Check recent incidents: {incident_tracker_url}

## Resolution

### Immediate Actions

1. {Action 1}
2. {Action 2}

### Rollback (if needed)

```bash
kubectl rollout undo deployment/{name} -n {namespace}
```

### Scale Resources

```bash
kubectl scale deployment/{name} --replicas={n} -n {namespace}
```

## Verification

1. Confirm alert has cleared
2. Check SLO impact: {slo_dashboard_url}
3. Monitor for {X} minutes

## Escalation

If unable to resolve within {X} minutes:

1. Escalate to: {role}
2. Contact: {slack_channel}
3. Page: {on-call_person}

## Post-Incident

1. Create incident report: {template_url}
2. Schedule post-mortem
3. Update runbook if needed
```

## 12.2 Example Runbook: Service Down

```markdown
# Runbook: ServiceDown

## Alert Details

- **Alert Name:** `ServiceDown`
- **Severity:** Critical
- **Team:** Platform
- **SLO Impact:** Yes

## Description

A FastAPI service pod has been unreachable for more than 2 minutes.

## Impact

- Users cannot access the affected service
- API requests will fail with 503 errors
- SLO availability will be impacted

## Diagnosis

### Step 1: Check Dashboard

1. Open Grafana: https://grafana.ujamaa-defi.com/d/service-performance
2. Check which service is affected
3. Check error rate and latency panels

### Step 2: Check Pod Status

```bash
# Get pod status
kubectl get pods -n ujamaa-production -l app={service-name}

# Describe pod for events
kubectl describe pod {pod-name} -n ujamaa-production

# Check pod logs
kubectl logs {pod-name} -n ujamaa-production --tail=100
```

### Step 3: Check Logs in Grafana

```logql
{app="{service-name}", level="error"} |~ "(?i)panic|fatal|exception"
```

### Step 4: Check Dependencies

```bash
# Check database connectivity
kubectl exec {pod-name} -n ujamaa-production -- curl -s http://postgres:5432

# Check Redis connectivity
kubectl exec {pod-name} -n ujamaa-production -- redis-cli -h redis ping

# Check Kafka connectivity
kubectl exec {pod-name} -n ujamaa-production -- kafka-topics --bootstrap-server kafka:9092 --list
```

## Resolution

### If Pod is CrashLooping

1. Check logs for error:
   ```bash
   kubectl logs {pod-name} -n ujamaa-production --previous
   ```

2. If recent deployment:
   ```bash
   kubectl rollout undo deployment/{service-name} -n ujamaa-production
   ```

3. If resource exhaustion:
   ```bash
   kubectl edit deployment/{service-name} -n ujamaa-production
   # Increase resources
   ```

### If Pod is Pending

1. Check node resources:
   ```bash
   kubectl top nodes
   ```

2. Check for scheduling issues:
   ```bash
   kubectl describe pod {pod-name} -n ujamaa-production | grep -A 10 "Events:"
   ```

### If Pod is Running but Unhealthy

1. Check readiness probe:
   ```bash
   kubectl exec {pod-name} -n ujamaa-production -- curl -s http://localhost:8000/health/ready
   ```

2. Restart pod:
   ```bash
   kubectl delete pod {pod-name} -n ujamaa-production
   ```

## Verification

1. Confirm pod is Running:
   ```bash
   kubectl get pods -n ujamaa-production -l app={service-name}
   ```

2. Check health endpoint:
   ```bash
   curl https://api.ujamaa-defi.com/health/ready
   ```

3. Monitor for 5 minutes to ensure stability

## Escalation

If unable to resolve within 15 minutes:

1. Escalate to: Platform Lead
2. Contact: #platform-oncall
3. Page: On-call Engineer

## Related Alerts

- HighErrorRate
- HighLatency
- PodCrashLooping
```

## 12.3 Example Runbook: Blockchain Sync Behind

```markdown
# Runbook: BlockchainSyncBehind

## Alert Details

- **Alert Name:** `BlockchainSyncBehind`
- **Severity:** Critical
- **Team:** Platform
- **SLO Impact:** Yes

## Description

Blockchain node is more than 20 blocks behind the network tip.

## Impact

- Transactions may not be processed
- Compliance checks may fail
- Bridge operations delayed

## Diagnosis

### Step 1: Check Blockchain Dashboard

1. Open: https://grafana.ujamaa-defi.com/d/blockchain
2. Check:
   - Current block number
   - Sync lag trend
   - Block time

### Step 2: Check RPC Node

```bash
# Check node status
curl -X POST https://polygon-rpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check peer count
curl -X POST https://polygon-rpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}'
```

### Step 3: Check Blockchain Exporter

```bash
kubectl logs -l app=blockchain-exporter -n monitoring --tail=100
```

## Resolution

### If Using Third-Party RPC

1. Check provider status page
2. Switch to backup RPC:
   ```bash
   kubectl set env deployment/blockchain-exporter \
     RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/{key} \
     -n monitoring
   ```

### If Running Own Node

1. Check node logs:
   ```bash
   kubectl logs -l app=polygon-node -n blockchain
   ```

2. Restart node:
   ```bash
   kubectl delete pod -l app=polygon-node -n blockchain
   ```

3. Wait for sync (may take hours)

## Verification

1. Confirm sync lag < 10 blocks
2. Check transaction processing resumed
3. Monitor for 30 minutes

## Escalation

If unable to resolve within 30 minutes:

1. Escalate to: Blockchain Lead
2. Contact: #blockchain-oncall
```

---

# 13. On-Call Operations

## 13.1 On-Call Schedule

| Week | Primary | Secondary | Timezone |
|------|---------|-----------|----------|
| Week 1 | Engineer A | Engineer B | UTC+1 (Lagos) |
| Week 2 | Engineer B | Engineer C | UTC+3 (Nairobi) |
| Week 3 | Engineer C | Engineer A | UTC+2 (Johannesburg) |
| Week 4 | Engineer A | Engineer B | UTC+1 (Lagos) |

## 13.2 Escalation Policy

```yaml
# monitoring/alertmanager/escalation-policy.yml

route:
  receiver: slack-notifications
  group_by: ['alertname', 'severity', 'team']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
  # Critical alerts -> PagerDuty immediately
  - match:
      severity: critical
    receiver: pagerduty-critical
    continue: true
    group_wait: 10s
  
  # Warning alerts -> Slack, escalate after 30m
  - match:
      severity: warning
    receiver: slack-warnings
    group_wait: 5m
    repeat_interval: 1h
  
  # Info alerts -> Email digest
  - match:
      severity: info
    receiver: email-digest
    group_wait: 1h
    repeat_interval: 24h

receivers:
- name: slack-notifications
  slack_configs:
  - api_url: https://hooks.slack.com/services/XXX/YYY/ZZZ
    channel: '#alerts'
    title: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
    send_resolved: true

- name: pagerduty-critical
  pagerduty_configs:
  - service_key: <pagerduty-service-key>
    severity: critical
    description: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    details:
      runbook_url: '{{ range .Alerts }}{{ .Annotations.runbook_url }}{{ end }}'
      dashboard_url: '{{ range .Alerts }}{{ .Annotations.dashboard_url }}{{ end }}'

- name: slack-warnings
  slack_configs:
  - api_url: https://hooks.slack.com/services/XXX/YYY/ZZZ
    channel: '#alerts-warning'
    title: '[WARNING] {{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    send_resolved: true

- name: email-digest
  email_configs:
  - to: platform-team@ujamaa-defi.com
    send_resolved: false
    headers:
      Subject: '[UJAMAA Daily Alert Digest]'

- name: slack-critical
  slack_configs:
  - api_url: https://hooks.slack.com/services/XXX/YYY/ZZZ
    channel: '#alerts-critical'
    title: '[CRITICAL] {{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    text: '{{ range .Alerts }}{{ .Annotations.description }}\nRunbook: {{ .Annotations.runbook_url }}{{ end }}'
    send_resolved: true

inhibit_rules:
# If service is down, don't alert on high latency
- source_match:
    alertname: ServiceDown
  target_match:
    alertname: HighLatency
  equal: ['service']

# If node is down, don't alert on pod pending
- source_match:
    alertname: NodeDown
  target_match:
    alertname: PodPending
  equal: ['node']
```

## 13.3 Incident Response Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INCIDENT RESPONSE FLOW                                │
│                                                                              │
│  1. Detection                                                                │
│     └─> Alert fires in Prometheus                                           │
│     └─> Alertmanager routes to PagerDuty                                    │
│     └─> On-call engineer paged                                              │
│                                                                              │
│  2. Triage (0-5 minutes)                                                     │
│     └─> Acknowledge alert in PagerDuty                                      │
│     └─> Check Grafana dashboard                                             │
│     └─> Assess severity and impact                                          │
│     └─> Create incident in incident management system                       │
│                                                                              │
│  3. Diagnosis (5-15 minutes)                                                 │
│     └─> Follow runbook                                                      │
│     └─> Check logs, metrics, traces                                         │
│     └─> Identify root cause                                                 │
│     └─> Update incident status                                              │
│                                                                              │
│  4. Resolution (15-60 minutes)                                               │
│     └─> Implement fix                                                       │
│     └─> Verify resolution                                                   │
│     └─> Monitor for stability                                               │
│     └─> Close alert                                                         │
│                                                                              │
│  5. Post-Incident (1-7 days)                                                 │
│     └─> Write incident report                                               │
│     └─> Schedule post-mortem                                                │
│     └─> Identify action items                                               │
│     └─> Update runbooks                                                     │
│     └─> Implement preventive measures                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 13.4 Incident Severity Levels

| Severity | Description | Response Time | Update Frequency |
|----------|-------------|---------------|------------------|
| **SEV1** | Complete outage, data loss | 5 minutes | Every 15 minutes |
| **SEV2** | Major feature broken, high impact | 15 minutes | Every 30 minutes |
| **SEV3** | Partial degradation, workaround exists | 1 hour | Every 2 hours |
| **SEV4** | Minor issue, low impact | 4 hours | Daily |

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-27 | SRE Lead | Initial release |

**Related Documents**

- `01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - Requirements specification
- `02_ARCHITECTURE_SPECIFICATION.md` - System architecture
- `05_SMART_CONTRACT_SPECIFICATION.md` - Blockchain monitoring requirements
- `06_DEPLOYMENT_GUIDE.md` - Infrastructure deployment
- `08_OPERATIONAL_RUNBOOKS.md` - Incident response procedures

**Runbooks Repository**

- `https://github.com/ujamaa-defi/runbooks`

