const { getAndroidKeystoreAsync } = require("@expo/config-plugins");

async function getSha1() {
  try {
    const keystore = await getAndroidKeystoreAsync();
    console.log("SHA-1:", keystore.sha1);
  } catch (error) {
    console.error("Error getting SHA-1:", error);
  }
}

getSha1();
