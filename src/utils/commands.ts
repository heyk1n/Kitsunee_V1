import { ApplicationCommandType } from "@djs/core";
import type { ChatInputCommand, Command } from "../types.d.ts";

export function isChatInputCommand(
	command: Command,
): command is ChatInputCommand {
	return command.data.type === ApplicationCommandType.ChatInput ||
		command.data.type === undefined;
}
