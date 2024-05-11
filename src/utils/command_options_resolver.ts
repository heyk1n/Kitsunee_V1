import {
	type APIApplicationCommandInteractionDataBasicOption,
	APIApplicationCommandInteractionDataOption,
	type APIApplicationCommandInteractionDataSubcommandGroupOption,
	type APIApplicationCommandInteractionDataSubcommandOption,
	type APIApplicationCommandInteractionDataUserOption,
	type APIChatInputApplicationCommandInteraction,
	type APIUser,
	ApplicationCommandOptionType,
} from "@djs/core";

export function getUserOption(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required: true,
): APIUser;
export function getUserOption(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required?: boolean,
): APIUser | undefined;
export function getUserOption(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	required?: boolean,
): APIUser | undefined {
	const option = getOption<APIApplicationCommandInteractionDataUserOption>(
		interaction,
		name,
		ApplicationCommandOptionType.User,
		required,
	);

	if (!option) {
		if (required) {
			throw new Error(`No user option found with name ${name}!`);
		}
	} else {
		return interaction.data.resolved!.users![option.value];
	}
}

export function getOption<
	T extends APIApplicationCommandInteractionDataBasicOption,
>(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	type: ApplicationCommandOptionType,
	required: true,
): T;
export function getOption<
	T extends APIApplicationCommandInteractionDataBasicOption,
>(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	type: ApplicationCommandOptionType,
	required?: boolean,
): T | undefined;
export function getOption<
	T extends APIApplicationCommandInteractionDataBasicOption,
>(
	interaction: APIChatInputApplicationCommandInteraction,
	name: string,
	type: ApplicationCommandOptionType,
	required?: boolean,
): T | undefined {
	const options = getSubcommandGroup(interaction)?.options[0]?.options ??
		getSubcommand(interaction)?.options ?? interaction.data.options;

	const option = options?.find((ctx) =>
		ctx.name === name && ctx.type === type
	) as T;
	if (!option) {
		if (required) {
			throw new Error(`No option with name ${name} and type ${type}.`);
		}
	} else {
		return option;
	}
}

export function getSubcommand(
	interaction: APIChatInputApplicationCommandInteraction,
	required: true,
): APIApplicationCommandInteractionDataSubcommandOption;
export function getSubcommand(
	interaction: APIChatInputApplicationCommandInteraction,
	required?: boolean,
): APIApplicationCommandInteractionDataSubcommandOption | undefined;
export function getSubcommand(
	interaction: APIChatInputApplicationCommandInteraction,
	required?: boolean,
): APIApplicationCommandInteractionDataSubcommandOption | undefined {
	const option = interaction.data.options?.find(isSubcommandOption);
	if (!option) {
		if (required) {
			throw new Error(`No subcommand option found!`);
		}
	} else {
		return option;
	}
}

export function getSubcommandGroup(
	interaction: APIChatInputApplicationCommandInteraction,
	required: true,
): APIApplicationCommandInteractionDataSubcommandGroupOption;
export function getSubcommandGroup(
	interaction: APIChatInputApplicationCommandInteraction,
	required?: boolean,
): APIApplicationCommandInteractionDataSubcommandGroupOption | undefined;
export function getSubcommandGroup(
	interaction: APIChatInputApplicationCommandInteraction,
	required?: boolean,
): APIApplicationCommandInteractionDataSubcommandGroupOption | undefined {
	const option = interaction.data.options?.find(isSubcommandGroupOption);
	if (!option) {
		if (required) {
			throw new Error(`No subcommand group option found!`);
		}
	} else {
		return option;
	}
}

export function isSubcommandOption(
	option: APIApplicationCommandInteractionDataOption,
): option is APIApplicationCommandInteractionDataSubcommandOption {
	return option.type === ApplicationCommandOptionType.Subcommand;
}

export function isSubcommandGroupOption(
	option: APIApplicationCommandInteractionDataOption,
): option is APIApplicationCommandInteractionDataSubcommandGroupOption {
	return option.type === ApplicationCommandOptionType.SubcommandGroup;
}
