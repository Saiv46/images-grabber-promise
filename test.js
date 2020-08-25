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

(async () => {
	const is = {
		link: a => ok(a.every(v => v.startsWith("https://"))), 
		jpg: a => is.link(a) && ok(a.every(v => v.endsWith(".jpg"))),
		png: a => is.link(a) && ok(a.every(v => v.endsWith(".png")))
	};

	await testReddit("full link", "https://www.reddit.com/r/DDLC/comments/8c8k2v/only_js_function_which_works_correctly/", is.png);
	await testReddit("short link", "https://redd.it/8kimm3", is.png);

	await testVK("wall", "https://vk.com/wall-168965593_1604", is.jpg, w => 
		ok([
			"/c857632/v857632531/173335/iUlssMo6Fn8.jpg",
			"/c857632/v857632531/17333f/Nq76kMBKtmc.jpg",
			"/c857632/v857632531/173349/vbU7C8ujb7Y.jpg"
		].every((v, i) => w[i].endsWith(v)), "Filename has changed")
	);
	await testVK("photo", "https://vk.com/photo1_456256890", is.jpg, ([ p ]) => 
		ok(p.endsWith("/c639230/v639230001/fabe/yU0Q2Knm9PY.jpg"), "Filename has changed")
	);
	await testVK("album", "https://vk.com/album393055078_0", is.jpg);
	
	try {
		await testVK("doc throws", "https://vk.com/doc393055078_536126416", ([ p ]) => 
			equal(p, "https://psv4.userapi.com/c848216/u76071059/docs/d17/04a0e3641e66/gachiteam.gif")
		);
		throw new AssertionError("doc should throw with service token");
	} catch {
		console.log(`VK doc throw OK`)
	}
})().catch(() => process.exit(1));
