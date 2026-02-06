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

	/*function showRes(k) {
		const mainFrame = document.querySelector("#mainFrame");
		mainFrame.innerHTML = "<ul>";
		for (let [i, j] of Object.entries(k)) {
			mainFrame.innerHTML =
				mainFrame.innerHTML +
				`<li> ${j.P_ID} - ${j.P_BODY} - ${j.CREATED_AT} </li>`;
		}
		mainFrame.innerHTML = mainFrame.innerHTML + "</ul>";
	}*/

	/*function showRes(k) {
		const mainFrame = document.querySelector("#mainFrame");
		while (mainFrame.hasChildNodes()) {
			mainFrame.removeChild(mainFrame.firstChild);
		}
		for (let [i, j] of Object.entries(k)) {
			const postCard = document.createElement("div");
			const postId = document.createElement("p");
			const postBody = document.createElement("p");
			const postDate = document.createElement("p");
			const br = document.createElement("br");
			postCard.style.width = "300px";
			postCard.style.height = "220px";
			postCard.style.border = "2px solid red";
			postCard.style.textAlign = "center";
			postCard.style.wordBreak = "break-all";
			postCard.style.overflowY = "scroll";
			postId.textContent = "Post ID:" + j.P_ID;
			postBody.textContent = j.P_BODY;
			postDate.textContent = "UPLOAD DATE: " + j.CREATED_AT;
			postCard.appendChild(postId);
			postCard.appendChild(postBody);
			postCard.appendChild(postDate);
			mainFrame.appendChild(postCard);
			mainFrame.appendChild(br);
		}
	}*/
	function showRes(k) {
		const mainFrame = document.querySelector("#mainFrame");
		while (mainFrame.hasChildNodes()) {
			mainFrame.removeChild(mainFrame.firstChild);
		}
		for (let [i, j] of Object.entries(k)) {
			const postCard = document.createElement("div");
			const postId = document.createElement("p");
			const postBody = document.createElement("p");
			const postDate = document.createElement("p");
			const br = document.createElement("br");
			postCard.classList.add("postCard");
			postId.classList.add("postId");
			postBody.classList.add("postBody");
			postDate.classList.add("postDate");
			postId.textContent = "Post ID: " + j.P_ID;
			postBody.textContent = j.P_BODY;
			postDate.textContent = "UPLOAD DATE: " + j.CREATED_AT;
			postCard.appendChild(postId);
			postCard.appendChild(postBody);
			postCard.appendChild(postDate);
			mainFrame.appendChild(postCard);
			mainFrame.appendChild(br);
		}
	}
	const br = document.createElement("br");
	mainFrame.appendChild(br);
})();
