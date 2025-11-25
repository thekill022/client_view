async function translateText(text, target = "en") {
  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(
      text
    )}`
  );
  const data = await res.json();
  return data[0].map((item) => item[0]).join("");
}

export { translateText };

// usage
// const translated = await translateText("Hello World", "id");
// console.log(translated); // "Halo Dunia"
