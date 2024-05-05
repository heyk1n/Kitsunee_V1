import tweetnacl from "npm:tweetnacl@1.0.3";
import { STATUS_CODE } from "@std/http/status";
import { decodeHex } from "@std/encoding/hex";
import {
	API,
	type APIInteraction,
	APIInteractionResponsePong,
	InteractionResponseType,
} from "@djs/core";
import { REST } from "@djs/rest";
import {
	isChatInputCommand,
	isChatInputCommandInteraction,
	isCommandInteraction,
	isPingInteraction,
} from "./utils/mod.ts";
import manifest from "./manifest.gen.ts";

Deno.serve(
	async (request) => {
		const invalidRequest = new Response(null, {
			status: STATUS_CODE.Unauthorized,
		});

		switch (request.method) {
			case "POST": {
				const body = await request.text();
				const publicKey = Deno.env.get("DISCORD_PUBLIC_KEY")!;
				const signature = request.headers.get("x-signature-ed25519")!;
				const timestamp = request.headers.get("x-signature-timestamp")!;

				const isValid = tweetnacl.sign.detached.verify(
					new TextEncoder().encode(timestamp + body),
					decodeHex(signature),
					decodeHex(publicKey),
				);

				if (!isValid) {
					return invalidRequest;
				} else {
					const api = new API(
						new REST().setToken(Deno.env.get("DISCORD_TOKEN")!),
					);
					const interaction: APIInteraction = JSON.parse(body);

					if (isCommandInteraction(interaction)) {
						if (isChatInputCommandInteraction(interaction)) {
							const command = manifest.commands.find((command) =>
								command.data.name === interaction.data.name &&
								isChatInputCommand(command)
							);
							if (!command) {
								return invalidRequest;
							} else {
								return await command.execute(api, interaction);
							}
						} else {
							return invalidRequest;
						}
					} else if (isPingInteraction(interaction)) {
						await api.applicationCommands
							.bulkOverwriteGlobalCommands(
								interaction.application_id,
								manifest.commands.map((command) =>
									command.data
								),
							);

						return Response.json(
							{
								type: InteractionResponseType.Pong,
							} satisfies APIInteractionResponsePong,
						);
					} else {
						return invalidRequest;
					}
				}
			}
			default: {
				return invalidRequest;
			}
		}
	},
);
