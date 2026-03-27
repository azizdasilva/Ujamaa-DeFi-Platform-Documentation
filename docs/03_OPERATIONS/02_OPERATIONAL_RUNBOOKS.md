# Operational Runbooks

## Ujamaa DeFi Platform Incident Response & Operations

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** February 27, 2026
**Classification:** Internal / Operations
**Audience:** SREs, On-Call Engineers, DevOps, Platform Engineers

---

# Table of Contents

1. [Runbook Index](#1-runbook-index)
2. [Incident Response Procedures](#2-incident-response-procedures)
3. [Service Outages](#3-service-outages)
4. [Database Issues](#4-database-issues)
5. [Cache Issues](#5-cache-issues)
6. [Kafka Issues](#6-kafka-issues)
7. [Blockchain Issues](#7-blockchain-issues)
8. [Smart Contract Emergencies](#8-smart-contract-emergencies)
9. [Security Incidents](#9-security-incidents)
10. [Performance Degradation](#10-performance-degradation)
11. [Deployment Failures](#11-deployment-failures)
12. [Data Recovery](#12-data-recovery)
13. [Disaster Recovery](#13-disaster-recovery)
14. [Maintenance Procedures](#14-maintenance-procedures)

---

# 1. Runbook Index

## 1.1 Runbook Quick Reference

| Runbook ID | Title | Category | Severity | Estimated Time |
|------------|-------|----------|----------|----------------|
| **RB-001** | Service Down | Outage | Critical | 15-30 min |
| **RB-002** | High Error Rate | Outage | Critical | 15-45 min |
| **RB-003** | High Latency | Performance | Warning | 30-60 min |
| **RB-004** | Database Connection Exhaustion | Database | Critical | 15-30 min |
| **RB-005** | Database Replication Lag | Database | Warning | 30-60 min |
| **RB-006** | Redis Memory High | Cache | Warning | 15-30 min |
| **RB-007** | Redis Node Down | Cache | Critical | 10-20 min |
| **RB-008** | Kafka Consumer Lag High | Kafka | Warning | 30-60 min |
| **RB-009** | Kafka Broker Down | Kafka | Critical | 15-30 min |
| **RB-010** | Blockchain Sync Behind | Blockchain | Critical | 30-120 min |
| **RB-011** | Smart Contract Paused | Smart Contract | Critical | 5-15 min |
| **RB-012** | Bridge Transfer Stuck | Blockchain | Critical | 30-90 min |
| **RB-013** | DDoS Attack | Security | Critical | Immediate |
| **RB-014** | Data Breach | Security | Critical | Immediate |
| **RB-015** | API Key Compromise | Security | Critical | 15-30 min |
| **RB-016** | Deployment Failure | Deployment | Warning | 15-45 min |
| **RB-017** | Failed Rollback | Deployment | Critical | 30-60 min |
| **RB-018** | Data CorruLPion | Data | Critical | 1-4 hours |
| **RB-019** | Region Failover | DR | Critical | 15-30 min |
| **RB-020** | Certificate Renewal | Maintenance | Scheduled | 30 min |

## 1.2 Severity Classification

| Severity | Response Time | Description | Examples |
|----------|---------------|-------------|----------|
| **Critical (SEV1)** | 5 minutes | Complete outage, data loss, security breach | Service down, data breach, smart contract exploit |
| **High (SEV2)** | 15 minutes | Major feature broken, significant impact | High error rate, database issues, blockchain sync |
| **Medium (SEV3)** | 1 hour | Partial degradation, workaround exists | High latency, cache issues, single broker down |
| **Low (SEV4)** | 4 hours | Minor issue, low impact | Warning alerts, non-critical failures |

---

# 2. Incident Response Procedures

## 2.1 General Incident Response Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INCIDENT RESPONSE FLOW                                │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │  DETECTION  │───>│   TRIAGE    │───>│ DIAGNOSIS   │───>│ RESOLUTION  │  │
│  │             │    │             │    │             │    │             │  │
│  │ • Alert     │    │ • Ack       │    │ • Runbook   │    │ • Fix       │  │
│  │ • Page      │    │ • Severity  │    │ • Logs      │    │ • Verify    │  │
│  │ • Ticket    │    │ • Impact    │    │ • Metrics   │    │ • Monitor   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                                                          │        │
│         │                                                          ▼        │
│         │                                                 ┌─────────────┐  │
│         │                                                 │ POST-MORTEM │  │
│         │                                                 │             │  │
│         └────────────────────────────────────────────────>│ • Report    │  │
│                                                           │ • Actions   │  │
│                                                           │ • Learnings │  │
│                                                           └─────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

Time Targets:
• Detection to Page: <1 minute
• Page to Ack: <5 minutes (Critical), <15 minutes (High)
• Ack to Diagnosis: <10 minutes
• Diagnosis to Resolution: <60 minutes (Critical)
• Resolution to Close: <15 minutes
```

## 2.2 Incident Communication Template

```markdown
# Incident Update - {INCIDENT_ID}

**Status:** {Investigating | Identified | Monitoring | Resolved}
**Severity:** {SEV1 | SEV2 | SEV3 | SEV4}
**Last Updated:** {timestamp}

## Summary
{One-line description of the incident}

## Impact
- **Services Affected:** {list}
- **User Impact:** {description}
- **Start Time:** {timestamp}
- **Duration:** {elapsed time}

## Current Status
{What is happening now}

## Next Update
{When the next update is expected}

## Contact
- **Incident Commander:** {name}
- **Slack Channel:** #{channel}
- **Bridge:** {link if applicable}
```

## 2.3 Escalation Matrix

| Time Elapsed | Action | Who |
|--------------|--------|-----|
| 0 min | Alert fires, on-call paged | PagerDuty |
| 5 min | If no ack, escalate to secondary | PagerDuty |
| 10 min | If no ack, escalate to team lead | PagerDuty |
| 15 min | Incident declared, war room opened | On-call |
| 30 min | If unresolved, escalate to engineering manager | Incident Commander |
| 60 min | If unresolved, escalate to VP Engineering | Incident Commander |
| 120 min | If unresolved, executive briefing | VP Engineering |

---

# 3. Service Outages

## RB-001: Service Down

### Alert Details
- **Alert Name:** `ServiceDown`
- **Severity:** Critical (SEV1)
- **Team:** Platform

### Description
A FastAPI service pod has been unreachable for more than 2 minutes.

### Impact
- Users cannot access the affected service
- API requests fail with 503 errors
- SLO availability impacted

### Diagnosis

#### Step 1: Check Pod Status
```bash
# Get pod status
kubectl get pods -n ujamaa-production -l app={service-name} -o wide

# Expected: Running, Actual may be: CrashLoopBackOff, Error, Pending
```

#### Step 2: Describe Pod
```bash
kubectl describe pod {pod-name} -n ujamaa-production

# Check:
# - State: Waiting/Terminated/Running
# - Reason: OOMKilled, Error, Evicted
# - Events: scheduling issues, image pull errors
# - Last State: previous crash reason
```

#### Step 3: Check Logs
```bash
# Current logs
kubectl logs {pod-name} -n ujamaa-production --tail=200

# Previous instance (if crashed)
kubectl logs {pod-name} -n ujamaa-production --previous --tail=200

# Search for errors
kubectl logs {pod-name} -n ujamaa-production | grep -i "error\|exception\|panic\|fatal"
```

#### Step 4: Check Grafana
1. Open: https://grafana.ujamaa-defi.com/d/service-performance
2. Check panels:
   - Request rate (should be >0)
   - Error rate (should be 0%)
   - Latency p95 (should be <500ms)

### Resolution

#### If CrashLoopBackOff
```bash
# Check for OOM
kubectl describe pod {pod-name} | grep -A 5 "Last State"

# If OOMKilled, increase memory
kubectl edit deployment/{service-name} -n ujamaa-production
# Update: resources.limits.memory

# If application error, check logs for root cause
```

#### If Pending
```bash
# Check node resources
kubectl top nodes

# Check for scheduling issues
kubectl describe pod {pod-name} | grep -A 10 "Events:"

# If Insufficient CPU/Memory:
# Option 1: Scale down other deployments
# Option 2: Add nodes to cluster
kubectl scale nodegroup {nodegroup-name} --nodes=+1
```

#### If ImagePullBackOff
```bash
# Check image name and tag
kubectl describe pod {pod-name} | grep -A 5 "Image"

# Verify image exists in registry
docker pull ghcr.io/ujamaa-defi/{service-name}:{tag}

# Check image pull secrets
kubectl get secret {registry-secret} -n ujamaa-production
```

#### Emergency Rollback
```bash
# Rollback to previous version
kubectl rollout undo deployment/{service-name} -n ujamaa-production

# Watch rollout status
kubectl rollout status deployment/{service-name} -n ujamaa-production

# If rollback fails, force recreate
kubectl delete deployment {service-name} -n ujamaa-production
kubectl apply -f k8s/services/{service-name}.yaml
```

### Verification
```bash
# Pod is Running
kubectl get pods -n ujamaa-production -l app={service-name}

# Health check passes
curl https://api.ujamaa-defi.com/health/ready

# Check metrics in Grafana
# - Error rate should be 0%
# - Latency should be normal
```

### Post-Incident
- [ ] Create incident report
- [ ] Schedule post-mortem if SEV1/SEV2
- [ ] Update runbook if new failure mode
- [ ] Add monitoring for root cause if missing

---

## RB-002: High Error Rate

### Alert Details
- **Alert Name:** `HighErrorRate`
- **Severity:** Critical (SEV1)
- **Threshold:** >1% error rate for 5 minutes

### Description
Service is returning 5xx errors at a rate higher than 1%.

### Impact
- User requests failing
- Potential data inconsistency
- SLO violation

### Diagnosis

#### Step 1: Identify Error Pattern
```bash
# Check error rate by service
# Grafana: service-performance dashboard

# Check error logs
kubectl logs -l app={service-name} -n ujamaa-production \
  | grep -i "error\|exception" \
  | tail -100
```

#### Step 2: Categorize Errors
```logql
# In Grafana Explore (Loki)

# 500 errors (internal server errors)
{app="{service-name}"} | json | status_code = 500

# 502 errors (bad gateway)
{app="{service-name}"} | json | status_code = 502

# 503 errors (service unavailable)
{app="{service-name}"} | json | status_code = 503

# 504 errors (gateway timeout)
{app="{service-name}"} | json | status_code = 504
```

#### Step 3: Check Dependencies
```bash
# Database
kubectl exec {pod-name} -n ujamaa-production -- \
  psql -h postgres -U ujamaa -c "SELECT 1"

# Redis
kubectl exec {pod-name} -n ujamaa-production -- \
  redis-cli -h redis ping

# Kafka
kubectl exec {pod-name} -n ujamaa-production -- \
  kafka-topics --bootstrap-server kafka:9092 --list
```

### Resolution

#### If Database Errors
- See RB-004: Database Connection Exhaustion
- See RB-005: Database Replication Lag

#### If Redis Errors
- See RB-006: Redis Memory High
- See RB-007: Redis Node Down

#### If Application Errors
```bash
# Check for recent deployment
kubectl rollout history deployment/{service-name} -n ujamaa-production

# If recent deployment, rollback
kubectl rollout undo deployment/{service-name} -n ujamaa-production

# Check for resource exhaustion
kubectl top pod {pod-name} -n ujamaa-production

# If CPU throttling, increase CPU limits
kubectl edit deployment/{service-name} -n ujamaa-production
```

#### If Upstream Service Errors
```bash
# Check Istio service mesh
kubectl get virtualservice -n ujamaa-production

# Check for circuit breaker trips
kubectl logs -l app=istio-proxy -n ujamaa-production \
  | grep -i "circuit\|upstream"
```

### Verification
- [ ] Error rate <0.1% for 10 minutes
- [ ] No 5xx errors in logs
- [ ] All health checks passing

---

## RB-003: High Latency

### Alert Details
- **Alert Name:** `HighLatency`
- **Severity:** Warning (SEV3)
- **Threshold:** p95 >1s for 10 minutes

### Description
Service latency is exceeding acceptable thresholds.

### Impact
- Slow user experience
- Potential timeout errors
- SLO degradation

### Diagnosis

#### Step 1: Check Latency Distribution
```
# Grafana: service-performance dashboard
# Check:
# - p50, p95, p99 latency
# - Which endpoints are slow
# - When latency increased
```

#### Step 2: Check Traces
```
# Grafana: Tempo dashboard
# Query: {service.name="{service-name}"}
# Look for:
# - Slow spans
# - Database query time
# - External API calls
```

#### Step 3: Check Resource Utilization
```bash
# CPU throttling
kubectl top pod {pod-name} -n ujamaa-production

# Check if hitting limits
kubectl describe pod {pod-name} -n ujamaa-production \
  | grep -A 5 "Limits"
```

#### Step 4: Check Database
```sql
-- Slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Long running transactions
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

### Resolution

#### If CPU Throttling
```yaml
# Increase CPU limits
kubectl edit deployment/{service-name} -n ujamaa-production
# spec.template.spec.containers[0].resources.limits.cpu
```

#### If Database Slow
```sql
-- Kill long-running query
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'active' AND duration > interval '5 minutes';

-- Add missing index (if identified)
CREATE INDEX CONCURRENTLY idx_name ON table_name(column);
```

#### If Cache Miss
```bash
# Check cache hit rate
# Grafana: cache dashboard

# If low hit rate, check:
# - Cache eviction (memory pressure)
# - TTL too short
# - Cache key changes
```

### Verification
- [ ] p95 latency <500ms for 15 minutes
- [ ] p99 latency <1s
- [ ] No timeout errors

---

# 4. Database Issues

## RB-004: Database Connection Exhaustion

### Alert Details
- **Alert Name:** `DatabaseConnectionsHigh`
- **Severity:** Critical (SEV1)
- **Threshold:** >80% connections in use

### Description
Database connection pool is nearly exhausted.

### Impact
- New connections failing
- API requests timing out
- Service degradation

### Diagnosis

#### Step 1: Check Connection Count
```sql
-- Current connections
SELECT count(*) FROM pg_stat_activity;

-- Max connections
SHOW max_connections;

-- Connections by state
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;

-- Connections by application
SELECT application_name, count(*) 
FROM pg_stat_activity 
GROUP BY application_name;
```

#### Step 2: Check for Leaks
```bash
# Check pod connection pool
kubectl logs {pod-name} -n ujamaa-production \
  | grep -i "connection\|pool"

# Check for idle connections
kubectl exec -it {pod-name} -n ujamaa-production -- \
  python -c "from app.db import get_pool_stats; print(get_pool_stats())"
```

#### Step 3: Check for Locks
```sql
-- Active locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Blocking queries
SELECT blocked_locks.pid     AS blocked_pid,
       blocked_activity.usename  AS blocked_user,
       blocking_locks.pid     AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query    AS blocked_statement
FROM  pg_catalog.pg_locks         blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity  ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks         blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.GRANTED;
```

### Resolution

#### Immediate: Kill Idle Connections
```sql
-- Terminate idle connections older than 10 minutes
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND query_start < now() - interval '10 minutes';
```

#### If Connection Leak
```bash
# Restart affected pods to reset pools
kubectl rollout restart deployment/{service-name} -n ujamaa-production

# Monitor connection count
watch 'kubectl exec {pod-name} -n ujamaa-production -- python -c "from app.db import get_pool_stats; print(get_pool_stats())"'
```

#### If Legitimate High Load
```bash
# Scale service horizontally
kubectl scale deployment/{service-name} --replicas=+2 -n ujamaa-production

# Long-term: Increase max_connections (requires DB restart)
# aws rds modify-db-instance --db-instance-identifier ujamaa-prod \
#   --parameter-group-name new-params --apply-immediately
```

### Verification
- [ ] Connection usage <60%
- [ ] No connection timeout errors
- [ ] Query latency normal

---

## RB-005: Database Replication Lag

### Alert Details
- **Alert Name:** `DatabaseReplicationLag`
- **Severity:** Warning (SEV2)
- **Threshold:** >30 seconds lag

### Description
Read replica is falling behind primary database.

### Impact
- Stale reads from replica
- Potential data inconsistency
- Failover risk

### Diagnosis

#### Step 1: Check Replication Status
```sql
-- On primary
SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn,
       (extract(epoch from now()) - extract(epoch from replay_lag))::int as lag_seconds
FROM pg_stat_replication;

-- On replica
SELECT pg_is_in_recovery(),
       pg_last_wal_receive_lsn(),
       pg_last_wal_replay_lsn(),
       pg_last_xact_replay_timestamp();
```

#### Step 2: Check for Long Queries
```sql
-- Long running queries on replica
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

#### Step 3: Check Network
```bash
# Check network between primary and replica
kubectl exec {pod-name} -n ujamaa-production -- \
  ping -c 10 {replica-host}
```

### Resolution

#### If Long Queries
```sql
-- Kill long queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active' 
  AND query_start < now() - interval '30 minutes';
```

#### If Network Issues
```bash
# Check VPC peering, security groups
# AWS Console: VPC > Peering Connections

# Check for packet loss
mtr {replica-host}
```

#### If Persistent Lag
```bash
# Consider read-heavy query optimization
# Add read replicas
# Use read-write splitting at application level
```

### Verification
- [ ] Replication lag <10 seconds
- [ ] Replica in sync state
- [ ] Read queries returning current data

---

# 5. Cache Issues

## RB-006: Redis Memory High

### Alert Details
- **Alert Name:** `RedisMemoryHigh`
- **Severity:** Warning (SEV2)
- **Threshold:** >85% memory used

### Description
Redis instance is running low on memory.

### Impact
- Evictions may occur
- Cache miss rate increases
- Potential OOM

### Diagnosis

#### Step 1: Check Memory Usage
```bash
# Connect to Redis
redis-cli -h {redis-host}

# Memory info
INFO memory

# Memory breakdown
MEMORY STATS

# Largest keys
MEMORY DOCTOR
```

#### Step 2: Check Eviction
```bash
# Eviction stats
INFO stats | grep evicted

# Eviction policy
CONFIG GET maxmemory-policy
```

#### Step 3: Find Large Keys
```bash
# Find large keys (careful in production)
redis-cli --bigkeys

# Or use memory usage command
redis-cli MEMORY USAGE {key}
```

### Resolution

#### Immediate: Clear Expired Keys
```bash
# Force cleanup
redis-cli MEMORY PURGE

# Check keys with TTL
redis-cli SCAN 0 MATCH '*' COUNT 1000
```

#### If Specific Keys Too Large
```bash
# Delete large non-critical keys
redis-cli DEL {key-pattern}

# Or set shorter TTL
redis-cli EXPIRE {key} 3600
```

#### Long-term
```bash
# Increase memory (ElastiCache)
aws elasticache modify-cache-cluster \
  --cache-cluster-id {cluster-name} \
  --cache-node-type cache.r6g.large \
  --apply-immediately

# Or add more shards (cluster mode)
```

### Verification
- [ ] Memory usage <70%
- [ ] Eviction rate = 0
- [ ] Cache hit rate >80%

---

## RB-007: Redis Node Down

### Alert Details
- **Alert Name:** `RedisNodeDown`
- **Severity:** Critical (SEV1)

### Description
Redis node is unreachable.

### Impact
- Cache unavailable
- Increased database load
- Service degradation

### Diagnosis

```bash
# Check Redis cluster status
redis-cli -h {redis-host} CLUSTER INFO

# Check node status
redis-cli -h {redis-host} CLUSTER NODES

# Ping test
redis-cli -h {redis-host} ping
```

### Resolution

#### If Primary Down (ElastiCache)
```bash
# AWS should auto-failover
# Check failover status
aws elasticache describe-cache-clusters \
  --cache-cluster-id {cluster-name} \
  --show-cache-node-info

# If no failover, trigger manual
aws elasticache test-failover \
  --replication-group-id {group-id} \
  --node-group-id {node-group} \
  --cache-node-id {failed-node}
```

#### If Self-Managed
```bash
# Restart failed node
kubectl delete pod {redis-pod} -n ujamaa-production

# Wait for re-election
# Monitor cluster status
watch 'redis-cli CLUSTER INFO'
```

### Verification
- [ ] All nodes showing as connected
- [ ] Cluster state = ok
- [ ] Read/write operations successful

---

# 6. Kafka Issues

## RB-008: Kafka Consumer Lag High

### Alert Details
- **Alert Name:** `KafkaConsumerLagHigh`
- **Severity:** Warning (SEV2)
- **Threshold:** >10,000 messages

### Description
Kafka consumer is falling behind on message processing.

### Impact
- Delayed event processing
- Stale data in downstream systems
- Potential message backlog

### Diagnosis

#### Step 1: Check Consumer Lag
```bash
# List consumer groups
kafka-consumer-groups --bootstrap-server kafka:9092 --list

# Describe lag
kafka-consumer-groups --bootstrap-server kafka:9092 \
  --describe --group {consumer-group}
```

#### Step 2: Check Consumer Logs
```bash
kubectl logs -l app={consumer-service} -n ujamaa-production \
  | grep -i "error\|slow\|timeout" | tail -100
```

#### Step 3: Check Processing Time
```
# Grafana: kafka dashboard
# Check:
# - Message processing duration
# - Throughput (messages/second)
# - Error rate
```

### Resolution

#### If Slow Processing
```bash
# Scale consumer horizontally
kubectl scale deployment/{consumer-service} --replicas=+2 -n ujamaa-production

# Check for poison pills (messages causing errors)
# May need to skip or DLQ specific messages
```

#### If Consumer Errors
```bash
# Check for deserialization errors
kubectl logs {pod-name} -n ujamaa-production | grep -i "serialization"

# If schema changed, may need to:
# 1. Fix consumer code
# 2. Reset consumer offset
kafka-consumer-groups --bootstrap-server kafka:9092 \
  --group {group} --reset-offsets --to-latest --execute
```

### Verification
- [ ] Consumer lag <1,000 messages
- [ ] Processing rate > production rate
- [ ] No consumer errors

---

## RB-009: Kafka Broker Down

### Alert Details
- **Alert Name:** `KafkaBrokerDown`
- **Severity:** Critical (SEV1)

### Description
Kafka broker is unreachable.

### Impact
- Producer failures
- Consumer rebalancing
- Potential data loss if ISR shrinks

### Diagnosis

```bash
# Check broker status
kafka-broker-api-versions --bootstrap-server kafka:9092

# Check cluster metadata
kafka-metadata.sh --snapshot /var/kafka/data/__cluster_metadata-0/00000000000000000000.log

# Check under-replicated partitions
kafka-topics --bootstrap-server kafka:9092 \
  --describe --under-replicated-partitions
```

### Resolution

#### If MSK (Managed Kafka)
```bash
# AWS should auto-heal
# Check broker status
aws kafka list-nodes --cluster-arn {cluster-arn}

# If broker not recovering, contact AWS support
```

#### If Self-Managed
```bash
# Restart broker
kubectl delete pod {kafka-broker-pod} -n kafka

# Wait for broker to rejoin
watch 'kafka-broker-api-versions --bootstrap-server kafka:9092'

# Check for under-replicated partitions
kafka-topics --bootstrap-server kafka:9092 \
  --describe --under-replicated-partitions
```

### Verification
- [ ] All brokers online
- [ ] No under-replicated partitions
- [ ] Producer/consumer operations normal

---

# 7. Blockchain Issues

## RB-010: Blockchain Sync Behind

### Alert Details
- **Alert Name:** `BlockchainSyncBehind`
- **Severity:** Critical (SEV1)
- **Threshold:** >20 blocks behind

### Description
Blockchain node is significantly behind the network tip.

### Impact
- Stale blockchain data
- Transaction submission failures
- Compliance check failures

### Diagnosis

#### Step 1: Check Block Number
```bash
# Check current block
curl -X POST https://polygon-rpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Compare with expected (polygonscan.com)
```

#### Step 2: Check Peer Count
```bash
curl -X POST https://polygon-rpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}'
```

#### Step 3: Check Sync Status
```bash
curl -X POST https://polygon-rpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}'
```

### Resolution

#### If Using Third-Party RPC
```bash
# Switch to backup RPC
kubectl set env deployment/blockchain-exporter \
  RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/{key} \
  -n monitoring

# Update service configuration
kubectl edit configmap service-config -n ujamaa-production
# Update BLOCKCHAIN_RPC_URL
```

#### If Running Own Node
```bash
# Check node logs
kubectl logs -l app=polygon-node -n blockchain --tail=500

# Restart node
kubectl delete pod -l app=polygon-node -n blockchain

# Wait for sync (may take hours)
watch 'curl -s -X POST https://localhost:8545 -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}"'
```

### Verification
- [ ] Block lag <10 blocks
- [ ] Peer count >25
- [ ] Sync status = false (not syncing)

---

## RB-011: Smart Contract Paused

### Alert Details
- **Alert Name:** `SmartContractPaused`
- **Severity:** Critical (SEV1)

### Description
Smart contract has been paused (emergency stop).

### Impact
- All contract functions blocked
- No transfers possible
- Complete service outage for affected asset

### Diagnosis

#### Step 1: Check Contract State
```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider(RPC_URL))
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

# Check paused status
paused = contract.functions.paused().call()
print(f"Contract paused: {paused}")

# Check who paused it (from events)
events = contract.events.Paused().create_filter(
    fromBlock='latest',
    toBlock='latest'
)
for event in events.get_all_entries():
    print(f"Paused by: {event['account']}")
```

#### Step 2: Check Why Paused
```bash
# Check recent alerts
# Grafana: compliance dashboard

# Check for exploit attempts
# Check blockchain explorer for unusual transactions
```

### Resolution

#### If Intentional Pause (Security)
```bash
# Do NOT unpause until investigation complete
# Follow security incident procedures (RB-013)
```

#### If Accidental Pause
```python
# Unpause contract (requires admin multisig)
# This must be done via Gnosis Safe

# 1. Create transaction in Gnosis Safe
# 2. Get required signatures (5-of-9)
# 3. Execute transaction

# Contract call:
# contract.functions.unpause().transact({'from': ADMIN_ADDRESS})
```

### Verification
- [ ] Contract unpaused
- [ ] Transfer functions working
- [ ] No unusual transactions during pause

---

## RB-012: Bridge Transfer Stuck

### Alert Details
- **Alert Name:** `BridgeTransferDelayed`
- **Severity:** Critical (SEV1)
- **Threshold:** >30 minutes

### Description
Cross-chain bridge transfer is not completing.

### Impact
- Users cannot move assets between chains
- Liquidity fragmentation
- User funds temporarily inaccessible

### Diagnosis

#### Step 1: Check Transfer Status
```bash
# Check bridge contract events
# Etherscan/Polygonscan: check transaction status

# Check relayer status
kubectl logs -l app=bridge-relayer -n ujamaa-production --tail=200
```

#### Step 2: Check Multisig
```bash
# Check if relayers have signed
# Bridge dashboard: pending transfers

# Check multisig wallet
# Gnosis Safe: check pending transactions
```

### Resolution

#### If Relayer Issue
```bash
# Restart relayer
kubectl rollout restart deployment/bridge-relayer -n ujamaa-production

# Check relayer configuration
kubectl describe pod -l app=bridge-relayer -n ujamaa-production
```

#### If Multisig Stuck
```bash
# Contact relayer operators
# May need manual intervention to complete transfer

# As last resort, can initiate recovery via governance
```

### Verification
- [ ] Transfer completed on both chains
- [ ] User received wrapped tokens
- [ ] Bridge balance reconciled

---

# 8. Smart Contract Emergencies

## RB-013: Smart Contract Exploit

### Alert Details
- **Severity:** Critical (SEV1)
- **Team:** Security + Platform

### Description
Suspected or confirmed exploit of smart contract.

### Impact
- Potential loss of funds
- Protocol insolvency
- Reputational damage

### Immediate Actions (First 15 Minutes)

#### Step 1: Pause Contract
```bash
# EMERGENCY: Pause all contracts via multisig
# Gnosis Safe: execute pause() function
# Requires 1-of-9 for emergency pause (if configured)

# Or call pause() directly if you have PAUSER_ROLE
```

#### Step 2: Stop Bridge
```bash
# Pause bridge contracts
# Prevent further cross-chain movement
```

#### Step 3: Notify Team
```bash
# Page security team
# Create emergency war room
# Notify legal/compliance
```

### Diagnosis

#### Step 1: Identify Exploit Vector
```bash
# Check blockchain explorer for suspicious transactions
# Analyze transaction patterns
# Check for reentrancy, overflow, access control bypass
```

#### Step 2: Assess Damage
```python
# Check contract balances before/after
# Calculate funds lost
# Identify affected users
```

### Resolution

#### If Confirmed Exploit
```bash
# 1. Keep contracts paused
# 2. Engage security auditors
# 3. Prepare communication
# 4. Plan recovery (upgrade, migration, compensation)
```

### Post-Incident
- [ ] Security audit
- [ ] Public disclosure
- [ ] User compensation plan
- [ ] Contract upgrade with fix
- [ ] Bug bounty payout

---

# 9. Security Incidents

## RB-014: DDoS Attack

### Alert Details
- **Severity:** Critical (SEV1)

### Description
Distributed denial of service attack detected.

### Impact
- Service unavailable
- Legitimate users blocked
- Infrastructure costs

### Immediate Actions

#### Step 1: Enable DDoS Protection
```bash
# AWS Shield Advanced should auto-mitigate
# Check AWS Shield console

# Enable AWS WAF rate limiting
aws wafv2 update-web-acl \
  --name ujamaa-waf \
  --scope REGIONAL \
  --default-action Block
```

#### Step 2: Scale Infrastructure
```bash
# Enable CloudFront caching
# Scale ALB
# Enable auto-scaling for EKS nodes
```

#### Step 3: Block Attack Vectors
```bash
# Add IP blocks to WAF
# Block geographic regions if appropriate
# Implement CAPTCHA for suspicious traffic
```

### Verification
- [ ] Attack traffic mitigated
- [ ] Legitimate traffic flowing
- [ ] Error rates normal

---

## RB-015: API Key Compromise

### Alert Details
- **Severity:** Critical (SEV1)

### Description
API key or secret has been leaked or compromised.

### Impact
- Unauthorized access
- Potential data breach
- Financial loss

### Immediate Actions

#### Step 1: Revoke Compromised Key
```bash
# Rotate immediately
aws secretsmanager rotate-secret --secret-id {secret-name}

# Revoke API key
kubectl delete secret {api-key-secret} -n ujamaa-production
```

#### Step 2: Audit Access
```bash
# Check CloudTrail for unauthorized access
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue={key-id}

# Check application logs for suspicious activity
```

#### Step 3: Issue New Credentials
```bash
# Generate new API key
# Update all systems using the key
# Notify affected parties
```

### Verification
- [ ] Old key revoked
- [ ] New key deployed
- [ ] No unauthorized access detected

---

# 10. Performance Degradation

## RB-016: API Performance Degradation

### Alert Details
- **Severity:** Warning (SEV3)

### Description
API response times are degraded but not failing.

### Impact
- Poor user experience
- Potential SLO violation

### Diagnosis

```bash
# Check APM traces
# Grafana: Tempo dashboard

# Identify slow endpoints
# Check database query times
# Check external API dependencies
```

### Resolution

#### If Database Slow
- See RB-004, RB-005

#### If Cache Issue
- See RB-006, RB-007

#### If Code Issue
```bash
# Check for recent deployment
# Consider rollback
kubectl rollout undo deployment/{service-name} -n ujamaa-production
```

---

# 11. Deployment Failures

## RB-017: Deployment Failure

### Alert Details
- **Severity:** Warning (SEV2)

### Description
Kubernetes deployment failed to roll out.

### Impact
- New features delayed
- Potential service impact if replacing pods

### Diagnosis

```bash
# Check rollout status
kubectl rollout status deployment/{service-name} -n ujamaa-production

# Check why stuck
kubectl describe deployment {service-name} -n ujamaa-production

# Check pod events
kubectl get events -n ujamaa-production --sort-by='.lastTimestamp'
```

### Resolution

#### If Image Pull Error
```bash
# Verify image exists
docker pull ghcr.io/ujamaa-defi/{service}:{tag}

# Fix image tag
kubectl set image deployment/{service-name} \
  {service-name}=ghcr.io/ujamaa-defi/{service}:{correct-tag} \
  -n ujamaa-production
```

#### If Resource Issues
```bash
# Check resource quotas
kubectl describe quota -n ujamaa-production

# Adjust resources
kubectl edit deployment/{service-name} -n ujamaa-production
```

#### Rollback
```bash
kubectl rollout undo deployment/{service-name} -n ujamaa-production
```

---

# 12. Data Recovery

## RB-018: Data CorruLPion

### Alert Details
- **Severity:** Critical (SEV1)

### Description
Data corruLPion detected in database.

### Impact
- Data integrity compromised
- Potential financial impact

### Recovery Steps

#### Step 1: Stop Writes
```bash
# Pause affected services
kubectl scale deployment/{service-name} --replicas=0 -n ujamaa-production
```

#### Step 2: Assess Damage
```sql
-- Check affected tables
-- Identify corruLPion scope
```

#### Step 3: Restore from Backup
```bash
# Restore from latest clean backup
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier ujamaa-prod \
  --target-db-instance-identifier ujamaa-recovery \
  --restore-time 2026-02-27T10:00:00Z
```

#### Step 4: Verify and Switch
```bash
# Verify data integrity
# Switch application to recovered database
```

---

# 13. Disaster Recovery

## RB-019: Region Failover

### Alert Details
- **Severity:** Critical (SEV1)

### Description
Primary region (AWS af-south-1) unavailable.

### Impact
- Complete service outage in primary region
- Need to failover to DR (GCP africa-south1)

### Failover Steps

#### Step 1: Confirm Outage
```bash
# Check AWS status
# Check all services down
# Confirm not network issue
```

#### Step 2: DNS Failover
```bash
# Update Route53 health check
# Failover to GCP
# TTL should be low (60s)
```

#### Step 3: Scale DR
```bash
# Scale GKE to production capacity
kubectl scale deployment --all --replicas=3 -n ujamaa-production --context gcp-context

# Promote database
gcloud sql instances promote-replica ujamaa-dr
```

#### Step 4: Verify
```bash
# Run health checks
# Verify all services
# Monitor error rates
```

### Failback
- Wait for primary region recovery
- Re-establish replication
- Schedule maintenance window
- Execute controlled failback

---

# 14. Maintenance Procedures

## RB-020: Certificate Renewal

### Schedule
- **Frequency:** Every 90 days (Let's Encrypt)
- **Window:** Sunday 02:00-04:00 UTC

### Steps

#### Step 1: Pre-Renewal Check
```bash
# Check current cert expiry
openssl s_client -connect api.ujamaa-defi.com:443 \
  | openssl x509 -noout -dates
```

#### Step 2: Renew Certificate
```bash
# Certbot auto-renewal (should be automated)
certbot renew --dry-run

# Force renew if needed
certbot renew --force-renewal
```

#### Step 3: Reload Services
```bash
# Reload nginx/ingress
kubectl rollout restart deployment/ingress-nginx -n ingress-nginx
```

#### Step 4: Verify
```bash
# Check new cert
openssl s_client -connect api.ujamaa-defi.com:443 \
  | openssl x509 -noout -dates

# Verify in browser
```

---

## RB-021: Database Maintenance

### Schedule
- **Frequency:** Monthly
- **Window:** Sunday 03:00-05:00 UTC

### Steps

#### Step 1: Pre-Maintenance
```bash
# Notify users (48h advance)
# Take backup
aws rds create-db-snapshot \
  --db-instance-identifier ujamaa-prod \
  --db-snapshot-identifier pre-maintenance-$(date +%Y%m%d)
```

#### Step 2: Run Maintenance
```sql
-- Vacuum analyze
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE ujamaa_prod;

-- Update statistics
ANALYZE;
```

#### Step 3: Verify
```bash
# Check database performance
# Run smoke tests
```

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-27 | SRE Lead | Initial release |

**Related Documents**

- `01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md` - Requirements specification
- `02_ARCHITECTURE_SPECIFICATION.md` - System architecture
- `06_DEPLOYMENT_GUIDE.md` - Infrastructure details
- `07_MONITORING_SPECIFICATION.md` - Alert definitions

**Runbooks Repository**

- https://github.com/ujamaa-defi/runbooks

