# SmartTradeBot Frontend Development Guide (EMA Strategy v2)

## Objective

Develop a production-ready React frontend for SmartTradeBot that supports complete management of EMA-based automated trading strategies integrated with Zerodha.

---

# Technology Stack

* React 19+
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router
* React Hook Form
* React Hot Toast
* Lucide React
* Recharts

---

# Backend URL

Development:

http://localhost:5001

---

# Pages Required

## Login Page

Route:

/login

Features:

* Login with Zerodha button
* Logout support
* Persist authentication state using Context + Local Storage

---

## Dashboard

Route:

/

Widgets:

1. Worker Health
2. Strategy Summary
3. Position Summary
4. Total P&L
5. Quick Actions
6. Recent Activity

---

## Strategy Management

Route:

/strategies

Purpose:

Create, view, deactivate, pause, and monitor EMA strategies.

---

# Strategy Activation Form

The frontend MUST expose ALL strategy parameters supported by backend.

---

## General Information

Fields:

Symbol (text)

EMA Period (number)

Default:

100

Validation:

EMA > 0

---

## Buy Window

Fields:

Buy Start Time

Buy End Time

Input Type:

time

Default Values:

15:15

15:30

Validation:

End Time > Start Time

---

## Profit Booking Configuration

Fields:

Stage 1 Profit %

Stage 2 Profit %

Stage 3 Profit %

Defaults:

10

20

30

Validation:

Stage 1 < Stage 2 < Stage 3

All > 0

---

## Risk Management

Fields:

Stop Loss %

Maximum Position Size

Maximum Capital Allocation

Maximum Daily Loss

Defaults:

Stop Loss = 15

Maximum Position Size = 1000

Capital Allocation = 50000

Maximum Daily Loss = 5000

Validation:

All values > 0

---

# Activate Strategy API

POST /strategy/activate

Payload:

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

---

# Strategy Status API

GET /strategy/status

Expected Response:

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

---

# Strategy Table Columns

Display:

Strategy ID

Symbol

EMA Period

Buy Window

Profit Targets

Stop Loss

Current Position

Average Price

Total P&L

Strategy Status

Stage Progress

Actions

---

# Stage Progress Display

Show badges:

Stage 1 Completed

Stage 2 Completed

Stage 3 Completed

Examples:

✓ Stage 1

Pending Stage 2

Pending Stage 3

---

# Strategy Actions

Buttons:

Deactivate

Pause

Resume

Refresh

Confirmation dialog required before destructive actions.

---

# Dashboard Cards

Worker Status

Display:

Running / Offline

Evaluation Interval

Last Checked Timestamp

---

Position Summary

Display:

Total Active Strategies

Total Quantity Held

Total Capital Utilized

Total Unrealized P&L

---

Quick Actions

Buttons:

Activate Strategy

Manage Strategies

Refresh Dashboard

---

# Worker Health API

GET /worker/health

Display:

Worker Status

Evaluation Interval

Last Updated

---

# Polling Requirements

Worker Health:

30 seconds

Strategy Status:

15 seconds

Dashboard Summary:

30 seconds

---

# State Management

Use React Context.

Persist:

loggedIn

userId

---

# Folder Structure

src/

components/

pages/

services/

hooks/

context/

types/

utils/

layouts/

---

# Components Required

Header

Sidebar

WorkerHealthCard

PositionSummaryCard

QuickActionsCard

StrategyForm

StrategyListCard

StrategyStatusBadge

StageProgressBadge

Loader

ToastNotification

ConfirmationModal

---

# TypeScript Interfaces

interface Strategy {
id: number;
symbol: string;
ema_period: number;

```
buy_time_start: string;
buy_time_end: string;

stage_1_profit_percent: number;
stage_2_profit_percent: number;
stage_3_profit_percent: number;

stop_loss_percent: number;

max_position_size: number;
max_capital_allocation: number;
max_daily_loss: number;

current_position_quantity: number;
current_position_avg_price: number;

total_pnl: number;

status: 'ACTIVE' | 'PAUSED' | 'STOPPED' | 'COMPLETED';

stage_1_completed: boolean;
stage_2_completed: boolean;
stage_3_completed: boolean;
```

}

---

# Acceptance Criteria

Frontend is complete only when:

✓ All EMA parameters can be configured.

✓ Buy time window is configurable.

✓ Risk management settings are configurable.

✓ Active strategy table displays all strategy metrics.

✓ Strategy stages are visually represented.

✓ Worker health is displayed.

✓ Dashboard summaries update automatically.

✓ Strategy activation succeeds using backend payload.

✓ Strategy deactivation works.

✓ Layout is responsive for desktop and tablet.

✓ Authentication persists across refreshes.
