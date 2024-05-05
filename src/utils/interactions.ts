import {
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandInteraction,
	type APIInteraction,
	type APIPingInteraction,
	ApplicationCommandType,
	InteractionType,
} from "@djs/core";

export function isCommandInteraction(
	interaction: APIInteraction,
): interaction is APIApplicationCommandInteraction {
	return interaction.type === InteractionType.ApplicationCommand;
}

export function isPingInteraction(
	interaction: APIInteraction,
): interaction is APIPingInteraction {
	return interaction.type === InteractionType.Ping;
}

export function isChatInputCommandInteraction(
	interaction: APIApplicationCommandInteraction,
): interaction is APIChatInputApplicationCommandInteraction {
	return interaction.data.type === ApplicationCommandType.ChatInput;
}
