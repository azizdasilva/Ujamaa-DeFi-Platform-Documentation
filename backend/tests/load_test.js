# k6 Load Testing Script for MVP-2 Backend
# Reference: 02_MVP_IMPLEMENTATION_PLAN.md Phase 5
# 
# Install: npm install -g k6
# Run: k6 run --vus 100 --duration 5m backend/tests/load_test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

// Test configuration
export const options = {
    stages: [
        { duration: '30s', target: 20 },   // Ramp up to 20 users
        { duration: '1m', target: 50 },    // Ramp up to 50 users
        { duration: '2m', target: 100 },   // Ramp up to 100 users (target load)
        { duration: '1m', target: 100 },   // Stay at 100 users
        { duration: '30s', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'],    // Error rate should be less than 1%
        errors: ['rate<0.01'],
        api_latency: ['p(95)<500'],
    },
};

const BASE_URL = 'http://localhost:8000';

// Test data
const testInvestor = {
    investor_id: `LOAD-TEST-${__VU}`,
    jurisdiction: 'MU',
    name: `Load Test Investor ${__VU}`,
    entity_type: 'INDIVIDUAL',
};

const investmentPayload = {
    pool_id: 'POOL_INDUSTRIE',
    amount: '1000000000000000000000', // 1K UJEUR
    investor_id: testInvestor.investor_id,
};

// =============================================================================
// Load Test Scenarios
// =============================================================================

export default function () {
    let response;
    
    // Scenario 1: Health Check (lightweight)
    response = http.get(`${BASE_URL}/health`);
    check(response, {
        'health check status 200': (r) => r.status === 200,
    });
    errorRate.add(response.status !== 200);
    apiLatency.add(response.timings.duration);
    sleep(0.5);
    
    // Scenario 2: Get Config
    response = http.get(`${BASE_URL}/config`);
    check(response, {
        'config status 200': (r) => r.status === 200,
        'config has testnet': (r) => JSON.parse(r.body).is_testnet === true,
    });
    errorRate.add(response.status !== 200);
    apiLatency.add(response.timings.duration);
    sleep(0.5);
    
    // Scenario 3: List Pools
    response = http.get(`${BASE_URL}/api/v2/pools`);
    check(response, {
        'list pools status 200': (r) => r.status === 200,
        'list pools returns 5': (r) => JSON.parse(r.body).length === 5,
    });
    errorRate.add(response.status !== 200);
    apiLatency.add(response.timings.duration);
    sleep(0.5);
    
    // Scenario 4: Get Pool Details
    response = http.get(`${BASE_URL}/api/v2/pools/POOL_INDUSTRIE`);
    check(response, {
        'pool details status 200': (r) => r.status === 200,
        'pool details has id': (r) => JSON.parse(r.body).id === 'POOL_INDUSTRIE',
    });
    errorRate.add(response.status !== 200);
    apiLatency.add(response.timings.duration);
    sleep(0.5);
    
    // Scenario 5: Check Jurisdiction
    response = http.post(
        `${BASE_URL}/api/v2/compliance/check-jurisdiction`,
        JSON.stringify({ jurisdiction: 'MU' }),
        { headers: { 'Content-Type': 'application/json' } }
    );
    check(response, {
        'jurisdiction check status 200': (r) => r.status === 200,
        'jurisdiction allowed': (r) => JSON.parse(r.body).is_allowed === true,
    });
    errorRate.add(response.status !== 200);
    apiLatency.add(response.timings.duration);
    sleep(0.5);
    
    // Scenario 6: Register Investor (once per VU)
    if (__ITER === 0) {
        response = http.post(
            `${BASE_URL}/api/v2/compliance/investors/register`,
            JSON.stringify(testInvestor),
            { headers: { 'Content-Type': 'application/json' } }
        );
        check(response, {
            'register investor status 200': (r) => r.status === 200,
        });
        errorRate.add(response.status !== 200);
        apiLatency.add(response.timings.duration);
        sleep(0.5);
        
        // Scenario 7: Invest in Pool (once per VU)
        response = http.post(
            `${BASE_URL}/api/v2/pools/POOL_INDUSTRIE/invest`,
            JSON.stringify(investmentPayload),
            { headers: { 'Content-Type': 'application/json' } }
        );
        check(response, {
            'invest status 200': (r) => r.status === 200,
            'invest success': (r) => JSON.parse(r.body).success === true,
        });
        errorRate.add(response.status !== 200);
        apiLatency.add(response.timings.duration);
        sleep(0.5);
        
        // Scenario 8: Get Portfolio (once per VU)
        response = http.get(`${BASE_URL}/api/v2/pools/portfolio/${testInvestor.investor_id}`);
        check(response, {
            'portfolio status 200': (r) => r.status === 200,
        });
        errorRate.add(response.status !== 200);
        apiLatency.add(response.timings.duration);
        sleep(0.5);
    }
    
    // Scenario 9: Get Blocked Jurisdictions
    response = http.get(`${BASE_URL}/api/v2/compliance/blocked-jurisdictions`);
    check(response, {
        'blocked jurisdictions status 200': (r) => r.status === 200,
    });
    errorRate.add(response.status !== 200);
    apiLatency.add(response.timings.duration);
    sleep(0.5);
    
    // Scenario 10: Get Pool Stats
    response = http.get(`${BASE_URL}/api/v2/pools/POOL_AGRICULTURE/stats`);
    check(response, {
        'pool stats status 200': (r) => r.status === 200,
    });
    errorRate.add(response.status !== 200);
    apiLatency.add(response.timings.duration);
    sleep(1);
}

// =============================================================================
// Summary Handler
// =============================================================================

export function handleSummary(data) {
    return {
        'backend/tests/load_test_results.json': JSON.stringify(data, null, 2),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}

function textSummary(data, options) {
    const { http_req_duration, http_req_failed } = data.metrics;
    const p95 = http_req_duration.values['p(95)'];
    const failRate = http_req_failed.values.rate * 100;
    
    return `
${options.indent}Load Test Summary:
${options.indent}  P95 Latency: ${p95.toFixed(2)}ms (target: <500ms)
${options.indent}  Error Rate: ${failRate.toFixed(2)}% (target: <1%)
${options.indent}  Total Requests: ${data.metrics.http_reqs.values.count}
${options.indent}  Requests/sec: ${(data.metrics.http_reqs.values.count / data.state.testRunDurationMs * 1000).toFixed(2)}
`;
}
