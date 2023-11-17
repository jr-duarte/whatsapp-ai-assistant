import 'dotenv/config'
import { Whatsapp, create as venomCreate } from "venom-bot";
import OpenAI from "openai";

venomCreate({
  session: "session-name",
})
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

const openai = new OpenAI({
  apiKey: String(process.env.OPENAI_API_KEY),
});

async function start(client: Whatsapp) {
  client.onAnyMessage(async (message) => {
    console.log(message)
    if (message?.from === `${process.env.MY_PHONE}@c.us` && message?.body?.includes(String(process.env.TRIGGER_COMMAND))) {
      console.log("entrou aqui")

      const content = `   
         ${String(process.env.TEMPLATE_COMMAND)} ${message.body}?"
      `.trim();

      const response = await openai.chat.completions.create({
        model: String(process.env.OPENAI_MODEL),
        temperature: Number(process.env.OPENAI_TEMPERATURE),
        stream: false,
        messages: [{ role: "user", content }],
      });

      client
        .sendText(
          message.from,
          `🤖: ${response.choices[0].message.content}`
        )
        .then((result: any) => {
          console.log("Result: ", result);
        })
        .catch((erro: any) => {
          console.error("Error when sending: ", erro);
        });
    }
  });
}
