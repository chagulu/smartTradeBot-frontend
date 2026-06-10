export interface WorkerHealth {
    status: string;
    interval_seconds: number;
}

export interface Strategy {
    id: number;
    symbol: string;
    ema_period: number;
    quantity: number;
    entry_buffer_percent: number;
    profit_targets: number[];
    stop_loss: number;
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
