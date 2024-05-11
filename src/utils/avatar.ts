import { CDN } from "@djs/rest";
import { type APIUser } from "@djs/core";

export function userAvatar(cdn: CDN, user: APIUser): string {
	return user.avatar
		? cdn.avatar(user.id, user.avatar)
		: cdn.defaultAvatar(Number((BigInt(user.id) >> 22n) % 6n));
}
