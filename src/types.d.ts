import {
	type API,
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandInteraction,
	type APIMessageApplicationCommandInteraction,
	type APIUserApplicationCommandInteraction,
	type ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
	type RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "@djs/core";
import { type STATUS_CODE } from "@std/http/status";

interface BaseCommand<
	Data extends RESTPostAPIApplicationCommandsJSONBody,
	Interaction extends APIApplicationCommandInteraction,
> {
	data: Data;
	execute(api: API, interaction: Interaction): Response | Promise<Response>;
}

export type ChatInputCommand = BaseCommand<
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	APIChatInputApplicationCommandInteraction
>;
export type ContextMenuCommand =
	| BaseCommand<
		Omit<RESTPostAPIContextMenuApplicationCommandsJSONBody, "type"> & {
			type: ApplicationCommandType.Message;
		},
		APIMessageApplicationCommandInteraction
	>
	| BaseCommand<
		Omit<RESTPostAPIContextMenuApplicationCommandsJSONBody, "type"> & {
			type: ApplicationCommandType.User;
		},
		APIUserApplicationCommandInteraction
	>;

export type Command = ChatInputCommand | ContextMenuCommand;

export interface KitsuAPIData {
	status: typeof STATUS_CODE;
	end_point: string;
	method: string;
	data: string;
}

export interface Manifest {
	commands: Command[];
}
