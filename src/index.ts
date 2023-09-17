import { server } from 'app';
import { getConfig } from 'config/config';
import { sequelize } from 'database/connectDB';

const PORT = getConfig('PORT');

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		server.listen(PORT, () => console.log('Server started'));
	} catch (e) {
		console.log(e);
	}
};
start();
