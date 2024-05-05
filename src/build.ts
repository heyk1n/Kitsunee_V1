const commands: string[] = [];

for await (const dir of Deno.readDir("./commands")) {
	if (dir.isFile) {
		commands.push(`./commands/${dir.name}`);
	}
}

const manifest = `
import { type Manifest } from "./types.d.ts";

${commands.map((ctx, index) => `import $${index} from "${ctx}";`).join("\n")}

export default {
    commands: [
        ${commands.map((_ctx, index) => `$${index}`).join(",\n")}
    ]
} satisfies Manifest`;

const raw = new ReadableStream({
	start(cont) {
		cont.enqueue(new TextEncoder().encode(manifest));
		cont.close();
	},
});

const proc = new Deno.Command(Deno.execPath(), {
	args: ["fmt", "-"],
	stdin: "piped",
	stdout: "piped",
	stderr: "null",
}).spawn();

await raw.pipeTo(proc.stdin);
const { stdout } = await proc.output();

await Deno.writeTextFile("manifest.gen.ts", new TextDecoder().decode(stdout));
