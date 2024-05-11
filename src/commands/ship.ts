import { type ChatInputCommand } from "../types.d.ts";
import {
	type APIApplicationCommandInteractionDataUserOption,
	type APIInteractionResponseChannelMessageWithSource,
	type APIInteractionResponseDeferredChannelMessageWithSource,
	ApplicationCommandOptionType,
	InteractionResponseType,
} from "@djs/core";
import { createCanvas, loadImage } from "canvas";
import { fetch as sapphireFetch, FetchResultTypes } from "@sapphire/fetch";
import {
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
			queueMicrotask(async () => {
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
				const heart = await loadImage(
					`./assets/heart${match}.png`,
				);
				const targetId = interaction.data.options?.find((ctx) =>
					ctx.name === "target"
				) as APIApplicationCommandInteractionDataUserOption;
				const someoneId = interaction.data.options?.find((ctx) =>
					ctx.name === "someone"
				) as APIApplicationCommandInteractionDataUserOption;
				const target =
					interaction.data.resolved!.users![targetId.value];
				const someone = someoneId
					? interaction.data.resolved!.users![someoneId.value]
					: interaction.member.user;
				const targetAvatar = await loadImage(
					await sapphireFetch(
						userAvatar(api.rest.cdn, target),
						FetchResultTypes.Buffer,
					),
				);
				const someoneAvatar = await loadImage(
					await sapphireFetch(
						userAvatar(api.rest.cdn, someone),
						FetchResultTypes.Buffer,
					),
				);

				context.drawImage(heart, 720, 0, 720, 720);

				context.beginPath();
				context.moveTo(360, 360);
				context.arc(360, 360, 360, 0, Math.PI * 2, true);
				context.moveTo(1800, 360);
				context.arc(1800, 360, 360, 0, Math.PI * 2, true);
				context.closePath();
				context.clip();

				context.drawImage(targetAvatar, 0, 0, 720, 720);
				context.drawImage(someoneAvatar, 1440, 0, 720, 720);

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
							data: await canvas.encode("png"),
						}],
					},
				);
			});

			return Response.json(
				{
					type: InteractionResponseType
						.DeferredChannelMessageWithSource,
				} satisfies APIInteractionResponseDeferredChannelMessageWithSource,
			);
		}
	},
} satisfies ChatInputCommand;
