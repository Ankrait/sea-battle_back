import { postgresRepository } from './postgresRepository';
import { jsonRepository } from './jsonRepository';
import { HAS_POSTGRE } from 'common/constants';

export const repository = HAS_POSTGRE ? postgresRepository : jsonRepository;
