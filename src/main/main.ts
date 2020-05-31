import {WebService} from './web'
import {BeeBot} from 'bot/bot';
import '../../ts-paths'

const web = new WebService();
web.init();
const bot = new BeeBot();
bot.init();