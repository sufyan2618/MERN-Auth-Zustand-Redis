import app from './app.js';
import { connectDB } from './lib/db.js';
import { logger } from './config/logger.js';
import { ENV } from './util/dotenv.js';

// Start the server
connectDB().then(() => {
    app.listen(ENV.PORT, () => {
        logger.info(`Server is running on http://localhost:${ENV.PORT}`);
    });
});