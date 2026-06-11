# SmartTradeBot Backend Changes Required

This file documents the Python/Flask backend changes needed to support the completed React frontend for EMA Strategy v2.

Frontend base URL:

```text
http://localhost:5001
```

All JSON APIs should return `Content-Type: application/json`.

---

## 1. CORS

Allow the Vite frontend origin during development:

```text
http://localhost:5173
```

Required methods:

```text
GET, POST, OPTIONS
```

Required headers:

```text
Content-Type
```

---

## 2. Authentication

### Zerodha Login Redirect

Frontend button opens:

```http
GET /auth/login
```

Backend should redirect the user to Zerodha Kite login.

After Zerodha login, backend should send the browser back to the frontend with query params if possible:

```text
http://localhost:5173/login?request_token=<token>&user_id=<zerodha_user_id>
```

If `user_id` is not known at redirect time, the frontend still allows manual entry.

### Token Exchange

Frontend calls:

```http
POST /auth/login
```

Payload:

```json
{
  "request_token": "generated_by_zerodha",
  "user_id": "UPP323"
}
```

Expected success response:

```json
{
  "message": "login_successful",
  "user_id": "UPP323",
  "access_token": "...",
  "session_data": {}
}
```

Notes:

- Frontend stores only `user_id` and `loggedIn`.
- Frontend does not display the access token.
- Backend should return a non-2xx response with an `error` message on login failure.

---

## 3. Worker Health

Frontend polls every 30 seconds:

```http
GET /worker/health
```

Expected response:

```json
{
  "status": "ok",
  "interval_seconds": 15
}
```

Frontend treats `status: "ok"` or `status: "running"` as Running. Any failed request is shown as Offline.

Recommended backend behavior:

- Return HTTP `200` if the worker process/check loop is healthy.
- Return HTTP `503` if the worker is unavailable.
- Include `interval_seconds` from the actual worker configuration.

---

## 4. EMA Strategy Activation

Frontend calls:

```http
POST /strategy/activate
```

Payload:

```json
{
  "symbol": "INFY",
  "ema_period": 100,
  "buy_time_start": "15:15",
  "buy_time_end": "15:30",
  "stage_1_profit_percent": 10,
  "stage_2_profit_percent": 20,
  "stage_3_profit_percent": 30,
  "stop_loss_percent": 15,
  "max_position_size": 1000,
  "max_capital_allocation": 50000,
  "max_daily_loss": 5000
}
```

Expected response:

```json
{
  "message": "strategy_activated",
  "strategy_id": 1
}
```

Required backend validation:

- `symbol` is required and should be normalized to uppercase.
- `ema_period > 0`.
- `buy_time_start` and `buy_time_end` are required in `HH:MM` format.
- `buy_time_end > buy_time_start`.
- `stage_1_profit_percent > 0`.
- `stage_2_profit_percent > stage_1_profit_percent`.
- `stage_3_profit_percent > stage_2_profit_percent`.
- `stop_loss_percent > 0`.
- `max_position_size > 0`.
- `max_capital_allocation > 0`.
- `max_daily_loss > 0`.

Recommended failure response:

```json
{
  "error": "validation_failed",
  "details": {
    "ema_period": "EMA period must be greater than 0"
  }
}
```

Use HTTP `400` for validation errors.

---

## 5. Strategy Status

Frontend polls every 15 seconds:

```http
GET /strategy/status
```

Expected response:

```json
{
  "active_strategies": [
    {
      "id": 1,
      "symbol": "INFY",
      "ema_period": 100,
      "buy_time_start": "15:15",
      "buy_time_end": "15:30",
      "stage_1_profit_percent": 10,
      "stage_2_profit_percent": 20,
      "stage_3_profit_percent": 30,
      "stop_loss_percent": 15,
      "max_position_size": 1000,
      "max_capital_allocation": 50000,
      "max_daily_loss": 5000,
      "current_position_quantity": 250,
      "current_position_avg_price": 163.33,
      "total_pnl": 5400,
      "status": "ACTIVE",
      "stage_1_completed": true,
      "stage_2_completed": false,
      "stage_3_completed": false
    }
  ]
}
```

Required fields for every strategy object:

```text
id
symbol
ema_period
buy_time_start
buy_time_end
stage_1_profit_percent
stage_2_profit_percent
stage_3_profit_percent
stop_loss_percent
max_position_size
max_capital_allocation
max_daily_loss
current_position_quantity
current_position_avg_price
total_pnl
status
stage_1_completed
stage_2_completed
stage_3_completed
```

Allowed `status` values:

```text
ACTIVE
PAUSED
STOPPED
COMPLETED
```

Frontend derives dashboard values from this response:

- Total active strategies: count where `status === "ACTIVE"`.
- Total quantity held: sum of `current_position_quantity`.
- Total capital utilized: sum of `current_position_quantity * current_position_avg_price`.
- Total unrealized P&L: sum of `total_pnl`.
- Recent activity: first 5 strategies from `active_strategies`.

Backend should return an empty array when no strategies exist:

```json
{
  "active_strategies": []
}
```

---

## 6. Strategy Deactivate

Frontend calls after confirmation:

```http
POST /strategy/deactivate
```

Payload:

```json
{
  "strategy_id": 1
}
```

Expected response:

```json
{
  "message": "strategy_deactivated",
  "strategy_id": 1
}
```

Recommended backend behavior:

- Mark strategy as `STOPPED`.
- Stop worker evaluation for that strategy.
- Do not delete historical strategy/order data.
- Return HTTP `404` if `strategy_id` does not exist.

---

## 7. Strategy Pause

The frontend has a Pause button for active strategies.

Frontend calls:

```http
POST /strategy/pause
```

Payload:

```json
{
  "strategy_id": 1
}
```

Expected response:

```json
{
  "message": "strategy_paused",
  "strategy_id": 1
}
```

Recommended backend behavior:

- Only allow pause when `status === "ACTIVE"`.
- Change status to `PAUSED`.
- Worker should skip new evaluation/execution for paused strategies.
- Existing positions should remain visible in `/strategy/status`.

Recommended error responses:

- HTTP `404` if strategy does not exist.
- HTTP `409` if strategy cannot be paused from its current state.

---

## 8. Strategy Resume

The frontend has a Resume button for paused strategies.

Frontend calls:

```http
POST /strategy/resume
```

Payload:

```json
{
  "strategy_id": 1
}
```

Expected response:

```json
{
  "message": "strategy_resumed",
  "strategy_id": 1
}
```

Recommended backend behavior:

- Only allow resume when `status === "PAUSED"`.
- Change status to `ACTIVE`.
- Worker should resume evaluation on its next cycle.

Recommended error responses:

- HTTP `404` if strategy does not exist.
- HTTP `409` if strategy cannot be resumed from its current state.

---

## 9. Database / Model Fields

The strategy persistence model should include at least:

```text
id
symbol
ema_period
buy_time_start
buy_time_end
stage_1_profit_percent
stage_2_profit_percent
stage_3_profit_percent
stop_loss_percent
max_position_size
max_capital_allocation
max_daily_loss
current_position_quantity
current_position_avg_price
total_pnl
status
stage_1_completed
stage_2_completed
stage_3_completed
created_at
updated_at
```

Recommended defaults:

```text
status = ACTIVE
current_position_quantity = 0
current_position_avg_price = 0
total_pnl = 0
stage_1_completed = false
stage_2_completed = false
stage_3_completed = false
```

---

## 10. Worker Logic Changes

Worker should:

- Evaluate only strategies where `status === "ACTIVE"`.
- Ignore strategies where `status === "PAUSED"` or `status === "STOPPED"`.
- Update `current_position_quantity`, `current_position_avg_price`, and `total_pnl`.
- Mark `stage_1_completed`, `stage_2_completed`, and `stage_3_completed` when staged exits are executed.
- Mark strategy `COMPLETED` when all exit stages are complete and no active position remains.
- Respect `max_position_size`, `max_capital_allocation`, and `max_daily_loss`.
- Respect the configured buy window: `buy_time_start <= current_time <= buy_time_end`.

---

## 11. Error Response Shape

Use a consistent JSON error format for frontend toast handling:

```json
{
  "error": "human_or_machine_readable_error",
  "message": "Optional readable message"
}
```

Recommended status codes:

```text
400 validation error
401 unauthenticated/session expired
404 strategy not found
409 invalid strategy state transition
500 unexpected backend error
503 worker offline
```

---

## 12. Frontend API Checklist

The backend is compatible with the current frontend when these endpoints work:

```text
GET  /auth/login
POST /auth/login
GET  /worker/health
GET  /strategy/status
POST /strategy/activate
POST /strategy/deactivate
POST /strategy/pause
POST /strategy/resume
```

Minimum manual test flow:

1. Start backend on `http://localhost:5001`.
2. Start frontend on `http://localhost:5173`.
3. Login through Zerodha or submit a valid request token manually.
4. Open `/strategies`.
5. Activate an EMA strategy with all fields.
6. Confirm `/strategy/status` returns the full strategy object.
7. Pause the strategy.
8. Resume the strategy.
9. Deactivate the strategy.
10. Confirm dashboard cards update from strategy status polling.
