import {WebService} from './web'
import {BeeBot} from './bot/bot';

const web = new WebService();
web.init();
const bot = new BeeBot();
bot.init();