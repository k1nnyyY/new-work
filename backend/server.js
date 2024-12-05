const TelegramBot = require("node-telegram-bot-api");

// Ваш токен бота
const TOKEN = "7718882241:AAG9ABx0ggQMUNRAtkKkTRgWhb8IfTIB_i0";
const bot = new TelegramBot(TOKEN, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть Web App",
            web_app: { url: "https://new-work-kohl.vercel.app" }, // Ссылка на ваш развернутый React
          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "Нажмите на кнопку ниже, чтобы открыть Web App:", options);
});
