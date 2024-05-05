import { fetch as sapphireFetch } from "@sapphire/fetch";
import { type ChatInputCommand, type KitsuAPIData } from "../types.d.ts";
import {
	type APIInteractionResponseDeferredChannelMessageWithSource,
	InteractionResponseType,
} from "@djs/core";
import { basename } from "@std/url/basename";

export default {
	data: {
		name: "pap",
		description: "🍥 · Gacha foto Kitsune, Free.",
	},
	execute(api, interaction) {
		queueMicrotask(async () => {
			const { data: imageUrl } = await sapphireFetch<KitsuAPIData>(
				Deno.env.get("KITSU_API_URL")!,
			);
			const response = await fetch(imageUrl);
			const data = await response.arrayBuffer();

			await api.interactions.editReply(
				interaction.application_id,
				interaction.token,
				{
					files: [{
						name: basename(imageUrl),
						data: new Uint8Array(data),
					}],
				},
			);
		});

		return Response.json(
			{
				type: InteractionResponseType.DeferredChannelMessageWithSource,
			} satisfies APIInteractionResponseDeferredChannelMessageWithSource,
		);
	},
} satisfies ChatInputCommand;
