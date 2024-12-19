import { WebSocketLink, ws } from "msw";
import { faker } from "@faker-js/faker";

const chat: WebSocketLink = ws.link("ws://localhost:3000");

export const handlers = [
  chat.addEventListener("connection", ({ client }) => {
    console.log("Connection estalished with MSW");

    const contractList = Array.from({
      length: import.meta.env.VITE_MOCK_TABLE_SIZE,
    }).map(() => ({
      id: faker.string.uuid(),
      clientName: faker.person.fullName(),
      status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
    }));

    client.addEventListener("message", ({ data }) => {
      if (data === "ping") {
        client.send("pong");
      }

      if (data === "get/contracts") {
        client.send(JSON.stringify({ type: data, data: contractList }));
      }

      setInterval(() => {
        const randonChoice = Math.round(Math.random() * 10);
        const randomContract = contractList[randonChoice];

        const sendItem = {
          type: "update/status",
          data: {
            id: randomContract?.id,
            data: ["active", "inactive", "pending"][
              Math.floor(Math.max(0, Math.random() * 3))
            ],
          },
        };

        client.send(JSON.stringify(sendItem));
      }, 10000);

      setInterval(() => {
        const randonChoice = Math.round(Math.random() * 10);
        const randomContract = contractList[randonChoice];

        const sendItem = {
          type: "update/clientName",
          data: {
            id: randomContract?.id,
            data: faker.person.fullName(),
          },
        };

        client.send(JSON.stringify(sendItem));
      }, 8000);
    });
  }),
];
