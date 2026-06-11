export interface WorkerHealth {
    status: string;
    interval_seconds: number;
}

export interface Strategy {
    id: number;
    symbol: string;
    ema_period: number;
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
}

export type StrategyCreatePayload = Omit<
    Strategy,
    | 'id'
    | 'current_position_quantity'
    | 'current_position_avg_price'
    | 'total_pnl'
    | 'status'
    | 'stage_1_completed'
    | 'stage_2_completed'
    | 'stage_3_completed'
>;

export interface DashboardSummary {
    activeCount: number;
    pausedCount: number;
    stoppedCount: number;
    completedCount: number;
    totalQuantityHeld: number;
    totalCapitalUtilized: number;
    totalUnrealizedPnl: number;
}

export interface AppState {
    userId: string | null;
    loggedIn: boolean;
    workerStatus: string;
    activeStrategies: Strategy[];
}

export interface LoginPayload {
    request_token: string;
    user_id: string;
}

export interface LoginResponse {
    message: string;
    user_id: string;
    access_token: string;
    session_data: unknown;
}
