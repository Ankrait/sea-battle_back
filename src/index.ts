import { server } from 'app';
import { HAS_POSTGRE } from 'common/constants';
import { getConfig } from 'config/config';
import { sequelize } from 'database/connectDB';

const PORT = getConfig('PORT');

const start = async () => {
	try {
		if (HAS_POSTGRE) {
			await sequelize.authenticate();
			await sequelize.sync();
		}

		server.listen(PORT, () => console.log('Server started'));
	} catch (e) {
		console.log(e);
	}
};
start();
