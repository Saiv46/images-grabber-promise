const { ok, equal, AssertionError } = require("assert");
const fetchImage = require("./index");

async function test(label, before, ...funcs) {
	console.time(label);
	try {
		const fetched = await before();
		try {
			funcs.forEach(v => v(fetched));
			console.log(`${label} OK`);
			console.timeEnd(label);
		} catch (e) {
			console.error(`${label} FAIL`, e);
			throw e;
		}
	} catch (e) {
		console.timeEnd(label);
		throw e;
	}
	
}

function testVK(name, url, ...funcs) {
	return test(`VK ${name} (${url})`, () => fetchImage.vk(url), ...funcs)
}

function testReddit(name, url, ...funcs) {
	return test(`Reddit ${name} (${url})`, () => fetchImage.reddit(url), ...funcs)
}

const is = {
	link: v => new URL(v),
	linkSafe: v => { try { is.link(v); return true } catch (e) { return false } },
	jpg: v => is.link(v) && ok(new URL(v).pathname.endsWith(".jpg"), `URL path "${v}" not ends with .jpg`),
	png: v => is.link(v) && ok(new URL(v).pathname.endsWith(".png"), `URL path "${v}" not ends with .png`),
	samePath: (a, b) => equal(is.linkSafe(a) ? new URL(a).pathname : a, is.linkSafe(b) ? new URL(b).pathname : b)
};
is.array = {};
for (const name in is) {
	const func = is[name];
	if (typeof func !== 'function') continue;
	is.array[name] = a => {
		ok(Array.isArray(a), "Result is not an array");
		a.forEach(v => func(v));
	};
}

(async () => {
	await testReddit("full link", "https://www.reddit.com/r/DDLC/comments/8c8k2v/only_js_function_which_works_correctly/", is.array.png);
	await testReddit("short link", "https://redd.it/8kimm3", is.array.png);

	await testVK("wall", "https://vk.com/wall-168965593_1604", is.array.jpg, w => {
		[
			"/c857632/v857632531/173335/iUlssMo6Fn8.jpg",
			"/c857632/v857632531/17333f/Nq76kMBKtmc.jpg",
			"/c857632/v857632531/173349/vbU7C8ujb7Y.jpg"
		].every((v, i) => is.samePath(w[i], v))
	}
	);
	await testVK("photo", "https://vk.com/photo1_456256890", is.array.jpg, ([ p ]) => is.samePath(p, "/c639230/v639230001/fabe/yU0Q2Knm9PY.jpg"));
	await testVK("album", "https://vk.com/album393055078_0", is.array.jpg);
	
	try {
		await testVK("doc throws", "https://vk.com/doc393055078_536126416", ([ p ]) => is.samePath(p, "/c848216/u76071059/docs/d17/93b993ab8078/gachiteam.gif"));
	} catch {
		console.log(`VK doc throw OK`)
	}
})().catch(e => (console.error('Uncaught error', e), process.exit(1)));
