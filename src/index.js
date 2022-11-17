const TelegramApi = require("node-telegram-bot-api");
const { api } = require("../config");

const bot = new TelegramApi(api, { polling: true });

const { contactOptions, locationOption, gameOptions, againOptions, homeOptions, removeAllOptions } = require("./keyboards");

const chats = {};

bot.setMyCommands([
  { command: "/start", description: "Boshlang'ich uchrashuv" },
  { command: "/info", description: "Siz haqingizda ma'lumot" },
  { command: "/game", description: "Play game" },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "0 dan 9 gacha son tanladim");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber.toString();
  return bot.sendMessage(chatId, "soni top", gameOptions);
};
const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.jpg");
      return bot.sendMessage(chatId, `xush kelibsiz`, contactOptions);
    } else if (text === "/info") return bot.sendMessage(chatId, `sizning ismingiz ${msg.from.first_name}`);
    else if (text === "/game") return startGame(chatId);

    if (msg.text === "html") {
      return bot.sendMessage(
        chatId,
        `<b>bold</b> \n <i>italic</i> \n <em>italic with em</em> \n <a href=\"http://www.example.com/\">inline URL</a> \n <code>inline fixed-width code</code> \n <pre>pre-formatted fixed-width code block</pre>`,
        { parse_mode: "HTML" }
      );
    }

    if (msg.text === "test") {
      return;
    }

    console.log(msg);
    if (!msg.contact && !msg.location && !msg.text.startsWith("/")) return bot.sendMessage(chatId, "Men bu narsani bilmayman");
  });

  bot.on("contact", (msg) => {
    const chatId = msg.chat.id;
    return bot.sendMessage(chatId, `Thank you ${msg.contact.first_name} with phone ${msg.contact.phone_number}!`);
    // return bot.sendMessage(chatId, `Thank you ${msg.contact.first_name} with phone ${msg.contact.phone_number}!`, locationOption);
  });

  bot.on("location", (msg) => {
    const chatId = msg.chat.id;
    console.log(msg.location.latitude);
    console.log(msg.location.longitude);
    bot.sendMessage(chatId, "Thank you for location", removeAllOptions);
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") return startGame(chatId);
    console.log("callback_query", msg);

    if (!chats[chatId]) return bot.sendMessage(chatId, "🖐 Faqat bir marta bosish mumkin");
    if (data === chats[chatId]) {
      delete chats[chatId];
      return bot.sendMessage(chatId, `🏆Tabriklayman, siz to'g'ri soni tanladingiz, ${chats[chatId]}`);
    } else {
      delete chats[chatId];
      return bot.sendMessage(chatId, `🤦Afsuski noto'g'ri soni tanladingiz, ${chats[chatId]}`, againOptions);
    }
  });
};

start();
