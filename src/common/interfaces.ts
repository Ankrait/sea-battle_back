export type EventType = 'CONNECTION' | 'SCHEME' | 'READY' | 'HIT' | 'SURRENDER';
export type GameStatusType = 'INIT' | 'HIT1' | 'HIT2' | 'WIN1' | 'WIN2';
export type FieldType = 'EMPTY' | 'SHIP' | 'DEAD' | 'DEAD_SHIP' | 'MISS';

export interface IPosition {
	x: number;
	y: number;
}

export interface IGameResponse {
	gameId: string;

	userNumber: 1 | 2;

	user: string;
	enemy: string | null;

	userField: FieldType[][];
	enemyField: FieldType[][];

	status: GameStatusType;

	isReady: boolean;
	enemyIsReady: boolean;
}

export interface IGameIdResponse extends Pick<IGameResponse, 'gameId' | 'user'> {}

export interface IBasePayload {
	gameId: string;
	player: string;
}

export interface IBaseRequest<E extends EventType, O extends IBasePayload> {
	event: E;
	payload: O;
}

export interface IConnectionPayload extends IBasePayload {}

export interface ISchemePayload extends IBasePayload {
	field: FieldType[][];
}

export interface IReadyPayload extends IBasePayload {
	isReady: boolean;
}

export interface IHitPayload extends IBasePayload {
	hit: IPosition;
}

export type GameRequestType =
	| IBaseRequest<'SURRENDER', IBasePayload>
	| IBaseRequest<'CONNECTION', IConnectionPayload>
	| IBaseRequest<'SCHEME', ISchemePayload>
	| IBaseRequest<'READY', IReadyPayload>
	| IBaseRequest<'HIT', IHitPayload>;

export type WithOptional<T, K extends keyof T> = Partial<Omit<T, K>> &
	Required<Pick<T, K>>;
