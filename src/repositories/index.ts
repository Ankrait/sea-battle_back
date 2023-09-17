import { postgresRepository } from './postgresRepository';
import { jsonRepository } from './jsonRepository';

export const repository = false ? postgresRepository : jsonRepository;
