# MVP Monitoring and Alerting Setup

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** March 18, 2026

---

## Overview

This document describes the monitoring and alerting setup for MVP deployment on Polygon Amoy testnet.

---

## 1. Monitoring Stack

### 1.1 Components

| Component | Purpose | Provider |
|-----------|---------|----------|
| **Application Monitoring** | Error tracking, performance | Sentry |
| **Infrastructure Monitoring** | Server metrics, logs | AWS CloudWatch / Grafana |
| **Blockchain Monitoring** | Contract events, transactions | The Graph / Alchemy |
| **uLPime Monitoring** | Service availability | uLPimeRobot / Pingdom |
| **Log Aggregation** | Centralized logging | ELK Stack / Datadog |

### 1.2 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Sentry     │  │   Grafana    │  │  CloudWatch  │      │
│  │   (Errors)   │  │  (Metrics)   │  │   (Infra)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           │                                 │
│                    ┌──────▼──────┐                          │
│                    │  Alerting   │                          │
│                    │  (PagerDuty)│                          │
│                    └──────┬──────┘                          │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐              │
│         │                 │                 │              │
│    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐         │
│    │  Slack  │      │  Email  │      │  SMS    │         │
│    └─────────┘      └─────────┘      └─────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Application Monitoring (Sentry)

### 2.1 Setup

```bash
# Install Sentry SDK
pip install sentry-sdk  # Backend
npm install @sentry/react  # Frontend
```

### 2.2 Backend Configuration

```python
# backend/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
    environment=os.getenv("ENVIRONMENT", "development"),
    release=f"MVP@{__version__}",
)
```

### 2.3 Frontend Configuration

```typescript
// frontend/src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENVIRONMENT,
  release: "MVP@1.0.0",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 2.4 Alert Rules

| Alert | Condition | Severity | Channel |
|-------|-----------|----------|---------|
| Error Rate Spike | >1% of requests | Critical | Slack + SMS |
| New Error Type | Any new error | High | Slack |
| API Latency P95 | >1000ms | High | Slack |
| Frontend JS Errors | >10/min | Medium | Slack |

---

## 3. Infrastructure Monitoring

### 3.1 Metrics to Track

| Metric | Threshold | Alert |
|--------|-----------|-------|
| CPU Usage | >80% | Warning |
| Memory Usage | >85% | Warning |
| Disk Usage | >90% | Critical |
| Network I/O | Unusual spike | Warning |
| Request Rate | >1000 req/s | Info |

### 3.2 CloudWatch Alarms (AWS)

```json
{
  "AlarmName": "MVP-Backend-HighCPU",
  "MetricName": "CPUUtilization",
  "Threshold": 80,
  "Period": 300,
  "EvaluationPeriods": 2,
  "ComparisonOperator": "GreaterThanThreshold",
  "AlarmActions": ["arn:aws:sns:..."],
  "OKActions": ["arn:aws:sns:..."]
}
```

### 3.3 Grafana Dashboards

Create dashboards for:
- **API Performance:** Request rate, latency, error rate
- **Backend Health:** CPU, memory, disk, connections
- **Database:** Query latency, connections, slow queries
- **Blockchain:** Gas prices, transaction confirmations

---

## 4. Blockchain Monitoring

### 4.1 Contract Events

Monitor these contract events:

| Event | Contract | Purpose |
|-------|----------|---------|
| `Deposited` | uLPToken | Track deposits |
| `Redeemed` | uLPToken | Track redemptions |
| `PoolCreated` | LiquidityPool | Track new pools |
| `FundDeployed` | LiquidityPool | Track financings |
| `RepaymentRecorded` | LiquidityPool | Track repayments |

### 4.2 The Graph Subgraph

```graphql
# subgraph/schema.graphql
type Deposit @entity {
  id: ID!
  investor: Bytes!
  amount: BigInt!
  timestamp: BigInt!
  transactionHash: Bytes!
}

type Pool @entity {
  id: ID!
  name: String!
  family: String!
  totalValue: BigInt!
  createdAt: BigInt!
}
```

### 4.3 Alchemy Notify

Set up Alchemy Notify for:
- Mined transactions (contract addresses)
- Activity alerts (large transfers)
- Gas price alerts

---

## 5. uLPime Monitoring

### 5.1 Endpoints to Monitor

| Endpoint | Check Interval | Timeout | Expected |
|----------|----------------|---------|----------|
| `https://testnet.ujamaa-defi.com/` | 1 min | 10s | HTTP 200 |
| `https://api.testnet.ujamaa-defi.com/api/v2/health` | 1 min | 5s | HTTP 200 |
| `https://rpc-amoy.polygon.technology/` | 5 min | 10s | HTTP 200 |

### 5.2 uLPimeRobot Setup

```json
{
  "monitor_type": 1,
  "url": "https://api.testnet.ujamaa-defi.com/api/v2/health",
  "friendly_name": "MVP API Health",
  "interval": 60,
  "timeout": 5,
  "alert_contacts": [123456]
}
```

### 5.3 Alert Escalation

| Downtime Duration | Action |
|-------------------|--------|
| 1 minute | Slack notification |
| 5 minutes | Email on-call |
| 15 minutes | SMS on-call |
| 30 minutes | Page engineering lead |

---

## 6. Log Aggregation

### 6.1 Log Format

```json
{
  "timestamp": "2026-03-18T10:00:00Z",
  "level": "INFO",
  "service": "ujamaa-MVP-backend",
  "environment": "testnet",
  "trace_id": "abc123",
  "message": "Investment processed successfully",
  "data": {
    "investor_id": "INV-001",
    "pool_id": "POOL-001",
    "amount": "1000000"
  }
}
```

### 6.2 Log Levels

| Level | Usage |
|-------|-------|
| `ERROR` | Errors that require attention |
| `WARN` | Potential issues, degraded performance |
| `INFO` | Normal operations, user actions |
| `DEBUG` | Detailed debugging information |

### 6.3 Log Retention

| Environment | Retention Period |
|-------------|------------------|
| Testnet | 30 days |
| Production | 90 days |
| Audit logs | 7 years |

---

## 7. Alerting Configuration

### 7.1 PagerDuty Integration

```yaml
# pagerduty.yml
service:
  name: "MVP Platform"
  escalation_policy:
    - name: "Primary On-Call"
      delay_minutes: 0
      targets:
        - type: schedule
          id: "SCHEDULE_ID"
    - name: "Secondary On-Call"
      delay_minutes: 15
      targets:
        - type: user
          id: "USER_ID"
```

### 7.2 Alert Templates

**Critical Alert:**
```
🚨 CRITICAL: {service_name} - {alert_name}

Status: {status}
Severity: Critical
Started: {started_at}

Description:
{alert_description}

Runbook: {runbook_url}
Dashboard: {dashboard_url}

@channel
```

**Warning Alert:**
```
⚠️ WARNING: {service_name} - {alert_name}

Status: {status}
Severity: Warning

Description:
{alert_description}

Dashboard: {dashboard_url}
```

### 7.3 Notification Channels

| Severity | Slack | Email | SMS | PagerDuty |
|----------|-------|-------|-----|-----------|
| Critical | ✅ | ✅ | ✅ | ✅ |
| High | ✅ | ✅ | ❌ | ✅ |
| Medium | ✅ | ❌ | ❌ | ❌ |
| Low | ✅ | ❌ | ❌ | ❌ |

---

## 8. Dashboard Templates

### 8.1 Executive Dashboard

- Total Value Locked (TVL)
- Total Investors
- Total Yield Distributed
- Platform uLPime (%)
- Average APY

### 8.2 Operations Dashboard

- API Request Rate
- API Latency (P50, P90, P95, P99)
- Error Rate (%)
- Active Connections
- Database Query Latency

### 8.3 Security Dashboard

- Failed Login Attempts
- Blocked Jurisdictions Checks
- Frozen Accounts
- Suspicious Activity Alerts
- Rate Limit Hits

---

## 9. Incident Response

### 9.1 Severity Levels

| Severity | Response Time | Resolution Time |
|----------|---------------|-----------------|
| P0 (Critical) | 5 minutes | 1 hour |
| P1 (High) | 15 minutes | 4 hours |
| P2 (Medium) | 1 hour | 24 hours |
| P3 (Low) | 4 hours | 1 week |

### 9.2 Incident Template

```markdown
## Incident: [Brief Description]

**Severity:** P0/P1/P2/P3
**Status:** Investigating/Identified/Monitoring/Resolved
**Started:** [Time]
**Resolved:** [Time]

### Impact
- Affected users: X
- Affected services: [List]
- Duration: X minutes

### Timeline
- [Time] - Alert triggered
- [Time] - On-call engaged
- [Time] - Root cause identified
- [Time] - Fix deployed
- [Time] - Service restored

### Root Cause
[Description]

### Resolution
[Actions taken]

### Follow-up Actions
- [ ] Action item 1
- [ ] Action item 2
```

---

## 10. Environment Variables

```bash
# Sentry
SENTRY_DSN=https://xxx@ingest.sentry.io/xxx
SENTRY_ENVIRONMENT=testnet

# CloudWatch
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1

# PagerDuty
PAGERDUTY_SERVICE_KEY=xxx
PAGERDUTY_API_KEY=xxx

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/xxx
SLACK_CHANNEL=#MVP-alerts

# uLPime
uLPIMEROBOT_API_KEY=xxx
```

---

**END OF MONITORING SETUP**
