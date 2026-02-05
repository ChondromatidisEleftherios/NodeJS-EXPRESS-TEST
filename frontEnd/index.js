(function main() {
	const postForm = document.querySelector("#postForm");
	const link1 = document.querySelector("#link1");
	const link2 = document.querySelector("#link2");
	postForm.addEventListener("submit", makePost);
	link1.addEventListener("click", setActive);
	link2.addEventListener("click", setActive);

	async function makePost(e) {
		e.preventDefault();
		let postBody = document.querySelector("#postText").value;
		const resultArea = document.querySelector("#result");
		let data;
		console.log("in");
		if (postBody !== undefined && postBody.trim() !== "") {
			data = await fetch("/createPost", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postBody: postBody }),
			});
			const a = await data.json();
			console.log(a.message);
			if (a.message === true) {
				resultArea.textContent = `GG! Inserted: ${a.inserted}!`;
			} else {
				resultArea.textContent = "Nope!";
			}
			document.querySelector("#postText").value = "";
		} else {
			resultArea.textContent = "NOPE!";
		}
	}

	async function getPosts(e) {
		e.preventDefault();
		console.log("boom");
		const data = await fetch("/readPosts");
	}

	async function setActive(e) {
		e.preventDefault();
		const getActive = document.getElementsByClassName("active");
		const getActiveId = getActive[0].id;
		console.log(getActive[0].id);
		let moveTo;
		if (getActiveId === "showPosts") {
			document.querySelector("#showPosts").classList.remove("active");
			moveTo = document.querySelector("#uploadPost");
		} else if (getActiveId === "uploadPost") {
			document.querySelector("#uploadPost").classList.remove("active");
			moveTo = document.querySelector("#showPosts");
		}
		moveTo.classList.add("active");
		if (moveTo.id === "showPosts") {
			const data = await fetch("/readPosts");
			const k = await data.json();
			showRes(k);
		}
	}

	function showRes(k) {
		const mainFrame = document.querySelector("#mainFrame");
		mainFrame.innerHTML = "<ul>";
		for (let [i, j] of Object.entries(k)) {
			mainFrame.innerHTML =
				mainFrame.innerHTML +
				`<li> ${j.P_ID} - ${j.P_BODY} - ${j.CREATED_AT} </li>`;
		}
		mainFrame.innerHTML = mainFrame.innerHTML + "</ul>";
	}
})();
