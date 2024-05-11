import { type ChatInputCommand } from "../types.d.ts";
import {
	type API,
	type APIChatInputApplicationCommandGuildInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	type APIInteractionResponseDeferredChannelMessageWithSource,
	ApplicationCommandOptionType,
	InteractionResponseType,
} from "@djs/core";
import { createCanvas, loadImage } from "canvas";
import {
	getUserOption,
	isGuildChatInputCommandInteraction,
	userAvatar,
} from "../utils/mod.ts";

export default {
	data: {
		name: "ship",
		description:
			"💞 · Ship your friend with someone and see if they match or not",
		dm_permission: false,
		options: [{
			name: "target",
			description: "💕 · The user you want to ship",
			type: ApplicationCommandOptionType.User,
			required: true,
		}, {
			name: "someone",
			description: "✨ · Someone to ship with the user",
			type: ApplicationCommandOptionType.User,
		}],
	},
	execute(api, interaction) {
		if (!isGuildChatInputCommandInteraction(interaction)) {
			return Response.json(
				{
					type: InteractionResponseType.ChannelMessageWithSource,
					data: { content: "This command isn't available in DM." },
				} satisfies APIInteractionResponseChannelMessageWithSource,
			);
		} else {
			queueMicrotask(() => ship(api, interaction));

			return Response.json(
				{
					type: InteractionResponseType
						.DeferredChannelMessageWithSource,
				} satisfies APIInteractionResponseDeferredChannelMessageWithSource,
			);
		}
	},
} satisfies ChatInputCommand;

async function ship(
	api: API,
	interaction: APIChatInputApplicationCommandGuildInteraction,
) {
	const percentage = Math.floor(Math.random() * 101);
	const match = Math.floor(percentage / 25);

	const matchMessages = [
		"Looks like it's not meant to be",
		"Seems like a bit of mismatch, huh?",
		"Not quite hitting the mark, huh?",
		"Let's give it a shot, maybe they'll end up together!",
		"You two are a perfect match!",
	];

	const canvas = createCanvas(2160, 720);
	const context = canvas.getContext("2d");

	const target = getUserOption(interaction, "target", true);
	const someone = getUserOption(interaction, "someone") ??
		interaction.member.user;

	context.drawImage(
		await loadImage(`./assets/heart${match}.png`),
		720,
		0,
		720,
		720,
	);

	context.beginPath();
	context.moveTo(360, 360);
	context.arc(360, 360, 360, 0, Math.PI * 2, true);
	context.moveTo(1800, 360);
	context.arc(1800, 360, 360, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();

	context.drawImage(
		await loadImage(userAvatar(api.rest.cdn, target)),
		0,
		0,
		720,
		720,
	);
	context.drawImage(
		await loadImage(userAvatar(api.rest.cdn, someone)),
		1440,
		0,
		720,
		720,
	);

	await api.interactions.editReply(
		interaction.application_id,
		interaction.token,
		{
			content:
				`**${target.username}** and **${someone.username}** are ${percentage}% match! 💞\n${
					matchMessages[match]
				}`,
			files: [{
				name: "ship.png",
				data: await canvas.toBuffer(),
			}],
		},
	);
}
