import { WebSocketLink, ws } from "msw";
import { faker } from "@faker-js/faker";
import { ACTIONS } from "@/constants";

const chat: WebSocketLink = ws.link("ws://localhost:3000");

export const handlers = [
  chat.addEventListener("connection", ({ client }) => {
    console.log("Connection estalished with MSW");

    let contractList = Array.from({
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

      if (data === ACTIONS.GET_CONTRACTS) {
        client.send(JSON.stringify({ type: data, data: contractList }));

        setInterval(
          () => {
            const randonChoice = Math.round(Math.random() * 10);
            const randomContract = contractList[randonChoice];

            const sendItem = {
              type: ACTIONS.UPDATE_STATUS,
              data: {
                id: randomContract?.id,
                data: ["active", "inactive", "pending"][
                  Math.floor(Math.max(0, Math.random() * 3))
                ],
              },
            };

            client.send(JSON.stringify(sendItem));
          },
          Number(import.meta.env.VITE_STATUS_UPDATE_DELAY)
        );

        setInterval(
          () => {
            const randonChoice = Math.round(Math.random() * 10);
            const randomContract = contractList[randonChoice];

            const sendItem = {
              type: ACTIONS.UPDATE_CLIENT_NAME,
              data: {
                id: randomContract?.id,
                data: faker.person.fullName(),
              },
            };

            client.send(JSON.stringify(sendItem));
          },
          Number(import.meta.env.VITE_NAME_UPDATE_DELAY)
        );
        return;
      }

      let parsedData: any;

      if (typeof data === "string") {
        parsedData = JSON.parse(data);
      }

      if (parsedData.type === ACTIONS.ADD_CONTRACT) {
        const newItem = {
          id: faker.string.uuid(),
          clientName: parsedData?.data?.clientName || faker.person.fullName(),
          status:
            parsedData?.data?.status ||
            faker.helpers.arrayElement(["active", "inactive", "pending"]),
        };

        contractList.push(newItem);
        client.send(
          JSON.stringify({ type: ACTIONS.ADD_CONTRACT, data: newItem })
        );
      }

      if (parsedData.type === ACTIONS.EDIT_CONTRACT) {
        const contract = contractList.find(
          (c) => c.id === parsedData?.data?.id
        );
        if (contract) {
          contract.clientName =
            parsedData?.data?.clientName || faker.person.fullName();
          contract.status =
            parsedData?.data?.status ||
            faker.helpers.arrayElement(["active", "inactive", "pending"]);
        }

        client.send(
          JSON.stringify({ type: ACTIONS.EDIT_CONTRACT, data: contractList })
        );
      }

      if (parsedData.type === ACTIONS.DELETE_CONTRACT) {
        const contractId = parsedData?.data?.id;
        contractList = contractList.filter((c) => c.id !== contractId);

        client.send(
          JSON.stringify({ type: ACTIONS.DELETE_CONTRACT, data: contractList })
        );
      }
    });
  }),
];
